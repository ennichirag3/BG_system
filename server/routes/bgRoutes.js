const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Multer: save to uploads/ with original extension ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// ── CREATE BG REQUEST ──────────────────────────────────
router.post(
  "/create",
  upload.fields([
    { name: "bgDraft",          maxCount: 1 },
    { name: "mdApproval",       maxCount: 1 },
    { name: "boardApproval",    maxCount: 1 },
    { name: "beneficiaryClause",maxCount: 1 },
    { name: "bankDetails",      maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const _id = "bg-" + Date.now();
      const {
        department = "",     location = "",        dateOfRequest = new Date().toISOString().split("T")[0],
        workOrderNo = "",    typeOfWork = "",      jobValue = 0,
        requesterName = "",  superiorName = "",    partyName = "",
        natureOfBG = "Performance BG",            bgAmount = 0,
        bgExpiryDate = "",   claimPeriod = "",     remarks = "",
        submittedBy = "",    submittedByRole = "",
      } = req.body;

      const bgDraft           = req.files?.bgDraft?.[0]?.filename           || "";
      const mdApproval        = req.files?.mdApproval?.[0]?.filename        || "";
      const boardApproval     = req.files?.boardApproval?.[0]?.filename     || "";
      const beneficiaryClause = req.files?.beneficiaryClause?.[0]?.filename || "";
      const bankDetails       = req.files?.bankDetails?.[0]?.filename       || "";

      db.prepare(`
        INSERT INTO bg_requests (
          _id, department, location, dateOfRequest, workOrderNo, typeOfWork,
          jobValue, requesterName, superiorName, partyName, natureOfBG,
          bgAmount, bgExpiryDate, claimPeriod, remarks, status,
          bgDraft, mdApproval, boardApproval, beneficiaryClause, bankDetails,
          submittedBy, submittedByRole
        ) VALUES (
          ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'Pending',?,?,?,?,?,?,?
        )
      `).run(
        _id, department, location, dateOfRequest, workOrderNo, typeOfWork,
        Number(jobValue), requesterName, superiorName, partyName, natureOfBG,
        Number(bgAmount), bgExpiryDate, claimPeriod, remarks,
        bgDraft, mdApproval, boardApproval, beneficiaryClause, bankDetails,
        submittedBy, submittedByRole
      );

      res.status(201).json({ success: true, message: "BG Request submitted successfully", data: { _id } });
    } catch (err) {
      console.error("CREATE BG ERROR:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ── DASHBOARD STATS ────────────────────────────────────
router.get("/stats/dashboard", (req, res) => {
  try {
    const total    = db.prepare("SELECT COUNT(*) AS c FROM bg_requests").get().c;
    const approved = db.prepare("SELECT COUNT(*) AS c FROM bg_requests WHERE status='Approved'").get().c;
    const rejected = db.prepare("SELECT COUNT(*) AS c FROM bg_requests WHERE status='Rejected'").get().c;
    const returned = db.prepare("SELECT COUNT(*) AS c FROM bg_requests WHERE status='Returned'").get().c;
    const pending  = db.prepare("SELECT COUNT(*) AS c FROM bg_requests WHERE status='Pending'").get().c;
    const amount   = db.prepare("SELECT SUM(bgAmount) AS t FROM bg_requests").get().t || 0;
    res.json({ success: true, data: { totalRequests: total, approvedRequests: approved, rejectedRequests: rejected, returnedRequests: returned, pendingRequests: pending, totalBGAmount: amount } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET ALL ────────────────────────────────────────────
router.get("/", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM bg_requests ORDER BY createdAt DESC").all();
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET ONE ────────────────────────────────────────────
router.get("/:id", (req, res) => {
  try {
    const row = db.prepare("SELECT * FROM bg_requests WHERE _id=? OR id=?").get(req.params.id, req.params.id);
    if (!row) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: row });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── UPDATE STATUS (ADMIN ONLY) ─────────────────────────
router.put("/:id/status", (req, res) => {
  try {
    const userRole = req.headers["x-user-role"] || req.body.userRole || "";
    const adminRoles = ["BG Administrator", "Admin", "admin", "Lead Admin"];
    if (!adminRoles.includes(userRole)) {
      return res.status(403).json({ success: false, message: "Permission Denied: Only an Administrator can approve or reject BG requests." });
    }

    const row = db.prepare("SELECT * FROM bg_requests WHERE _id=? OR id=?").get(req.params.id, req.params.id);
    if (!row) return res.status(404).json({ success: false, message: "Request not found" });

    const newStatus  = req.body.status        ?? row.status;
    const adminNotes = req.body.adminRemarks  ?? row.adminRemarks ?? "";

    db.prepare(`
      UPDATE bg_requests SET status=?, adminRemarks=?, updatedAt=CURRENT_TIMESTAMP
      WHERE _id=? OR id=?
    `).run(newStatus, adminNotes, req.params.id, req.params.id);

    const updated = db.prepare("SELECT * FROM bg_requests WHERE _id=? OR id=?").get(req.params.id, req.params.id);
    res.json({ success: true, message: `Marked as ${newStatus}`, data: updated });
  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE ─────────────────────────────────────────────
router.delete("/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM bg_requests WHERE _id=? OR id=?").run(req.params.id, req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
