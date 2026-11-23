import React, { useEffect, useState, useRef } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";

const BASE_URL = (() => {
  if (typeof window !== "undefined") {
    const h = window.location.hostname;
    if (h === "localhost" || h === "127.0.0.1") return "http://localhost:8000";
  }
  return "https://bg-system-3.onrender.com";
})();

const COLS = [
  { key: "index",        label: "#",                   w: "w-10" },
  { key: "_id",          label: "Docket ID",           w: "w-28" },
  { key: "dateOfRequest",label: "Date",                w: "w-24" },
  { key: "department",   label: "Department",          w: "w-32" },
  { key: "location",     label: "Location",            w: "w-28" },
  { key: "workOrderNo",  label: "Work Order No.",      w: "w-28" },
  { key: "typeOfWork",   label: "Type of Work",        w: "w-36" },
  { key: "jobValue",     label: "Job Value (₹)",       w: "w-28" },
  { key: "requesterName",label: "First Owner",         w: "w-28" },
  { key: "superiorName", label: "Alternate Owner",     w: "w-28" },
  { key: "partyName",    label: "Party Name",          w: "w-32" },
  { key: "natureOfBG",   label: "Nature of BG",        w: "w-28" },
  { key: "bgAmount",     label: "BG Amount (₹)",       w: "w-28" },
  { key: "bgExpiryDate", label: "Expiry Date",         w: "w-24" },
  { key: "claimPeriod",  label: "Claim Period",        w: "w-24" },
  { key: "status",       label: "Status",              w: "w-24" },
];

const STATUS_COLORS = {
  Pending:  "bg-amber-500/20 text-amber-300 border-amber-500/40",
  Approved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  Rejected: "bg-rose-500/20 text-rose-300 border-rose-500/40",
  Returned: "bg-blue-500/20 text-blue-300 border-blue-500/40",
};

const FILTER_TABS = ["All", "Pending", "Approved", "Rejected", "Returned"];

function DocLink({ filename, label }) {
  if (!filename) return <span className="text-slate-600 text-xs italic">Not uploaded</span>;
  const url = `${BASE_URL}/uploads/${filename}`;
  return (
    <a href={url} target="_blank" rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-200 underline underline-offset-2">
      <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
      </svg>
      {label}
    </a>
  );
}

function Approval() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = ["BG Administrator","Admin","admin","Lead Admin"].includes(user.role);

  const [requests, setRequests]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState("All");
  const [expanded, setExpanded]       = useState(null);
  const [adminRemarks, setAdminRemarks] = useState({});
  const [actionMsg, setActionMsg]     = useState({ id: null, msg: "", ok: true });
  const msgTimer = useRef(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await API.get("/bg");
      setRequests(res.data?.data || []);
    } catch { setRequests([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const showMsg = (id, msg, ok = true) => {
    clearTimeout(msgTimer.current);
    setActionMsg({ id, msg, ok });
    msgTimer.current = setTimeout(() => setActionMsg({ id: null, msg: "", ok: true }), 3000);
  };

  const updateStatus = async (id, status) => {
    if (!isAdmin) return showMsg(id, "Permission Denied: Only Admin can approve or reject.", false);
    try {
      await API.put(`/bg/${id}/status`, { status, adminRemarks: adminRemarks[id] || "", userRole: user.role },
        { headers: { "x-user-role": user.role } });
      setRequests(prev => prev.map(r => (r._id === id || r.id === id) ? { ...r, status, adminRemarks: adminRemarks[id] || r.adminRemarks } : r));
      showMsg(id, `Marked as ${status}`, true);
    } catch (err) {
      showMsg(id, err.response?.data?.message || "Action failed", false);
    }
  };

  const filtered = requests.filter(r => filter === "All" || r.status === filter);

  return (
    <MainLayout>
      <div className="max-w-full space-y-5">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-indigo-400">Risk & Verification Desk</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">BG Approval Management</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              All 15 BG docket columns displayed. {isAdmin ? "Admin sign-off active." : "Read-only view — approval restricted to Admin."}
            </p>
          </div>
          <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-[#0d1222] border border-white/10">
            {FILTER_TABS.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${filter === t ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ROLE BANNER */}
        {!isAdmin ? (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3 text-xs text-amber-200">
            <span className="text-amber-300 text-base">🔒</span>
            <span>
              You are signed in as <strong className="text-white">{user.fullName}</strong> ({user.role}).
              Approve / Reject actions are restricted to <strong className="text-amber-300">BG Administrator</strong> only.
            </span>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-300">
            <span>✓</span>
            <span>Admin session active — <strong>{user.fullName}</strong>. You have authorization to approve, reject or return dockets.</span>
          </div>
        )}

        {/* TABLE */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">Loading BG requests…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">No records for "{filter}" filter.</div>
        ) : (
          <div className="bg-glass-card rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-xs min-w-[1200px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-left">
                  {COLS.map(c => (
                    <th key={c.key} className={`py-3 px-3 text-[10px] font-mono font-bold uppercase text-slate-400 ${c.w}`}>
                      {c.label}
                    </th>
                  ))}
                  <th className="py-3 px-3 text-[10px] font-mono font-bold uppercase text-slate-400 w-28">Remarks</th>
                  <th className="py-3 px-3 text-[10px] font-mono font-bold uppercase text-slate-400 w-48 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => {
                  const isOpen = expanded === item._id;
                  return (
                    <React.Fragment key={item._id}>
                      <tr
                        onClick={() => setExpanded(isOpen ? null : item._id)}
                        className="border-b border-white/5 hover:bg-white/[0.03] transition cursor-pointer group"
                      >
                        <td className="py-3 px-3 text-slate-500 font-mono">{idx + 1}</td>
                        <td className="py-3 px-3 font-mono text-indigo-300">
                          <span className="flex items-center gap-1.5">
                            <span className="text-slate-600 group-hover:text-slate-400 transition">{isOpen ? "▼" : "▶"}</span>
                            {String(item._id || "").slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-300 font-mono whitespace-nowrap">{item.dateOfRequest || "—"}</td>
                        <td className="py-3 px-3 text-slate-300">{item.department || "—"}</td>
                        <td className="py-3 px-3 text-slate-400">{item.location || "—"}</td>
                        <td className="py-3 px-3 text-slate-400 font-mono">{item.workOrderNo || "—"}</td>
                        <td className="py-3 px-3 text-slate-300">{item.typeOfWork || "—"}</td>
                        <td className="py-3 px-3 text-slate-300 font-mono text-right whitespace-nowrap">₹ {Number(item.jobValue||0).toLocaleString()}</td>
                        <td className="py-3 px-3 text-white font-semibold">{item.requesterName || "—"}</td>
                        <td className="py-3 px-3 text-slate-400">{item.superiorName || "—"}</td>
                        <td className="py-3 px-3 text-slate-300">{item.partyName || "—"}</td>
                        <td className="py-3 px-3 text-slate-400">{item.natureOfBG || "—"}</td>
                        <td className="py-3 px-3 font-mono font-bold text-cyan-300 whitespace-nowrap text-right">₹ {Number(item.bgAmount||0).toLocaleString()}</td>
                        <td className="py-3 px-3 text-amber-300 font-mono whitespace-nowrap">{item.bgExpiryDate || "—"}</td>
                        <td className="py-3 px-3 text-slate-400">{item.claimPeriod || "—"}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_COLORS[item.status] || "bg-slate-800 text-slate-300"}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />{item.status || "Pending"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-400 max-w-[120px] truncate">
                          {item.adminRemarks || item.remarks || "—"}
                        </td>
                        <td className="py-3 px-3 text-right" onClick={e => e.stopPropagation()}>
                          {isAdmin ? (
                            <div className="flex items-center justify-end gap-1 flex-wrap">
                              <button onClick={() => updateStatus(item._id, "Approved")}
                                className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold transition cursor-pointer whitespace-nowrap">
                                ✓ Approve
                              </button>
                              <button onClick={() => updateStatus(item._id, "Rejected")}
                                className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/40 text-rose-300 text-[10px] font-semibold transition cursor-pointer whitespace-nowrap">
                                ✕ Reject
                              </button>
                              <button onClick={() => updateStatus(item._id, "Returned")}
                                className="px-2 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/35 border border-blue-500/40 text-blue-300 text-[10px] font-semibold transition cursor-pointer whitespace-nowrap">
                                ↩ Return
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-600 italic">Admin only</span>
                          )}
                        </td>
                      </tr>

                      {/* ACTION MESSAGE inline */}
                      {actionMsg.id === item._id && (
                        <tr>
                          <td colSpan={18} className={`px-4 py-1.5 text-xs font-semibold ${actionMsg.ok ? "text-emerald-400" : "text-rose-400"}`}>
                            {actionMsg.ok ? "✓" : "⚠"} {actionMsg.msg}
                          </td>
                        </tr>
                      )}

                      {/* EXPANDED ROW: full details + documents */}
                      {isOpen && (
                        <tr className="bg-white/[0.015]">
                          <td colSpan={18} className="p-5 border-t border-white/5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">

                              {/* Contract Particulars */}
                              <div className="space-y-1.5">
                                <p className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider mb-2">Contract Particulars</p>
                                {[
                                  ["Department",    item.department],
                                  ["Location",      item.location],
                                  ["Work Order",    item.workOrderNo],
                                  ["Type of Work",  item.typeOfWork],
                                  ["Job Value",     `₹ ${Number(item.jobValue||0).toLocaleString()}`],
                                  ["Requester",     item.requesterName],
                                  ["Superior",      item.superiorName],
                                  ["Submitted By",  item.submittedBy + (item.submittedByRole ? ` (${item.submittedByRole})` : "")],
                                ].map(([k,v]) => (
                                  <div key={k} className="flex gap-2">
                                    <span className="text-slate-500 w-24 flex-shrink-0">{k}:</span>
                                    <span className="text-white">{v || "—"}</span>
                                  </div>
                                ))}
                              </div>

                              {/* BG Terms */}
                              <div className="space-y-1.5">
                                <p className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">BG Terms</p>
                                {[
                                  ["Party",        item.partyName],
                                  ["Nature of BG", item.natureOfBG],
                                  ["BG Amount",    `₹ ${Number(item.bgAmount||0).toLocaleString()}`],
                                  ["Expiry Date",  item.bgExpiryDate],
                                  ["Claim Period", item.claimPeriod],
                                  ["Remarks",      item.remarks || "—"],
                                ].map(([k,v]) => (
                                  <div key={k} className="flex gap-2">
                                    <span className="text-slate-500 w-24 flex-shrink-0">{k}:</span>
                                    <span className="text-white">{v || "—"}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Documents + Admin Remarks */}
                              <div className="space-y-3">
                                <p className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">Attachments</p>
                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                                  <DocLink filename={item.bgDraft}           label="I. BG Vetted Draft" />
                                  <DocLink filename={item.mdApproval}        label="II. MD Approval" />
                                  <DocLink filename={item.boardApproval}     label="III. Board Approval" />
                                  <DocLink filename={item.beneficiaryClause} label="IV. Beneficiary Clause" />
                                  <DocLink filename={item.bankDetails}       label="V. Bank Account Details" />
                                </div>

                                {isAdmin && (
                                  <div className="space-y-1.5">
                                    <p className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Admin Remarks</p>
                                    <textarea
                                      rows={2}
                                      placeholder="Enter admin remarks / audit notes…"
                                      value={adminRemarks[item._id] ?? item.adminRemarks ?? ""}
                                      onChange={e => setAdminRemarks(p => ({ ...p, [item._id]: e.target.value }))}
                                      onClick={e => e.stopPropagation()}
                                      className="w-full px-3 py-2 rounded-xl bg-[#060814] border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 resize-none"
                                    />
                                    <p className="text-[10px] text-slate-500">These remarks are recorded permanently into the audit trail.</p>
                                  </div>
                                )}
                                {!isAdmin && item.adminRemarks && (
                                  <div>
                                    <p className="text-[10px] font-mono font-bold text-emerald-400 uppercase mb-1">Admin Remarks</p>
                                    <p className="text-xs text-slate-300 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">{item.adminRemarks}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-[10px] text-slate-600 font-mono text-right">
          {filtered.length} record(s) shown
        </p>
      </div>
    </MainLayout>
  );
}

export default Approval;
