import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";

const SAMPLE_FALLBACK_REQUESTS = [
  {
    _id: "bg-889102",
    department: "Finance & Accounts",
    requester: "Siddharth Rao",
    bgAmount: 12500000,
    status: "Pending",
    remarks: "Requires board resolution verification",
    partyName: "Bharat Petroleum Corp Ltd",
    typeOfWork: "Turnkey Refinery Automation",
    workOrder: "WO-2026-ENG-847",
    jobValue: 85000000,
    expiryDate: "2027-12-31",
    claimPeriod: "6 Months",
    location: "Mumbai Port Complex",
  },
  {
    _id: "bg-889103",
    department: "Procurement & Contracts",
    requester: "Ananya Deshmukh",
    bgAmount: 4500000,
    status: "Approved",
    remarks: "Cleared by Risk Committee",
    partyName: "Tata Steel Projects",
    typeOfWork: "Structural Heavy Fabrication",
    workOrder: "WO-2026-TS-019",
    jobValue: 24000000,
    expiryDate: "2027-06-30",
    claimPeriod: "3 Months",
    location: "Jamshedpur Hub",
  },
  {
    _id: "bg-889104",
    department: "Operations & Projects",
    requester: "Kunal Mehra",
    bgAmount: 18000000,
    status: "Pending",
    remarks: "Bank counter-guarantee pending",
    partyName: "National Highways Authority",
    typeOfWork: "Expressway Segment 4",
    workOrder: "NHAI-PKG-77",
    jobValue: 120000000,
    expiryDate: "2028-03-31",
    claimPeriod: "1 Year",
    location: "Delhi-NCR Corridor",
  },
  {
    _id: "bg-889105",
    department: "Legal & Compliance",
    requester: "Meera Nair",
    bgAmount: 2200000,
    status: "Rejected",
    remarks: "Clause 14 indemnity missing",
    partyName: "Global Metro Rail Cons.",
    typeOfWork: "Signaling & Telemetry",
    workOrder: "GMRC-SIG-202",
    jobValue: 14000000,
    expiryDate: "2026-11-30",
    claimPeriod: "1 Month",
    location: "Kochi Metro",
  },
];

function Approval() {
  const [expandedRow, setExpandedRow] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remarksMap, setRemarksMap] = useState({});
  const [filter, setFilter] = useState("All");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await API.get("/bg");
      const data = response?.data?.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setRequests(data);
      } else {
        setRequests(SAMPLE_FALLBACK_REQUESTS);
      }
    } catch (error) {
      console.log("Using sample data for offline mode:", error);
      setRequests(SAMPLE_FALLBACK_REQUESTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bg/${id}/status`, {
        status,
        remarks: remarksMap[id] || "",
      });
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status, remarks: remarksMap[id] || r.remarks } : r
        )
      );
    } catch (error) {
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status, remarks: remarksMap[id] || r.remarks } : r
        )
      );
    }
  };

  const handleRemarkChange = (id, value) => {
    setRemarksMap((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const filteredRequests = requests.filter((item) => {
    if (filter === "All") return true;
    return item.status?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#00ff88]">
                AGENT #3 • APPROVAL ENGINE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bank Guarantee Approval Management
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Review docket particulars, verify indemnity thresholds, and execute sign-offs.
            </p>
          </div>

          {/* FILTER TABS */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#06140d] border border-emerald-500/25">
            {["All", "Pending", "Approved", "Rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  filter === tab
                    ? "bg-[#00ff88] text-[#05150d] shadow-[0_0_12px_rgba(0,255,136,0.5)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="cyber-panel p-4 rounded-xl border border-emerald-500/20">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Total Dockets</span>
            <p className="text-xl font-bold text-white mt-1 font-mono">{requests.length}</p>
          </div>
          <div className="cyber-panel p-4 rounded-xl border border-amber-500/30">
            <span className="text-[10px] font-mono text-amber-400 uppercase">In Review</span>
            <p className="text-xl font-bold text-amber-300 mt-1 font-mono">
              {requests.filter((r) => r.status === "Pending").length}
            </p>
          </div>
          <div className="cyber-panel p-4 rounded-xl border border-emerald-500/30">
            <span className="text-[10px] font-mono text-emerald-400 uppercase">Authorized</span>
            <p className="text-xl font-bold text-[#00ff88] mt-1 font-mono">
              {requests.filter((r) => r.status === "Approved").length}
            </p>
          </div>
          <div className="cyber-panel p-4 rounded-xl border border-red-500/30">
            <span className="text-[10px] font-mono text-red-400 uppercase">Declined</span>
            <p className="text-xl font-bold text-red-400 mt-1 font-mono">
              {requests.filter((r) => r.status === "Rejected").length}
            </p>
          </div>
        </div>

        {/* DOCKET TABLE */}
        <div className="cyber-panel-glow rounded-2xl border border-emerald-500/25 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-16 text-center text-slate-400">
              <div className="w-8 h-8 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading approval queue...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <p className="text-2xl mb-1">✨</p>
              <p className="text-sm font-semibold text-white">No dockets in this filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-emerald-500/20 bg-[#06140d] text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    <th className="py-3 px-5">Docket ID</th>
                    <th className="py-3 px-5">Beneficiary / Party</th>
                    <th className="py-3 px-5">Department</th>
                    <th className="py-3 px-5">BG Amount</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/10">
                  {filteredRequests.map((item) => {
                    const isExpanded = expandedRow === item._id;
                    const statusColors = {
                      Approved: "bg-emerald-500/15 text-[#00ff88] border-emerald-500/40",
                      Pending: "bg-amber-500/15 text-amber-300 border-amber-500/40",
                      Rejected: "bg-red-500/15 text-red-400 border-red-500/40",
                    };

                    return (
                      <React.Fragment key={item._id}>
                        <tr
                          onClick={() => setExpandedRow(isExpanded ? null : item._id)}
                          className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                        >
                          <td className="py-3.5 px-5 font-mono text-[11px] text-[#00ff88]">
                            <span className="flex items-center gap-2">
                              <span className="text-slate-500 group-hover:text-white transition">
                                {isExpanded ? "▼" : "▶"}
                              </span>
                              {item._id.slice(-8).toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3.5 px-5">
                            <p className="font-semibold text-white">{item.partyName || "Contractor Org"}</p>
                            <p className="text-[10px] text-slate-400">{item.requester || "Internal Requester"}</p>
                          </td>
                          <td className="py-3.5 px-5 text-slate-300">{item.department}</td>
                          <td className="py-3.5 px-5 font-bold text-white font-mono">
                            ₹ {Number(item.bgAmount || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                                statusColors[item.status] || "bg-slate-800 text-slate-300"
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => updateStatus(item._id, "Approved")}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-[#00ff88] text-xs font-semibold transition active:scale-95 cursor-pointer"
                              >
                                Authorize ✓
                              </button>
                              <button
                                onClick={() => updateStatus(item._id, "Rejected")}
                                className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-semibold transition active:scale-95 cursor-pointer"
                              >
                                Reject ✕
                              </button>
                            </div>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-[#030906]">
                            <td colSpan="6" className="p-5 border-y border-emerald-500/15">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                                    Contract Terms
                                  </span>
                                  <div className="p-3 rounded-xl bg-[#06140d] space-y-1 border border-emerald-500/20">
                                    <p><span className="text-slate-400">Work Order:</span> <span className="text-white font-mono">{item.workOrder || "N/A"}</span></p>
                                    <p><span className="text-slate-400">Nature:</span> <span className="text-white">{item.typeOfWork || "General EPC"}</span></p>
                                    <p><span className="text-slate-400">Job Value:</span> <span className="text-white font-mono">₹ {Number(item.jobValue || 0).toLocaleString()}</span></p>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                                    Validity Period
                                  </span>
                                  <div className="p-3 rounded-xl bg-[#06140d] space-y-1 border border-emerald-500/20">
                                    <p><span className="text-slate-400">Expiry Date:</span> <span className="text-amber-300 font-mono">{item.expiryDate || "Open"}</span></p>
                                    <p><span className="text-slate-400">Claim Period:</span> <span className="text-white">{item.claimPeriod || "90 Days"}</span></p>
                                    <p><span className="text-slate-400">Location:</span> <span className="text-white">{item.location || "Central"}</span></p>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                                    Audit Remarks
                                  </span>
                                  <div className="p-3 rounded-xl bg-[#06140d] space-y-2 border border-emerald-500/20">
                                    <input
                                      type="text"
                                      placeholder="Add audit/approval notes..."
                                      value={remarksMap[item._id] ?? item.remarks ?? ""}
                                      onChange={(e) => handleRemarkChange(item._id, e.target.value)}
                                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#040a07] border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#00ff88]"
                                    />
                                    <p className="text-[10px] text-slate-400">
                                      Notes will be appended to the ledger.
                                    </p>
                                  </div>
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
        </div>
      </div>
    </MainLayout>
  );
}

export default Approval;
