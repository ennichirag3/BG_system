import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";

function BGRequest() {

  const [bgAmount, setBgAmount] = useState("");

  const [formData, setFormData] = useState({
    department: "",
    location: "",
    requestDate: "",
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

  const handleSubmit = async (e) => {

    e.preventDefault();

    const amount = Number(bgAmount);

    // VALIDATION
    if (
      !formData.department ||
      !formData.location ||
      !formData.requestDate ||
      !formData.workOrder ||
      !formData.typeOfWork ||
      !formData.jobValue ||
      !formData.requester ||
      !formData.superior ||
      !formData.partyName ||
      !formData.nature ||
      !bgAmount ||
      !formData.expiryDate ||
      !formData.claimPeriod ||
      !formData.remarks ||
      !formData.bgDraft ||
      !formData.beneficiaryClause ||
      !formData.bankDetails ||
      !formData.approvalFile
    ) {

      alert("Please fill all mandatory fields and upload all documents.");
      return;

    }

    try {

      // ==========================================
      // FIXED FIELD NAMES FOR BACKEND
      // ==========================================
      const data = new FormData();

      data.append("department", formData.department);
      data.append("location", formData.location);

      // FIXED
      data.append("dateOfRequest", formData.requestDate);

      // FIXED
      data.append("workOrderNo", formData.workOrder);

      data.append("typeOfWork", formData.typeOfWork);

      data.append("jobValue", formData.jobValue);

      data.append("requesterName", formData.requester);

      data.append("superiorName", formData.superior);

      data.append("partyName", formData.partyName);

      // FIXED
      data.append("natureOfBG", formData.nature);

      data.append("bgAmount", amount);

      // FIXED
      data.append("bgExpiryDate", formData.expiryDate);

      data.append("claimPeriod", formData.claimPeriod);

      data.append("remarks", formData.remarks);

      // FILES
      data.append("bgDraft", formData.bgDraft);

      data.append("approvalFile", formData.approvalFile);

      data.append(
        "beneficiaryClause",
        formData.beneficiaryClause
      );

      data.append(
        "bankDetails",
        formData.bankDetails
      );

      // ==========================================
      // API CALL
      // ==========================================
      await API.post("/bg/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("BG Request Submitted Successfully!");

      // RESET
      setBgAmount("");

      setFormData({
        department: "",
        location: "",
        requestDate: "",
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

    } catch (error) {

      console.log(error);

      alert("Failed to submit request");

    }

  };

  return (
    <MainLayout>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-sm p-8"
      >

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-3xl font-bold text-[#5B2EFF]">
            BG Request Form
          </h1>

          <p className="text-gray-500 mt-2">
            Fill all required information carefully
          </p>

        </div>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Department */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Department *
            </label>

            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Location *
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50"
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Date of Request *
            </label>

            <input
              type="date"
              name="requestDate"
              value={formData.requestDate}
              onChange={handleChange}
              required
              className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50"
            />
          </div>

          {/* Work Order */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Work Order No. *
            </label>

            <input
              type="text"
              name="workOrder"
              value={formData.workOrder}
              onChange={handleChange}
              required
              className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50"
            />
          </div>

          {/* Type of Work */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Type of Work *
            </label>

            <input
              type="text"
              name="typeOfWork"
              value={formData.typeOfWork}
              onChange={handleChange}
              required
              className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50"
            />
          </div>

          {/* Job Value */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Job Value *
            </label>

            <input
              type="number"
              name="jobValue"
              value={formData.jobValue}
              onChange={handleChange}
              required
              className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50"
            />
          </div>

          {/* Requester */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Requester Name *
            </label>

            <input
              type="text"
              name="requester"
              value={formData.requester}
              onChange={handleChange}
              required
              className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50"
            />
          </div>

          {/* Superior */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Superior Name *
            </label>

            <input
              type="text"
              name="superior"
              value={formData.superior}
              onChange={handleChange}
              required
              className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50"
            />
          </div>

          {/* Party Name */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Name of the Party *
            </label>

            <input
              type="text"
              name="partyName"
              value={formData.partyName}
              onChange={handleChange}
              required
              className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50"
            />
          </div>

          {/* Nature */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Nature of R.G *
            </label>

            <input
              type="text"
              name="nature"
              value={formData.nature}
              onChange={handleChange}
              required
              className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50"
            />
          </div>

          {/* BG Amount */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              BG Amount *
            </label>

            <input
              type="number"
              value={bgAmount}
              onChange={(e) => setBgAmount(e.target.value)}
              placeholder="Enter amount"
              required
              className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50"
            />

            <p className="text-xs text-gray-500 mt-2 leading-6">
              Up to 15 Lakhs → MD Approval Required
              <br />
              Above 15 Lakhs → Board Approval Required
            </p>

          </div>

          {/* Expiry */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              BG Expiry Date *
            </label>

            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50"
            />
          </div>

          {/* Claim Period */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              BG Claim Period *
            </label>

            <input
              type="text"
              name="claimPeriod"
              value={formData.claimPeriod}
              onChange={handleChange}
              required
              className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50"
            />
          </div>

        </div>

        {/* REMARKS */}
        <div className="mt-6">

          <label className="text-sm font-medium text-gray-600">
            Remarks *
          </label>

          <textarea
            rows="5"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            required
            className="w-full mt-2 px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50"
          ></textarea>

        </div>

        {/* FILES */}
        <div className="mt-10">

          <h2 className="text-xl font-semibold text-[#5B2EFF] mb-6">
            Mandatory Attachments
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* BG Draft */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                I. BG Vetted Draft Word Format *
              </label>

              <input
                type="file"
                name="bgDraft"
                required
                onChange={handleFileChange}
                className="w-full mt-2 border border-gray-200 bg-gray-50 p-3 rounded-2xl"
              />
            </div>

            {/* CONDITIONAL APPROVAL */}
            {Number(bgAmount) <= 1500000 && bgAmount !== "" && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  II. MD Approval (Up to 15 Lakhs) *
                </label>

                <input
                  type="file"
                  name="approvalFile"
                  required
                  onChange={handleFileChange}
                  className="w-full mt-2 border border-green-300 bg-green-50 p-3 rounded-2xl"
                />
              </div>
            )}

            {Number(bgAmount) > 1500000 && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  III. Board Approval (More than 15 Lakhs) *
                </label>

                <input
                  type="file"
                  name="approvalFile"
                  required
                  onChange={handleFileChange}
                  className="w-full mt-2 border border-orange-300 bg-orange-50 p-3 rounded-2xl"
                />
              </div>
            )}

            {/* Beneficiary */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                IV. Beneficiary Advertisement / BC Requirement Clause *
              </label>

              <input
                type="file"
                name="beneficiaryClause"
                required
                onChange={handleFileChange}
                className="w-full mt-2 border border-gray-200 bg-gray-50 p-3 rounded-2xl"
              />
            </div>

            {/* Bank Details */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                V. Beneficiary Bank Account Details *
              </label>

              <input
                type="file"
                name="bankDetails"
                required
                onChange={handleFileChange}
                className="w-full mt-2 border border-gray-200 bg-gray-50 p-3 rounded-2xl"
              />
            </div>

          </div>

        </div>

        {/* BUTTON */}
        <div className="mt-10">

          <button
            type="submit"
            className="bg-[#6D4AFF] hover:bg-[#5B2EFF] text-white px-10 py-4 rounded-2xl font-semibold shadow-lg transition"
          >
            Submit Request
          </button>

        </div>

      </form>

    </MainLayout>
  );
}

export default BGRequest;