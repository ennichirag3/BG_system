const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");

// ==========================================
// MULTER SETUP
// ==========================================
const upload = multer({
  dest: "uploads/",
});

// ==========================================
// CREATE BG REQUEST
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

      const _id = "bg-" + Date.now();
      const {
        department = "General",
        location = "Default",
        dateOfRequest = new Date().toISOString().split("T")[0],
        workOrderNo = "",
        typeOfWork = "",
        jobValue = 0,
        requesterName = "",
        superiorName = "",
        partyName = "",
        natureOfBG = "Performance BG",
        bgAmount = 0,
        bgExpiryDate = "",
        claimPeriod = "",
        remarks = "",
      } = req.body;

      const bgDraft = req.files?.bgDraft?.[0]?.path || "";
      const approvalFile = req.files?.approvalFile?.[0]?.path || "";
      const beneficiaryClause = req.files?.beneficiaryClause?.[0]?.path || "";
      const bankDetails = req.files?.bankDetails?.[0]?.path || "";

      const stmt = db.prepare(`
        INSERT INTO bg_requests (
          _id, department, location, dateOfRequest, workOrderNo, typeOfWork,
          jobValue, requesterName, superiorName, partyName, natureOfBG,
          bgAmount, bgExpiryDate, claimPeriod, remarks, status,
          bgDraft, approvalFile, beneficiaryClause, bankDetails
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?
        )
      `);

      stmt.run(
        _id,
        department,
        location,
        dateOfRequest,
        workOrderNo,
        typeOfWork,
        Number(jobValue),
        requesterName,
        superiorName,
        partyName,
        natureOfBG,
        Number(bgAmount),
        bgExpiryDate,
        claimPeriod,
        remarks,
        bgDraft,
        approvalFile,
        beneficiaryClause,
        bankDetails
      );

      const savedRequest = db.prepare("SELECT * FROM bg_requests WHERE _id = ?").get(_id);

      console.log("✅ SAVED TO SQLITE:", savedRequest);

      return res.status(201).json({
        success: true,
        message: "BG Request Created Successfully in SQLite",
        data: savedRequest,
      });
    } catch (error) {
      console.log("❌ CREATE ERROR:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// ==========================================
// DASHBOARD STATS
// ==========================================
router.get("/stats/dashboard", (req, res) => {
  try {
    const totalRequests = db.prepare("SELECT COUNT(*) AS count FROM bg_requests").get().count;
    const approvedRequests = db.prepare("SELECT COUNT(*) AS count FROM bg_requests WHERE status = 'Approved'").get().count;
    const rejectedRequests = db.prepare("SELECT COUNT(*) AS count FROM bg_requests WHERE status = 'Rejected'").get().count;
    const pendingRequests = db.prepare("SELECT COUNT(*) AS count FROM bg_requests WHERE status = 'Pending'").get().count;
    
    const amountRow = db.prepare("SELECT SUM(bgAmount) AS total FROM bg_requests").get();
    const totalBGAmount = amountRow?.total || 0;

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
router.get("/", (req, res) => {
  try {
    const requests = db.prepare("SELECT * FROM bg_requests ORDER BY createdAt DESC").all();
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
router.get("/:id", (req, res) => {
  try {
    const request = db.prepare("SELECT * FROM bg_requests WHERE _id = ? OR id = ?").get(
      req.params.id,
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

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
router.put("/:id/status", (req, res) => {
  try {
    const bgRequest = db.prepare("SELECT * FROM bg_requests WHERE _id = ? OR id = ?").get(
      req.params.id,
      req.params.id
    );

    if (!bgRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const newStatus = req.body.status || bgRequest.status;
    const newRemarks = req.body.remarks !== undefined ? req.body.remarks : bgRequest.remarks;

    db.prepare(`
      UPDATE bg_requests
      SET status = ?, remarks = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE _id = ? OR id = ?
    `).run(newStatus, newRemarks, req.params.id, req.params.id);

    const updated = db.prepare("SELECT * FROM bg_requests WHERE _id = ? OR id = ?").get(
      req.params.id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
      data: updated,
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
// DELETE REQUEST
// ==========================================
router.delete("/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM bg_requests WHERE _id = ? OR id = ?").run(
      req.params.id,
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
