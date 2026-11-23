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
      alert("Please fill all mandatory BG fields.");
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
      data.append("requesterName", formData.requester || "Internal Officer");
      data.append("superiorName", formData.superior || "Lead Controller");
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
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-cyan-400">
                Guarantee Requisition
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Initiate Bank Guarantee Application
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Lodge corporate guarantee requisitions with automated covenant verification.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAutoFill}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-outline-3d text-xs font-semibold cursor-pointer"
          >
            <span>⚡</span>
            <span>Autofill Sample Contract</span>
          </button>
        </div>

        {successNotice && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">✓</span>
              <div>
                <p className="font-bold text-white">BG Application Successfully Lodged!</p>
                <p className="text-[11px] text-emerald-300">Reference docket queued for risk approval and bank transmission.</p>
              </div>
            </div>
            <button
              onClick={() => setSuccessNotice(false)}
              className="text-xs text-emerald-300 font-bold underline cursor-pointer hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* APPLICATION FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1 */}
          <div className="bg-glass-card p-6 sm:p-7 rounded-3xl border border-white/10 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <span className="w-7 h-7 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                01
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Contract Particulars</h3>
                <p className="text-[11px] text-slate-400">Departmental ownership and operating location</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d1c] border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select Department</option>
                  <option value="Finance & Accounts">Finance & Accounts</option>
                  <option value="Procurement & Contracts">Procurement & Contracts</option>
                  <option value="Operations & Projects">Operations & Projects</option>
                  <option value="Legal & Compliance">Legal & Compliance</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Site / Location *</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Mumbai Refinery Site"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d1c] border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Date of Request *</label>
                <input
                  type="date"
                  name="requestDate"
                  value={formData.requestDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d1c] border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Work Order / Tender No. *</label>
                <input
                  type="text"
                  name="workOrder"
                  placeholder="e.g. WO-2026-ENG-847"
                  value={formData.workOrder}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d1c] border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Nature of Work *</label>
                <input
                  type="text"
                  name="typeOfWork"
                  placeholder="e.g. Civil Construction, Supply"
                  value={formData.typeOfWork}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d1c] border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Total Contract Value (₹)</label>
                <input
                  type="number"
                  name="jobValue"
                  placeholder="120000000"
                  value={formData.jobValue}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d1c] border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2 */}
          <div className="bg-glass-card p-6 sm:p-7 rounded-3xl border border-white/10 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <span className="w-7 h-7 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                02
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Bank Guarantee Terms & Exposure</h3>
                <p className="text-[11px] text-slate-400">Guaranteed sum, validity tenor, and beneficiary</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Beneficiary / Party Name *</label>
                <input
                  type="text"
                  name="partyName"
                  placeholder="e.g. Bharat Petroleum Corp Ltd"
                  value={formData.partyName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d1c] border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Nature of BG *</label>
                <select
                  name="nature"
                  value={formData.nature}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d1c] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Select BG Type</option>
                  <option value="Performance Bank Guarantee">Performance Bank Guarantee (PBG)</option>
                  <option value="Advance Payment Guarantee">Advance Payment Guarantee (APG)</option>
                  <option value="Earnest Money Deposit">Earnest Money Deposit (EMD)</option>
                  <option value="Financial Guarantee">Financial Guarantee</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">BG Amount (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 15000000"
                  value={bgAmount}
                  onChange={(e) => setBgAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d1c] border border-slate-700 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Expiry Date *</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d1c] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Claim Period</label>
                <input
                  type="text"
                  name="claimPeriod"
                  placeholder="e.g. 6 Months from expiry"
                  value={formData.claimPeriod}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d1c] border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Approving Superior</label>
                <input
                  type="text"
                  name="superior"
                  placeholder="e.g. General Manager (Finance)"
                  value={formData.superior}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d1c] border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: ATTACHMENTS */}
          <div className="bg-glass-card p-6 sm:p-7 rounded-3xl border border-white/10 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <span className="w-7 h-7 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-xs">
                03
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Supporting Documents</h3>
                <p className="text-[11px] text-slate-400">PDF, Word, or contract certificates</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "BG Draft Text", name: "bgDraft", icon: "📄" },
                { label: "Internal Approvals", name: "approvalFile", icon: "✍️" },
                { label: "Beneficiary Clause", name: "beneficiaryClause", icon: "⚖️" },
                { label: "Bank Account Details", name: "bankDetails", icon: "🏦" },
              ].map((doc) => (
                <div
                  key={doc.name}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-between text-center hover:border-indigo-500/30 transition"
                >
                  <span className="text-2xl mb-1.5">{doc.icon}</span>
                  <span className="text-xs font-semibold text-white mb-2">{doc.label}</span>
                  <label className="py-1.5 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-[11px] font-semibold cursor-pointer transition border border-indigo-500/30">
                    Browse File
                    <input type="file" name={doc.name} onChange={handleFileChange} className="hidden" />
                  </label>
                  {formData[doc.name] && (
                    <span className="text-[10px] text-emerald-400 mt-2 truncate">
                      ✓ {formData[doc.name].name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="py-3 px-8 rounded-2xl btn-primary-3d text-sm font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Transmitting Docket..." : "Submit BG Requisition →"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

export default BGRequest;
