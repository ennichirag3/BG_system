import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";

const NATURE_OPTIONS = [
  "Performance BG","Advance Payment BG","Earnest Money Deposit (EMD)",
  "Financial Guarantee","Bid Bond Guarantee","Deferred Payment Guarantee",
  "Security Deposit BG","Warranty BG","Customs & Shipping Guarantee","Other"
];

const DEPARTMENTS = [
  "Finance & Accounts","Procurement & Contracts","Operations & Projects",
  "Legal & Compliance","Engineering","Human Resources","Administration","Other"
];

const Field = ({ label, hint, required, children }) => (
  <div>
    <label className="text-xs font-semibold text-slate-300 block mb-1">
      {label} {required && <span className="text-rose-400">*</span>}
      {hint && <span className="text-slate-500 font-normal ml-1">{hint}</span>}
    </label>
    {children}
  </div>
);

const inputCls = "w-full px-3.5 py-2.5 rounded-xl bg-[#060814] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition";
const selectCls = inputCls + " cursor-pointer";

function BGRequest() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    department: user.department || "",
    location: "",
    dateOfRequest: new Date().toISOString().split("T")[0],
    workOrderNo: "",
    typeOfWork: "",
    jobValue: "",
    requesterName: user.fullName || "",
    superiorName: "",
    partyName: "",
    natureOfBG: "Performance BG",
    bgAmount: "",
    bgExpiryDate: "",
    claimPeriod: "",
    remarks: "",
  });

  const [files, setFiles] = useState({
    bgDraft: null,
    mdApproval: null,
    boardApproval: null,
    beneficiaryClause: null,
    bankDetails: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const bgAmt = Number(form.bgAmount) || 0;
  const needsMD    = bgAmt > 0 && bgAmt <= 1500000;
  const needsBoard = bgAmt > 1500000;

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleFile   = e => setFiles(p => ({ ...p, [e.target.name]: e.target.files[0] || null }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    const req = ["department","location","dateOfRequest","requesterName","partyName","natureOfBG","bgAmount","bgExpiryDate","claimPeriod"];
    for (const f of req) {
      if (!form[f]) return setError(`"${f}" is required`);
    }
    if (!files.bgDraft) return setError("BG Vetted Draft (Word format) is mandatory");
    if (needsMD && !files.mdApproval) return setError("MD Approval document is required for BG ≤ ₹15 Lakhs");
    if (needsBoard && !files.boardApproval) return setError("Board Approval document is required for BG > ₹15 Lakhs");

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      fd.append("submittedBy",   user.fullName || "");
      fd.append("submittedByRole", user.role   || "Requester");
      Object.entries(files).forEach(([k,v]) => { if (v) fd.append(k, v); });

      await API.post("/bg/create", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess("BG Request submitted successfully! Redirecting to dashboard…");
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const FileInput = ({ name, label, hint, required }) => (
    <div>
      <label className="text-xs font-semibold text-slate-300 block mb-1">
        {label} {required && <span className="text-rose-400">*</span>}
        {hint && <span className="text-slate-500 font-normal ml-1">({hint})</span>}
      </label>
      <label className={`flex items-center gap-3 cursor-pointer px-3.5 py-2.5 rounded-xl border transition ${
        files[name] ? "border-indigo-500/60 bg-indigo-500/10 text-indigo-300" : "border-dashed border-slate-700 bg-white/[0.02] text-slate-400 hover:border-indigo-500/40 hover:text-slate-200"
      }`}>
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 flex-shrink-0" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
        </svg>
        <span className="text-xs truncate">{files[name] ? files[name].name : "Click to upload file (PDF, DOC, DOCX)"}</span>
        <input type="file" name={name} onChange={handleFile} accept=".pdf,.doc,.docx,.png,.jpg" className="hidden" />
      </label>
    </div>
  );

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        {/* HEADER */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-400">New Requisition</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">BG Request Form</h1>
          <p className="text-sm text-slate-400 mt-0.5">From Requester / BG Owner — Complete all mandatory fields and attach required documents.</p>
        </div>

        {error   && <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex items-start gap-2"><span className="mt-0.5">⚠</span><span>{error}</span></div>}
        {success && <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-start gap-2"><span>✓</span><span>{success}</span></div>}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* SECTION 1: Request Details */}
          <div className="bg-glass-card rounded-2xl p-5 border border-white/10 space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase text-indigo-400 tracking-wider border-b border-white/5 pb-2">
              Section 1 — Request Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Department" required>
                <select name="department" value={form.department} onChange={handleChange} className={selectCls}>
                  <option value="">Select department…</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-[#060814]">{d}</option>)}
                </select>
              </Field>
              <Field label="Location / Site" required>
                <input name="location" value={form.location} onChange={handleChange} placeholder="Project site or office location" className={inputCls} />
              </Field>
              <Field label="Date of Request" required>
                <input type="date" name="dateOfRequest" value={form.dateOfRequest} onChange={handleChange} className={inputCls} />
              </Field>
              <Field label="Work Order No.">
                <input name="workOrderNo" value={form.workOrderNo} onChange={handleChange} placeholder="e.g. WO-2026-ENG-001" className={inputCls} />
              </Field>
              <Field label="Type of Work / Nature of Contract" hint="full column span">
                <input name="typeOfWork" value={form.typeOfWork} onChange={handleChange} placeholder="e.g. Turnkey EPC, Civil Construction, Supply Contract" className={inputCls} />
              </Field>
              <Field label="Job Value (₹)" required>
                <input type="number" name="jobValue" value={form.jobValue} onChange={handleChange} placeholder="Total contract value in ₹" className={inputCls} />
              </Field>
            </div>
          </div>

          {/* SECTION 2: Owner / Hierarchy */}
          <div className="bg-glass-card rounded-2xl p-5 border border-white/10 space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase text-indigo-400 tracking-wider border-b border-white/5 pb-2">
              Section 2 — BG Owner / Hierarchy
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First Owner (Requester Name)" required>
                <input name="requesterName" value={form.requesterName} onChange={handleChange} placeholder="Name of the BG owner / requester" className={inputCls} />
              </Field>
              <Field label="Alternate of First Owner (Superior Name)">
                <input name="superiorName" value={form.superiorName} onChange={handleChange} placeholder="Reporting manager / superior name" className={inputCls} />
              </Field>
            </div>
          </div>

          {/* SECTION 3: BG Details */}
          <div className="bg-glass-card rounded-2xl p-5 border border-white/10 space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase text-indigo-400 tracking-wider border-b border-white/5 pb-2">
              Section 3 — Bank Guarantee Particulars
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Name of the Party (Beneficiary)" required>
                <input name="partyName" value={form.partyName} onChange={handleChange} placeholder="Beneficiary organization / client name" className={inputCls} />
              </Field>
              <Field label="Nature of RG / BG Type" required>
                <select name="natureOfBG" value={form.natureOfBG} onChange={handleChange} className={selectCls}>
                  {NATURE_OPTIONS.map(n => <option key={n} value={n} className="bg-[#060814]">{n}</option>)}
                </select>
              </Field>
              <Field label="BG Amount (₹)" required>
                <input type="number" name="bgAmount" value={form.bgAmount} onChange={handleChange} placeholder="Amount in ₹" className={inputCls} />
                {bgAmt > 0 && (
                  <p className={`text-[11px] mt-1 font-mono ${needsBoard ? "text-amber-400" : needsMD ? "text-cyan-400" : "text-slate-400"}`}>
                    {needsBoard ? "⚠ Board Approval required (> ₹15 Lakhs)" : needsMD ? "ℹ MD Approval required (≤ ₹15 Lakhs)" : ""}
                  </p>
                )}
              </Field>
              <Field label="BG Expiry Date" required>
                <input type="date" name="bgExpiryDate" value={form.bgExpiryDate} onChange={handleChange} className={inputCls} />
              </Field>
              <Field label="BG Claim Period" required>
                <input name="claimPeriod" value={form.claimPeriod} onChange={handleChange} placeholder="e.g. 3 Months, 1 Year" className={inputCls} />
              </Field>
              <Field label="Remarks">
                <textarea name="remarks" value={form.remarks} onChange={handleChange} rows={2} placeholder="Any additional instructions or notes…" className={inputCls + " resize-none"} />
              </Field>
            </div>
          </div>

          {/* SECTION 4: Mandatory Attachments */}
          <div className="bg-glass-card rounded-2xl p-5 border border-amber-500/20 space-y-4">
            <div className="flex items-start justify-between border-b border-white/5 pb-2">
              <h2 className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">
                Section 4 — Mandatory Attachments
              </h2>
              <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Required by policy
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs text-amber-200 space-y-1">
              <p className="font-semibold text-amber-300">Attachment Rules:</p>
              <p>• <strong>I. BG Vetted Draft</strong> (Word format) — always required</p>
              <p>• <strong>II. MD Approval</strong> — required only when BG Amount ≤ ₹15 Lakhs</p>
              <p>• <strong>III. Board Approval</strong> — required only when BG Amount {">"} ₹15 Lakhs</p>
              <p>• <strong>IV. Beneficiary Advertisement / BC Requirements Clause</strong></p>
              <p>• <strong>V. Beneficiary Bank Account Details</strong></p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FileInput name="bgDraft" label="I. BG Vetted Draft" hint="Word format" required />

              {needsMD && (
                <FileInput name="mdApproval" label="II. MD Approval" hint="Required for BG ≤ ₹15L" required />
              )}
              {needsBoard && (
                <FileInput name="boardApproval" label="III. Board Approval" hint="Required for BG > ₹15L" required />
              )}
              {!needsMD && !needsBoard && (
                <>
                  <FileInput name="mdApproval" label="II. MD Approval" hint="Mandatory if BG ≤ ₹15L" />
                  <FileInput name="boardApproval" label="III. Board Approval" hint="Mandatory if BG > ₹15L" />
                </>
              )}
              <FileInput name="beneficiaryClause" label="IV. Beneficiary Advt. / BC Requirements Clause" />
              <FileInput name="bankDetails" label="V. Beneficiary Bank Account Details" />
            </div>
          </div>

          {/* SUBMIT */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate("/dashboard")}
              className="px-5 py-2.5 rounded-xl btn-outline-3d text-sm font-semibold cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-6 py-2.5 rounded-xl btn-primary-3d text-sm font-semibold flex items-center gap-2 cursor-pointer">
              {loading ? "Submitting…" : (<><span>Submit BG Request</span><span>→</span></>)}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

export default BGRequest;
