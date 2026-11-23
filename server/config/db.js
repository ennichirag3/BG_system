const Database = require("better-sqlite3");
const path = require("path");
const bcrypt = require("bcryptjs");

const dbPath = path.join(__dirname, "..", "database.sqlite");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

// DROP old bg_requests table if schema changed (dev only – safe because seeded)
// We use ALTER TABLE to add missing columns if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    _id TEXT UNIQUE,
    phoneNumber TEXT UNIQUE NOT NULL,
    fullName TEXT NOT NULL,
    email TEXT UNIQUE,
    department TEXT,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'Requester',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bg_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    _id TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL DEFAULT '',
    location TEXT NOT NULL DEFAULT '',
    dateOfRequest TEXT NOT NULL DEFAULT '',
    workOrderNo TEXT DEFAULT '',
    typeOfWork TEXT DEFAULT '',
    jobValue REAL DEFAULT 0,
    requesterName TEXT DEFAULT '',
    superiorName TEXT DEFAULT '',
    partyName TEXT DEFAULT '',
    natureOfBG TEXT DEFAULT 'Performance BG',
    bgAmount REAL DEFAULT 0,
    bgExpiryDate TEXT DEFAULT '',
    claimPeriod TEXT DEFAULT '',
    remarks TEXT DEFAULT '',
    adminRemarks TEXT DEFAULT '',
    status TEXT DEFAULT 'Pending',
    bgDraft TEXT DEFAULT '',
    mdApproval TEXT DEFAULT '',
    boardApproval TEXT DEFAULT '',
    beneficiaryClause TEXT DEFAULT '',
    bankDetails TEXT DEFAULT '',
    submittedBy TEXT DEFAULT '',
    submittedByRole TEXT DEFAULT '',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Add missing columns safely (for existing DBs)
const addColSafe = (table, col, def) => {
  try { db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`); } catch (_) {}
};
addColSafe("bg_requests", "adminRemarks", "TEXT DEFAULT ''");
addColSafe("bg_requests", "mdApproval",   "TEXT DEFAULT ''");
addColSafe("bg_requests", "boardApproval","TEXT DEFAULT ''");
addColSafe("bg_requests", "submittedBy",  "TEXT DEFAULT ''");
addColSafe("bg_requests", "submittedByRole","TEXT DEFAULT ''");
addColSafe("users", "email", "TEXT");

// SEED ADMIN (only if not already there)
const existingAdmin = db.prepare("SELECT * FROM users WHERE phoneNumber = ?").get("9876543210");
if (!existingAdmin) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare(`
    INSERT INTO users (_id, phoneNumber, fullName, email, department, password, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    "usr-admin-001",
    "9876543210",
    "Chirag (Lead Admin)",
    "ennichirag065@gmail.com",
    "Administration",
    hashedPassword,
    "BG Administrator"
  );
  console.log("✅ Seeded default admin: 9876543210 / admin123");
}

// SEED SAMPLE REQUESTS if empty
const countRequests = db.prepare("SELECT COUNT(*) AS total FROM bg_requests").get().total;
if (countRequests === 0) {
  const ins = db.prepare(`
    INSERT INTO bg_requests (
      _id, department, location, dateOfRequest, workOrderNo, typeOfWork,
      jobValue, requesterName, superiorName, partyName, natureOfBG,
      bgAmount, bgExpiryDate, claimPeriod, remarks, status, submittedBy, submittedByRole
    ) VALUES (
      @_id,@department,@location,@dateOfRequest,@workOrderNo,@typeOfWork,
      @jobValue,@requesterName,@superiorName,@partyName,@natureOfBG,
      @bgAmount,@bgExpiryDate,@claimPeriod,@remarks,@status,@submittedBy,@submittedByRole
    )
  `);

  [
    { _id:"bg-001", department:"Finance & Accounts",  location:"Mumbai Port Complex", dateOfRequest:"2026-10-12", workOrderNo:"WO-2026-ENG-847", typeOfWork:"Turnkey Refinery Automation",   jobValue:85000000,  requesterName:"Siddharth Rao",   superiorName:"Rajeev Bansal",    partyName:"Bharat Petroleum Corp Ltd",   natureOfBG:"Performance BG",     bgAmount:12500000, bgExpiryDate:"2027-12-31", claimPeriod:"6 Months", remarks:"Covenants verified.",    status:"Approved", submittedBy:"Siddharth Rao",   submittedByRole:"Requester" },
    { _id:"bg-002", department:"Procurement & Contracts", location:"Jamshedpur Hub",   dateOfRequest:"2026-11-04", workOrderNo:"WO-2026-TS-019",  typeOfWork:"Structural Heavy Fabrication", jobValue:24000000,  requesterName:"Ananya Deshmukh", superiorName:"Deepak Khurana",  partyName:"Tata Steel Projects",         natureOfBG:"Performance BG",     bgAmount:4500000,  bgExpiryDate:"2027-06-30", claimPeriod:"3 Months", remarks:"Cleared by Risk.",        status:"Approved", submittedBy:"Ananya Deshmukh", submittedByRole:"Requester" },
    { _id:"bg-003", department:"Operations & Projects",  location:"Delhi-NCR Corridor",dateOfRequest:"2026-11-18", workOrderNo:"NHAI-PKG-77",     typeOfWork:"Expressway Segment 4",        jobValue:120000000, requesterName:"Kunal Mehra",     superiorName:"Deepak Khurana",  partyName:"National Highways Authority", natureOfBG:"Advance Payment BG", bgAmount:18000000, bgExpiryDate:"2028-03-31", claimPeriod:"1 Year",   remarks:"Awaiting board sign-off.", status:"Pending",  submittedBy:"Kunal Mehra",     submittedByRole:"Requester" },
    { _id:"bg-004", department:"Legal & Compliance",    location:"Kochi Metro",        dateOfRequest:"2026-09-15", workOrderNo:"GMRC-SIG-202",    typeOfWork:"Signaling & Telemetry",       jobValue:14000000,  requesterName:"Meera Nair",      superiorName:"Rajeev Bansal",   partyName:"Global Metro Rail Cons.",     natureOfBG:"Financial Guarantee", bgAmount:2200000,  bgExpiryDate:"2026-11-30", claimPeriod:"1 Month",  remarks:"Clause 14 indemnity missing.", status:"Rejected", submittedBy:"Meera Nair",      submittedByRole:"Requester" },
  ].forEach(r => ins.run(r));
  console.log("✅ Seeded sample BG requests");
}

module.exports = db;
