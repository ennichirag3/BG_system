const mongoose = require("mongoose");

const bgRequestSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    // FIXED
    dateOfRequest: {
      type: String,
      required: true,
    },

    // FIXED
    workOrderNo: {
      type: String,
      required: true,
    },

    typeOfWork: {
      type: String,
      required: true,
    },

    jobValue: {
      type: Number,
      required: true,
    },

    requesterName: {
      type: String,
      required: true,
    },

    superiorName: {
      type: String,
      required: true,
    },

    partyName: {
      type: String,
      required: true,
    },

    // FIXED
    natureOfBG: {
      type: String,
      required: true,
    },

    bgAmount: {
      type: Number,
      required: true,
    },

    // FIXED
    bgExpiryDate: {
      type: String,
      required: true,
    },

    claimPeriod: {
      type: String,
      required: true,
    },

    remarks: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // FILES
    bgDraft: {
      type: String,
      default: "",
    },

    approvalFile: {
      type: String,
      default: "",
    },

    beneficiaryClause: {
      type: String,
      default: "",
    },

    bankDetails: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "BGRequest",
  bgRequestSchema
);