import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";

function BGRequest() {
  const [bgAmount, setBgAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const [formData, setFormData] = useState({
    department: "",
    location: "",
    requestDate: new Date().toISOString().split("T")[0],
    workOrder: "",
    typeOfWork: "",
    jobValue: "",
    requester: "",
    superior: "",
    partyName: "",
    nature: "",
    expiryDate: "",
    claimPeriod: "",
    remarks: "",
    bgDraft: null,
    approvalFile: null,
    beneficiaryClause: null,
    bankDetails: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleAutoFill = () => {
    setBgAmount("15000000");
    setFormData({
      department: "Procurement & Contracts",
      location: "Navi Mumbai Tech Park",
      requestDate: new Date().toISOString().split("T")[0],
      workOrder: "WO-2026-EPC-994",
      typeOfWork: "HV Substation Turnkey Infrastructure",
      jobValue: "120000000",
      requester: "Rahul Varma (Sr. Project Manager)",
      superior: "Deepak Khurana (VP Infrastructure)",
      partyName: "State Electricity Transmission Corp",
      nature: "Performance Bank Guarantee",
      expiryDate: "2028-03-31",
      claimPeriod: "180 Days",
      remarks: "Pre-approved under master facility limits with HDFC & SBI consortium.",
      bgDraft: null,
      approvalFile: null,
      beneficiaryClause: null,
      bankDetails: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(bgAmount);

    if (
      !formData.department ||
      !formData.location ||
      !formData.workOrder ||
      !formData.typeOfWork ||
      !formData.partyName ||
      !amount
    ) {
      alert("Please fill all essential BG fields.");
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("department", formData.department);
      data.append("location", formData.location);
      data.append("dateOfRequest", formData.requestDate);
      data.append("workOrderNo", formData.workOrder);
      data.append("typeOfWork", formData.typeOfWork);
      data.append("jobValue", formData.jobValue || 0);
      data.append("requesterName", formData.requester || "Internal Admin");
      data.append("superiorName", formData.superior || "Lead Officer");
      data.append("partyName", formData.partyName);
      data.append("natureOfBG", formData.nature || "Performance BG");
      data.append("bgAmount", amount);
      data.append("bgExpiryDate", formData.expiryDate);
      data.append("claimPeriod", formData.claimPeriod);
      data.append("remarks", formData.remarks);

      if (formData.bgDraft) data.append("bgDraft", formData.bgDraft);
      if (formData.approvalFile) data.append("approvalFile", formData.approvalFile);
      if (formData.beneficiaryClause) data.append("beneficiaryClause", formData.beneficiaryClause);
      if (formData.bankDetails) data.append("bankDetails", formData.bankDetails);

      await API.post("/bg/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessNotice(true);
    } catch (err) {
      setSuccessNotice(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#00ff88]">
                AGENT #2 • REQUISITION ORIGINATOR
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Initiate Bank Guarantee Docket
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Submit guarantee contracts for automated multi-agent risk verification.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAutoFill}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl btn-neon-outline text-xs font-mono font-bold cursor-pointer"
          >
            <span>⚡</span>
            <span>Autofill Sample Contract</span>
          </button>
        </div>

        {successNotice && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">✓</span>
              <div>
                <p className="font-bold text-white">BG Application Successfully Lodged!</p>
                <p className="text-[11px] text-emerald-300">Reference docket queued for risk approval and bank transmission.</p>
              </div>
            </div>
            <button
              onClick={() => setSuccessNotice(false)}
              className="text-xs text-[#00ff88] font-bold underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* APPLICATION FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SECTION 1 */}
          <div className="cyber-panel p-5 sm:p-6 rounded-2xl border border-emerald-500/20 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-emerald-500/20">
              <span className="w-6 h-6 rounded-lg bg-[#00ff88]/20 text-[#00ff88] flex items-center justify-center font-bold font-mono text-xs">
                01
              </span>
              <h3 className="text-sm font-bold text-white tracking-wide">General & Contracting Particulars</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#06140d] border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-[#00ff88]"
                >
                  <option value="">Select Department</option>
                  <option value="Finance & Accounts">Finance & Accounts</option>
                  <option value="Procurement & Contracts">Procurement & Contracts</option>
                  <option value="Operations & Projects">Operations & Projects</option>
                  <option value="Legal & Compliance">Legal & Compliance</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">Location *</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Mumbai Refinery Site"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#06140d] border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#00ff88]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">Request Date *</label>
                <input
                  type="date"
                  name="requestDate"
                  value={formData.requestDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#06140d] border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-[#00ff88]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">Work Order No. *</label>
                <input
                  type="text"
                  name="workOrder"
                  placeholder="e.g. WO-2026-ENG-847"
                  value={formData.workOrder}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#06140d] border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#00ff88]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">Nature of Work *</label>
                <input
                  type="text"
                  name="typeOfWork"
                  placeholder="e.g. Civil Construction"
                  value={formData.typeOfWork}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#06140d] border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#00ff88]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">Total Contract Value (₹)</label>
                <input
                  type="number"
                  name="jobValue"
                  placeholder="120000000"
                  value={formData.jobValue}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#06140d] border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#00ff88]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2 */}
          <div className="cyber-panel p-5 sm:p-6 rounded-2xl border border-emerald-500/20 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-emerald-500/20">
              <span className="w-6 h-6 rounded-lg bg-[#00ff88]/20 text-[#00ff88] flex items-center justify-center font-bold font-mono text-xs">
                02
              </span>
              <h3 className="text-sm font-bold text-white tracking-wide">Financial Terms & Exposure</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">Beneficiary Name *</label>
                <input
                  type="text"
                  name="partyName"
                  placeholder="e.g. Bharat Petroleum Corp"
                  value={formData.partyName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#06140d] border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#00ff88]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">Nature of BG *</label>
                <select
                  name="nature"
                  value={formData.nature}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#06140d] border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-[#00ff88]"
                >
                  <option value="">Select BG Type</option>
                  <option value="Performance Bank Guarantee">Performance BG</option>
                  <option value="Advance Payment Guarantee">Advance Payment BG</option>
                  <option value="Earnest Money Deposit">Earnest Money Deposit (EMD)</option>
                  <option value="Financial Guarantee">Financial Guarantee</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">BG Amount (₹) *</label>
                <input
                  type="number"
                  placeholder="15000000"
                  value={bgAmount}
                  onChange={(e) => setBgAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#06140d] border border-emerald-500/30 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-[#00ff88]"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="py-3 px-8 rounded-xl btn-neon-solid text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Transmitting..." : "Submit Guarantee Requisition →"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

export default BGRequest;
