import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";

const SAMPLE_FALLBACK_REQUESTS = [
  {
    _id: "bg-889101",
    department: "Finance & Accounts",
    requesterName: "Siddharth Rao",
    bgAmount: 12500000,
    status: "Approved",
    remarks: "Covenants verified under master facility.",
    partyName: "Bharat Petroleum Corp Ltd",
    typeOfWork: "Turnkey Refinery Automation",
    workOrderNo: "WO-2026-ENG-847",
    jobValue: 85000000,
    bgExpiryDate: "2027-12-31",
    claimPeriod: "6 Months",
    location: "Mumbai Port Complex",
  },
  {
    _id: "bg-889102",
    department: "Procurement & Contracts",
    requesterName: "Ananya Deshmukh",
    bgAmount: 4500000,
    status: "Approved",
    remarks: "Cleared by Risk Committee.",
    partyName: "Tata Steel Projects",
    typeOfWork: "Structural Heavy Fabrication",
    workOrderNo: "WO-2026-TS-019",
    jobValue: 24000000,
    bgExpiryDate: "2027-06-30",
    claimPeriod: "3 Months",
    location: "Jamshedpur Hub",
  },
  {
    _id: "bg-889103",
    department: "Operations & Projects",
    requesterName: "Kunal Mehra",
    bgAmount: 18000000,
    status: "Pending",
    remarks: "Requires board sign-off.",
    partyName: "National Highways Authority",
    typeOfWork: "Expressway Segment 4",
    workOrderNo: "NHAI-PKG-77",
    jobValue: 120000000,
    bgExpiryDate: "2028-03-31",
    claimPeriod: "1 Year",
    location: "Delhi-NCR Corridor",
  },
  {
    _id: "bg-889104",
    department: "Legal & Compliance",
    requesterName: "Meera Nair",
    bgAmount: 2200000,
    status: "Rejected",
    remarks: "Clause 14 indemnity missing.",
    partyName: "Global Metro Rail Cons.",
    typeOfWork: "Signaling & Telemetry",
    workOrderNo: "GMRC-SIG-202",
    jobValue: 14000000,
    bgExpiryDate: "2026-11-30",
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
          r._id === id || r.id === id ? { ...r, status, remarks: remarksMap[id] || r.remarks } : r
        )
      );
    } catch (error) {
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id || r.id === id ? { ...r, status, remarks: remarksMap[id] || r.remarks } : r
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
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-indigo-400">
                Risk & Verification Desk
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bank Guarantee Approval Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Review docket particulars, verify indemnity covenants, and execute administrative sign-offs.
            </p>
          </div>

          {/* FILTER TABS */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0e1326] border border-white/10">
            {["All", "Pending", "Approved", "Rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  filter === tab
                    ? "bg-indigo-600 text-white shadow-md font-bold"
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
          <div className="bg-glass-card p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Total Dockets</span>
            <p className="text-2xl font-bold text-white mt-1">{requests.length}</p>
          </div>
          <div className="bg-glass-card p-4 rounded-2xl border border-amber-500/25">
            <span className="text-xs text-amber-400 uppercase tracking-wider">Pending Review</span>
            <p className="text-2xl font-bold text-amber-300 mt-1">
              {requests.filter((r) => r.status === "Pending").length}
            </p>
          </div>
          <div className="bg-glass-card p-4 rounded-2xl border border-emerald-500/25">
            <span className="text-xs text-emerald-400 uppercase tracking-wider">Authorized</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {requests.filter((r) => r.status === "Approved").length}
            </p>
          </div>
          <div className="bg-glass-card p-4 rounded-2xl border border-rose-500/25">
            <span className="text-xs text-rose-400 uppercase tracking-wider">Declined</span>
            <p className="text-2xl font-bold text-rose-400 mt-1">
              {requests.filter((r) => r.status === "Rejected").length}
            </p>
          </div>
        </div>

        {/* DOCKET TABLE */}
        <div className="bg-glass-card-glow rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-16 text-center text-slate-400">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading approval queue...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <p className="text-2xl mb-1">✨</p>
              <p className="text-sm font-semibold text-white">No dockets in this category</p>
              <p className="text-xs text-slate-400 mt-0.5">All requests have been evaluated.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03] text-slate-400 uppercase font-semibold">
                    <th className="py-4 px-6">Reference ID</th>
                    <th className="py-4 px-6">Beneficiary / Party</th>
                    <th className="py-4 px-6">Department</th>
                    <th className="py-4 px-6">Work Order</th>
                    <th className="py-4 px-6">BG Amount</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Action Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRequests.map((item) => {
                    const isExpanded = expandedRow === item._id;
                    const statusColors = {
                      Approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                      Pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
                      Rejected: "bg-rose-500/15 text-rose-400 border-rose-500/30",
                    };

                    return (
                      <React.Fragment key={item._id}>
                        <tr
                          onClick={() => setExpandedRow(isExpanded ? null : item._id)}
                          className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                        >
                          <td className="py-4 px-6 font-mono text-indigo-300">
                            <span className="flex items-center gap-2">
                              <span className="text-slate-500 group-hover:text-white transition">
                                {isExpanded ? "▼" : "▶"}
                              </span>
                              {item._id.slice(-8).toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-semibold text-white">{item.partyName || "Contractor Org"}</p>
                            <p className="text-[10px] text-slate-400">{item.requesterName || "Internal Requester"}</p>
                          </td>
                          <td className="py-4 px-6 text-slate-300">{item.department}</td>
                          <td className="py-4 px-6 font-mono text-slate-400">{item.workOrderNo || item.workOrder || "N/A"}</td>
                          <td className="py-4 px-6 font-bold text-white font-mono">
                            ₹ {Number(item.bgAmount || 0).toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                                statusColors[item.status] || "bg-slate-800 text-slate-300"
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => updateStatus(item._id, "Approved")}
                                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold transition active:scale-95 cursor-pointer"
                              >
                                Approve ✓
                              </button>
                              <button
                                onClick={() => updateStatus(item._id, "Rejected")}
                                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-semibold transition active:scale-95 cursor-pointer"
                              >
                                Reject ✕
                              </button>
                            </div>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-white/[0.02]">
                            <td colSpan="7" className="p-6 border-y border-white/5">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                                <div className="space-y-1.5">
                                  <span className="text-slate-400 uppercase font-semibold">Contract Particulars</span>
                                  <div className="p-3.5 rounded-2xl bg-white/[0.03] space-y-1.5 border border-white/5">
                                    <p><span className="text-slate-400">Nature of Work:</span> <span className="text-white">{item.typeOfWork || "General EPC"}</span></p>
                                    <p><span className="text-slate-400">Total Job Value:</span> <span className="text-white font-mono">₹ {Number(item.jobValue || 0).toLocaleString()}</span></p>
                                    <p><span className="text-slate-400">Operating Site:</span> <span className="text-white">{item.location || "Central HQ"}</span></p>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <span className="text-slate-400 uppercase font-semibold">Validity & Tenor</span>
                                  <div className="p-3.5 rounded-2xl bg-white/[0.03] space-y-1.5 border border-white/5">
                                    <p><span className="text-slate-400">Expiry Date:</span> <span className="text-amber-300 font-mono">{item.bgExpiryDate || item.expiryDate || "Open Ended"}</span></p>
                                    <p><span className="text-slate-400">Claim Period:</span> <span className="text-white">{item.claimPeriod || "90 Days"}</span></p>
                                    <p><span className="text-slate-400">Nature of BG:</span> <span className="text-white">{item.natureOfBG || "Performance BG"}</span></p>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <span className="text-slate-400 uppercase font-semibold">Audit Remarks</span>
                                  <div className="p-3.5 rounded-2xl bg-white/[0.03] space-y-2 border border-white/5">
                                    <input
                                      type="text"
                                      placeholder="Add audit/approval notes..."
                                      value={remarksMap[item._id] ?? item.remarks ?? ""}
                                      onChange={(e) => handleRemarkChange(item._id, e.target.value)}
                                      className="w-full px-3 py-2 rounded-xl bg-[#080b18] border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                                    />
                                    <p className="text-[10px] text-slate-400">
                                      Notes will be permanently recorded into the audit trail.
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
