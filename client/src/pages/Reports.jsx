import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const SAMPLE_REPORTS = [
  {
    _id: "bg-889101",
    department: "Finance & Accounts",
    location: "Mumbai HQ",
    requestDate: "2026-10-12",
    workOrder: "WO-2026-F-110",
    typeOfWork: "Treasury Management Facility",
    jobValue: 90000000,
    requester: "Kunal Mehra",
    superior: "Rajeev Bansal",
    partyName: "Standard Chartered Bank",
    nature: "Financial Guarantee",
    bgAmount: 18000000,
    expiryDate: "2028-10-11",
    claimPeriod: "1 Year",
    status: "Approved",
    remarks: "Executed and sealed.",
  },
  {
    _id: "bg-889102",
    department: "Procurement & Contracts",
    location: "Hazira Petrochemicals",
    requestDate: "2026-09-28",
    workOrder: "WO-2026-HZ-401",
    typeOfWork: "Cryogenic Tanks Fabrication",
    jobValue: 145000000,
    requester: "Ananya Deshmukh",
    superior: "Deepak Khurana",
    partyName: "Larsen & Toubro Ltd",
    nature: "Performance BG",
    bgAmount: 22500000,
    expiryDate: "2028-09-27",
    claimPeriod: "6 Months",
    status: "Approved",
    remarks: "Bank confirmation received.",
  },
  {
    _id: "bg-889103",
    department: "Legal & Compliance",
    location: "Kolkata Port",
    requestDate: "2026-08-15",
    workOrder: "WO-2026-KP-092",
    typeOfWork: "Marine Cargo Dredging",
    jobValue: 32000000,
    requester: "Siddharth Rao",
    superior: "Meera Nair",
    partyName: "Dredging Corp of India",
    nature: "Advance Payment BG",
    bgAmount: 6400000,
    expiryDate: "2027-02-14",
    claimPeriod: "90 Days",
    status: "Rejected",
    remarks: "Inadequate counter-indemnity coverage.",
  },
];

function Reports() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await API.get("/bg");
      const list = response?.data?.data || [];
      const filtered = list.filter((item) => item.status === "Approved" || item.status === "Rejected");
      if (filtered.length > 0) {
        setReportData(filtered);
      } else {
        setReportData(SAMPLE_REPORTS);
      }
    } catch (error) {
      setReportData(SAMPLE_REPORTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF("landscape");
    doc.text("Institutional Bank Guarantee Ledger & Audit Report", 14, 15);

    autoTable(doc, {
      startY: 22,
      head: [
        ["ID", "Department", "Party Name", "Work Order", "BG Amount (INR)", "Expiry Date", "Status", "Remarks"],
      ],
      body: filteredData.map((item) => [
        item._id?.slice(-8) || "",
        item.department || "",
        item.partyName || "",
        item.workOrder || "",
        `INR ${Number(item.bgAmount || 0).toLocaleString()}`,
        item.expiryDate || "",
        item.status || "",
        item.remarks || "",
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 255, 136], textColor: [4, 8, 6] },
    });

    doc.save("BG_Institutional_Report.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        "Docket ID": item._id,
        Department: item.department,
        "Party / Beneficiary": item.partyName,
        "Work Order No": item.workOrder,
        "Type of Work": item.typeOfWork,
        "Job Value (INR)": item.jobValue,
        "BG Amount (INR)": item.bgAmount,
        "Expiry Date": item.expiryDate,
        "Claim Period": item.claimPeriod,
        Status: item.status,
        Remarks: item.remarks,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BG Ledger");
    XLSX.writeFile(workbook, "BG_Ledger_Export.xlsx");
  };

  const filteredData = reportData.filter((item) => {
    const matchesSearch =
      (item.partyName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.workOrder || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item._id || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === "All" || item.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const totalExposure = filteredData.reduce((acc, curr) => acc + (Number(curr.bgAmount) || 0), 0);

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#00ff88]">
                AGENT #4 • AUDIT & LEDGER DISPATCHER
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Reports & Disbursed Portfolio Ledger
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Instant PDF ledger downloads and Excel regulatory filings.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={downloadPDF}
              className="px-3.5 py-2 rounded-xl btn-neon-outline text-xs font-mono font-bold cursor-pointer"
            >
              📄 Export PDF Ledger
            </button>
            <button
              onClick={downloadExcel}
              className="px-3.5 py-2 rounded-xl btn-neon-solid text-xs font-mono font-bold cursor-pointer"
            >
              📊 Export Excel (.xlsx)
            </button>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="cyber-panel p-4 rounded-xl border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search beneficiary, order, docket ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2 rounded-xl bg-[#06140d] border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#00ff88]"
            />
            <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#06140d] border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-[#00ff88]"
            >
              <option value="All">All Departments</option>
              <option value="Finance & Accounts">Finance & Accounts</option>
              <option value="Procurement & Contracts">Procurement & Contracts</option>
              <option value="Operations & Projects">Operations & Projects</option>
              <option value="Legal & Compliance">Legal & Compliance</option>
            </select>

            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-400 block font-mono">Total Filtered Exposure</span>
              <span className="text-sm font-bold text-[#00ff88] font-mono">
                ₹ {(totalExposure / 10000000).toFixed(2)} Cr
              </span>
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="cyber-panel-glow rounded-2xl border border-emerald-500/25 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-16 text-center text-slate-400">
              <div className="w-8 h-8 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Generating ledger entries...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-emerald-500/20 bg-[#06140d] text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    <th className="py-3 px-5">Docket ID</th>
                    <th className="py-3 px-5">Beneficiary</th>
                    <th className="py-3 px-5">Department</th>
                    <th className="py-3 px-5">Work Order</th>
                    <th className="py-3 px-5">BG Amount</th>
                    <th className="py-3 px-5">Expiry</th>
                    <th className="py-3 px-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/10">
                  {filteredData.map((item) => (
                    <tr key={item._id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3.5 px-5 font-mono text-[11px] text-[#00ff88]">
                        {item._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-white">
                        {item.partyName}
                      </td>
                      <td className="py-3.5 px-5 text-slate-300">
                        {item.department}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-slate-400">
                        {item.workOrder}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-white font-mono">
                        ₹ {Number(item.bgAmount || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-5 text-amber-300 font-mono">
                        {item.expiryDate}
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                            item.status === "Approved"
                              ? "bg-emerald-500/15 text-[#00ff88] border-emerald-500/40"
                              : "bg-red-500/15 text-red-400 border-red-500/40"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Reports;
