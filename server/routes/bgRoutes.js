const express = require("express");
const router = express.Router();
const BGRequest = require("../models/BGRequest");
const multer = require("multer");

// ==========================================
// MULTER SETUP
// ==========================================
const upload = multer({
  dest: "uploads/",
});

// ==========================================
// CREATE BG REQUEST (FILE SUPPORT)
// ==========================================
router.post(
  "/create",
  upload.fields([
    { name: "bgDraft", maxCount: 1 },
    { name: "approvalFile", maxCount: 1 },
    { name: "beneficiaryClause", maxCount: 1 },
    { name: "bankDetails", maxCount: 1 },
  ]),
  async (req, res) => {

    try {

      console.log("🔥 CREATE REQUEST BODY:", req.body);

      console.log("📎 FILES:", req.files);

      const newRequest = new BGRequest({

        ...req.body,

        // FILE PATHS
        bgDraft:
          req.files?.bgDraft?.[0]?.path || "",

        approvalFile:
          req.files?.approvalFile?.[0]?.path || "",

        beneficiaryClause:
          req.files?.beneficiaryClause?.[0]?.path || "",

        bankDetails:
          req.files?.bankDetails?.[0]?.path || "",

      });

      const savedRequest = await newRequest.save();

      console.log("✅ SAVED TO DB:", savedRequest);

      return res.status(201).json({
        success: true,
        message: "BG Request Created Successfully",
        data: savedRequest,
      });

    } catch (error) {

      console.log("❌ CREATE ERROR:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
        error: error.errors || null,
      });

    }

  }
);

// ==========================================
// DASHBOARD STATS
// ==========================================
router.get("/stats/dashboard", async (req, res) => {

  try {

    const totalRequests =
      await BGRequest.countDocuments();

    const approvedRequests =
      await BGRequest.countDocuments({
        status: "Approved",
      });

    const rejectedRequests =
      await BGRequest.countDocuments({
        status: "Rejected",
      });

    const pendingRequests =
      await BGRequest.countDocuments({
        status: "Pending",
      });

    const allRequests =
      await BGRequest.find();

    const totalBGAmount = allRequests.reduce(
      (sum, item) =>
        sum + Number(item.bgAmount || 0),
      0
    );

    return res.status(200).json({
      success: true,
      data: {
        totalRequests,
        approvedRequests,
        rejectedRequests,
        pendingRequests,
        totalBGAmount,
      },
    });

  } catch (error) {

    console.log("❌ DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});

// ==========================================
// GET ALL BG REQUESTS
// ==========================================
router.get("/", async (req, res) => {

  try {

    const requests = await BGRequest.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: requests,
    });

  } catch (error) {

    console.log("❌ GET ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});

// ==========================================
// GET SINGLE REQUEST
// ==========================================
router.get("/:id", async (req, res) => {

  try {

    const request = await BGRequest.findById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: request,
    });

  } catch (error) {

    console.log("❌ SINGLE GET ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});

// ==========================================
// UPDATE STATUS
// ==========================================
router.put("/:id/status", async (req, res) => {

  try {

    const updatedRequest =
      await BGRequest.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    return res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
      data: updatedRequest,
    });

  } catch (error) {

    console.log("❌ STATUS UPDATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});

// ==========================================
// UPDATE FULL REQUEST
// ==========================================
router.put("/:id", async (req, res) => {

  try {

    const updatedRequest =
      await BGRequest.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    return res.status(200).json({
      success: true,
      message: "Request Updated Successfully",
      data: updatedRequest,
    });

  } catch (error) {

    console.log("❌ UPDATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});

// ==========================================
// DELETE REQUEST
// ==========================================
router.delete("/:id", async (req, res) => {

  try {

    await BGRequest.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Request Deleted Successfully",
    });

  } catch (error) {

    console.log("❌ DELETE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});

module.exports = router;