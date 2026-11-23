import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";
import * as XLSX from "xlsx";

/* ── PDF via jsPDF + autoTable ── */
let jsPDF, autoTable;
const loadPDF = async () => {
  if (!jsPDF) {
    const { jsPDF: J } = await import("jspdf");
    const { default: at } = await import("jspdf-autotable");
    jsPDF = J;
    autoTable = at;
  }
};

const FMT_AMT = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`;
const FMT_DATE = (d) => d || "—";

const REPORT_COLS = [
  { key: "_id",           label: "Docket ID" },
  { key: "dateOfRequest", label: "Date" },
  { key: "department",    label: "Department" },
  { key: "location",      label: "Location" },
  { key: "workOrderNo",   label: "Work Order No." },
  { key: "typeOfWork",    label: "Type of Work" },
  { key: "jobValue",      label: "Job Value (₹)" },
  { key: "requesterName", label: "First Owner" },
  { key: "superiorName",  label: "Alternate Owner" },
  { key: "partyName",     label: "Party Name" },
  { key: "natureOfBG",    label: "Nature of BG" },
  { key: "bgAmount",      label: "BG Amount (₹)" },
  { key: "bgExpiryDate",  label: "Expiry Date" },
  { key: "claimPeriod",   label: "Claim Period" },
  { key: "status",        label: "Status" },
  { key: "adminRemarks",  label: "Admin Remarks" },
];

function Reports() {
  const [all, setAll]           = useState([]);
  const [loading, setLoading]   = useState(true);
  const [exporting, setExporting] = useState("");

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await API.get("/bg");
      setAll(res.data?.data || []);
    } catch { setAll([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  /* Only show Approved & Rejected in reports */
  const approved = all.filter(r => r.status === "Approved");
  const rejected  = all.filter(r => r.status === "Rejected");
  const reportData = [...approved, ...rejected];

  const totalAmt  = approved.reduce((s, r) => s + Number(r.bgAmount || 0), 0);
  const totalJob  = approved.reduce((s, r) => s + Number(r.jobValue  || 0), 0);

  /* ── Helper: map a record to flat row ── */
  const mapRow = (r) => [
    String(r._id || "").slice(-8).toUpperCase(),
    FMT_DATE(r.dateOfRequest),
    r.department    || "",
    r.location      || "",
    r.workOrderNo   || "",
    r.typeOfWork    || "",
    Number(r.jobValue  || 0).toLocaleString("en-IN"),
    r.requesterName || "",
    r.superiorName  || "",
    r.partyName     || "",
    r.natureOfBG    || "",
    Number(r.bgAmount  || 0).toLocaleString("en-IN"),
    FMT_DATE(r.bgExpiryDate),
    r.claimPeriod   || "",
    r.status        || "",
    r.adminRemarks  || r.remarks || "",
  ];

  /* ── EXPORT EXCEL ── */
  const exportExcel = () => {
    setExporting("excel");
    const header = REPORT_COLS.map(c => c.label);
    const rows   = reportData.map(mapRow);

    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
    ws["!cols"] = REPORT_COLS.map(() => ({ wch: 22 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BG Report");

    /* Summary sheet */
    const sumRows = [
      ["BG MANAGEMENT SYSTEM — REPORT"],
      [],
      ["Generated On", new Date().toLocaleString("en-IN")],
      ["Total Records", reportData.length],
      ["Approved Count", approved.length],
      ["Rejected Count", rejected.length],
      ["Total Approved BG Amount (₹)", Number(totalAmt).toLocaleString("en-IN")],
      ["Total Approved Job Value (₹)", Number(totalJob).toLocaleString("en-IN")],
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(sumRows);
    ws2["!cols"] = [{ wch: 36 }, { wch: 24 }];
    XLSX.utils.book_append_sheet(wb, ws2, "Summary");

    XLSX.writeFile(wb, `BG_Report_${new Date().toISOString().slice(0,10)}.xlsx`);
    setExporting("");
  };

  /* ── EXPORT PDF ── */
  const exportPDF = async () => {
    setExporting("pdf");
    await loadPDF();

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a3" });

    doc.setFontSize(14);
    doc.setTextColor(40, 40, 60);
    doc.text("Bank Guarantee Management System — Report", 14, 16);

    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Approved: ${approved.length}  |  Rejected: ${rejected.length}  |  Total BG Exposure: ₹ ${Number(totalAmt).toLocaleString("en-IN")}`, 14, 23);
    doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 14, 28);

    autoTable(doc, {
      head:     [REPORT_COLS.map(c => c.label)],
      body:     reportData.map(mapRow),
      startY:   33,
      styles:   { fontSize: 7, cellPadding: 2, overflow: "linebreak" },
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 255] },
      columnStyles: { 0: { cellWidth: 18 }, 1: { cellWidth: 20 }, 11: { cellWidth: 24 } },
      willDrawCell: (data) => {
        if (data.section === "body" && data.column.index === 14) {
          const st = data.cell.raw;
          if (st === "Approved") doc.setTextColor(16, 185, 129);
          else if (st === "Rejected") doc.setTextColor(239, 68, 68);
          else doc.setTextColor(0, 0, 0);
        }
      },
    });

    doc.save(`BG_Report_${new Date().toISOString().slice(0,10)}.pdf`);
    setExporting("");
  };

  const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap ${
      status === "Approved" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" :
      status === "Rejected" ? "bg-rose-500/20 text-rose-300 border-rose-500/40" :
      "bg-slate-800 text-slate-300 border-slate-700"
    }`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />{status}
    </span>
  );

  return (
    <MainLayout>
      <div className="max-w-full space-y-5 pb-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-purple-400">Audit & Ledger</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Reports & Export</h1>
            <p className="text-xs text-slate-400 mt-0.5">Shows all Approved and Rejected BG dockets. Pending requests are excluded from reports.</p>
          </div>

          {/* EXPORT BUTTONS */}
          <div className="flex items-center gap-2">
            <button onClick={exportExcel} disabled={exporting === "excel" || reportData.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/35 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition cursor-pointer disabled:opacity-40">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/>
              </svg>
              {exporting === "excel" ? "Exporting…" : "Export Excel (.xlsx)"}
            </button>

            <button onClick={exportPDF} disabled={exporting === "pdf" || reportData.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/35 border border-rose-500/40 text-rose-300 text-xs font-semibold transition cursor-pointer disabled:opacity-40">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/>
              </svg>
              {exporting === "pdf" ? "Generating…" : "Export PDF (.pdf)"}
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Approved Dockets", value: approved.length,  color: "text-emerald-400", border: "border-emerald-500/20" },
            { label: "Rejected Dockets", value: rejected.length,  color: "text-rose-400",    border: "border-rose-500/20" },
            { label: "Total BG Exposure", value: `₹ ${(totalAmt/1e7).toFixed(2)} Cr`, color: "text-cyan-300", border: "border-cyan-500/20" },
            { label: "Approval Rate",    value: all.length ? `${Math.round(approved.length/all.length*100)}%` : "0%", color: "text-indigo-300", border: "border-indigo-500/20" },
          ].map(c => (
            <div key={c.label} className={`bg-glass-card p-4 rounded-2xl border ${c.border}`}>
              <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">{c.label}</p>
              <p className={`text-2xl font-black mt-1 ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">Loading report data…</div>
        ) : reportData.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-lg mb-1">No finalised records yet</p>
            <p className="text-xs text-slate-600">Approved and Rejected BG requests will appear here once Admin takes action.</p>
          </div>
        ) : (
          <div className="bg-glass-card rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-xs min-w-[1300px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-left">
                  <th className="py-3 px-3 text-[10px] font-mono font-bold uppercase text-slate-400 w-10">#</th>
                  {REPORT_COLS.map(c => (
                    <th key={c.key} className="py-3 px-3 text-[10px] font-mono font-bold uppercase text-slate-400 whitespace-nowrap">{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, idx) => (
                  <tr key={item._id} className={`border-b border-white/5 hover:bg-white/[0.03] transition ${item.status === "Approved" ? "hover:bg-emerald-500/[0.03]" : "hover:bg-rose-500/[0.03]"}`}>
                    <td className="py-3 px-3 text-slate-500 font-mono">{idx + 1}</td>
                    <td className="py-3 px-3 font-mono text-indigo-300">{String(item._id||"").slice(-8).toUpperCase()}</td>
                    <td className="py-3 px-3 text-slate-300 font-mono whitespace-nowrap">{item.dateOfRequest || "—"}</td>
                    <td className="py-3 px-3 text-slate-300">{item.department || "—"}</td>
                    <td className="py-3 px-3 text-slate-400">{item.location || "—"}</td>
                    <td className="py-3 px-3 text-slate-400 font-mono">{item.workOrderNo || "—"}</td>
                    <td className="py-3 px-3 text-slate-300">{item.typeOfWork || "—"}</td>
                    <td className="py-3 px-3 font-mono text-slate-300 text-right">{FMT_AMT(item.jobValue)}</td>
                    <td className="py-3 px-3 text-white font-semibold">{item.requesterName || "—"}</td>
                    <td className="py-3 px-3 text-slate-400">{item.superiorName || "—"}</td>
                    <td className="py-3 px-3 text-slate-300">{item.partyName || "—"}</td>
                    <td className="py-3 px-3 text-slate-400">{item.natureOfBG || "—"}</td>
                    <td className="py-3 px-3 font-mono font-bold text-cyan-300 text-right whitespace-nowrap">{FMT_AMT(item.bgAmount)}</td>
                    <td className="py-3 px-3 text-amber-300 font-mono whitespace-nowrap">{item.bgExpiryDate || "—"}</td>
                    <td className="py-3 px-3 text-slate-400">{item.claimPeriod || "—"}</td>
                    <td className="py-3 px-3"><StatusBadge status={item.status} /></td>
                    <td className="py-3 px-3 text-slate-400 max-w-[160px] truncate" title={item.adminRemarks || item.remarks}>
                      {item.adminRemarks || item.remarks || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* TOTALS ROW */}
              <tfoot>
                <tr className="border-t border-white/10 bg-white/[0.03]">
                  <td colSpan={7} className="py-2.5 px-3 text-xs font-bold text-slate-300">TOTALS — Approved records only</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-white text-right whitespace-nowrap">{FMT_AMT(totalJob)}</td>
                  <td colSpan={4} />
                  <td className="py-2.5 px-3 font-mono font-bold text-cyan-200 text-right whitespace-nowrap">{FMT_AMT(totalAmt)}</td>
                  <td colSpan={4} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <p className="text-[10px] text-slate-600 font-mono text-right">{reportData.length} finalized record(s) — Pending excluded</p>
      </div>
    </MainLayout>
  );
}

export default Reports;
