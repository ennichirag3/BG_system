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
    location: "Mumbai Port Complex",
    dateOfRequest: "2026-10-12",
    workOrderNo: "WO-2026-ENG-847",
    typeOfWork: "Turnkey Refinery Automation",
    jobValue: 85000000,
    requesterName: "Siddharth Rao",
    superiorName: "Rajeev Bansal",
    partyName: "Bharat Petroleum Corp Ltd",
    natureOfBG: "Performance BG",
    bgAmount: 12500000,
    bgExpiryDate: "2027-12-31",
    claimPeriod: "6 Months",
    status: "Approved",
    remarks: "Covenants verified under master facility.",
  },
  {
    _id: "bg-889102",
    department: "Procurement & Contracts",
    location: "Jamshedpur Hub",
    dateOfRequest: "2026-11-04",
    workOrderNo: "WO-2026-TS-019",
    typeOfWork: "Structural Heavy Fabrication",
    jobValue: 24000000,
    requesterName: "Ananya Deshmukh",
    superiorName: "Deepak Khurana",
    partyName: "Tata Steel Projects",
    natureOfBG: "Performance BG",
    bgAmount: 4500000,
    bgExpiryDate: "2027-06-30",
    claimPeriod: "3 Months",
    status: "Approved",
    remarks: "Cleared by Risk Committee.",
  },
  {
    _id: "bg-889103",
    department: "Operations & Projects",
    location: "Delhi-NCR Corridor",
    dateOfRequest: "2026-11-18",
    workOrderNo: "NHAI-PKG-77",
    typeOfWork: "Expressway Segment 4",
    jobValue: 120000000,
    requesterName: "Kunal Mehra",
    superiorName: "Deepak Khurana",
    partyName: "National Highways Authority",
    natureOfBG: "Advance Payment BG",
    bgAmount: 18000000,
    bgExpiryDate: "2028-03-31",
    claimPeriod: "1 Year",
    status: "Pending",
    remarks: "Requires board sign-off.",
  },
  {
    _id: "bg-889104",
    department: "Legal & Compliance",
    location: "Kochi Metro",
    dateOfRequest: "2026-09-15",
    workOrderNo: "GMRC-SIG-202",
    typeOfWork: "Signaling & Telemetry",
    jobValue: 14000000,
    requesterName: "Meera Nair",
    superiorName: "Rajeev Bansal",
    partyName: "Global Metro Rail Cons.",
    natureOfBG: "Financial Guarantee",
    bgAmount: 2200000,
    bgExpiryDate: "2026-11-30",
    claimPeriod: "1 Month",
    status: "Rejected",
    remarks: "Clause 14 indemnity missing.",
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
      if (list.length > 0) {
        setReportData(list);
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
    doc.text("Bank Guarantee Portfolio Ledger & Audit Report", 14, 15);

    autoTable(doc, {
      startY: 22,
      head: [
        ["ID", "Department", "Party Name", "Work Order", "BG Amount (INR)", "Expiry Date", "Status", "Remarks"],
      ],
      body: filteredData.map((item) => [
        item._id?.slice(-8) || item.id || "",
        item.department || "",
        item.partyName || "",
        item.workOrderNo || item.workOrder || "",
        `INR ${Number(item.bgAmount || 0).toLocaleString()}`,
        item.bgExpiryDate || item.expiryDate || "",
        item.status || "",
        item.remarks || "",
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] },
    });

    doc.save("BG_Portfolio_Report.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        "Docket ID": item._id || item.id,
        Department: item.department,
        "Party / Beneficiary": item.partyName,
        "Work Order No": item.workOrderNo || item.workOrder,
        "Type of Work": item.typeOfWork,
        "Job Value (INR)": item.jobValue,
        "BG Amount (INR)": item.bgAmount,
        "Expiry Date": item.bgExpiryDate || item.expiryDate,
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
      (item.workOrderNo || item.workOrder || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
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
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-400">
                Audit & Compliance
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Reports & Guarantee Ledger
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Export comprehensive audit ledgers in PDF or Excel formats.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={downloadPDF}
              className="px-4 py-2.5 rounded-2xl btn-outline-3d text-xs font-semibold cursor-pointer flex items-center gap-2"
            >
              <span>📄</span>
              <span>Export PDF Report</span>
            </button>
            <button
              onClick={downloadExcel}
              className="px-4 py-2.5 rounded-2xl btn-primary-3d text-xs font-semibold cursor-pointer flex items-center gap-2"
            >
              <span>📊</span>
              <span>Export Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-glass-card p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search beneficiary, order, docket ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#090d1c] border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-[#090d1c] border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Departments</option>
              <option value="Finance & Accounts">Finance & Accounts</option>
              <option value="Procurement & Contracts">Procurement & Contracts</option>
              <option value="Operations & Projects">Operations & Projects</option>
              <option value="Legal & Compliance">Legal & Compliance</option>
            </select>

            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-400 block font-mono">Total Filtered Exposure</span>
              <span className="text-sm font-bold text-cyan-300 font-mono">
                ₹ {(totalExposure / 10000000).toFixed(2)} Cr
              </span>
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-glass-card-glow rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-16 text-center text-slate-400">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Generating ledger entries...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03] text-slate-400 uppercase font-semibold">
                    <th className="py-4 px-6">Docket ID</th>
                    <th className="py-4 px-6">Beneficiary</th>
                    <th className="py-4 px-6">Department</th>
                    <th className="py-4 px-6">Work Order</th>
                    <th className="py-4 px-6">BG Amount</th>
                    <th className="py-4 px-6">Expiry</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredData.map((item) => (
                    <tr key={item._id || item.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 px-6 font-mono text-indigo-300">
                        {(item._id || item.id).slice(-8).toUpperCase()}
                      </td>
                      <td className="py-4 px-6 font-semibold text-white">
                        {item.partyName}
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {item.department}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-400">
                        {item.workOrderNo || item.workOrder}
                      </td>
                      <td className="py-4 px-6 font-bold text-white font-mono">
                        ₹ {Number(item.bgAmount || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-amber-300 font-mono">
                        {item.bgExpiryDate || item.expiryDate}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            item.status === "Approved"
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : item.status === "Pending"
                              ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                              : "bg-rose-500/15 text-rose-400 border-rose-500/30"
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
