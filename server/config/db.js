const Database = require("better-sqlite3");
const path = require("path");
const bcrypt = require("bcryptjs");

// Permanent local SQLite database file that never pauses or expires
const dbPath = path.join(__dirname, "..", "database.sqlite");
const db = new Database(dbPath);

// Enable WAL mode for high concurrency & performance
db.pragma("journal_mode = WAL");

// CREATE TABLES
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    _id TEXT UNIQUE,
    phoneNumber TEXT UNIQUE NOT NULL,
    fullName TEXT NOT NULL,
    email TEXT,
    department TEXT,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'BG Administrator',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bg_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    _id TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    dateOfRequest TEXT NOT NULL,
    workOrderNo TEXT NOT NULL,
    typeOfWork TEXT NOT NULL,
    jobValue REAL NOT NULL,
    requesterName TEXT NOT NULL,
    superiorName TEXT NOT NULL,
    partyName TEXT NOT NULL,
    natureOfBG TEXT NOT NULL,
    bgAmount REAL NOT NULL,
    bgExpiryDate TEXT NOT NULL,
    claimPeriod TEXT NOT NULL,
    remarks TEXT DEFAULT '',
    status TEXT DEFAULT 'Pending',
    bgDraft TEXT DEFAULT '',
    approvalFile TEXT DEFAULT '',
    beneficiaryClause TEXT DEFAULT '',
    bankDetails TEXT DEFAULT '',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// SEED INITIAL DEFAULT ADMIN IF NOT EXISTS
const existingAdmin = db.prepare("SELECT * FROM users WHERE phoneNumber = ?").get("9876543210");
if (!existingAdmin) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare(`
    INSERT INTO users (_id, phoneNumber, fullName, email, department, password, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    "usr-" + Date.now(),
    "9876543210",
    "Chirag (Lead Admin)",
    "ennichirag065@gmail.com",
    "Finance & Accounts",
    hashedPassword,
    "BG Administrator"
  );
  console.log("✅ Seeded default admin: 9876543210 / admin123");
}

// SEED SAMPLE BG REQUESTS IF TABLE IS EMPTY
const countRequests = db.prepare("SELECT COUNT(*) AS total FROM bg_requests").get().total;
if (countRequests === 0) {
  const insertStmt = db.prepare(`
    INSERT INTO bg_requests (
      _id, department, location, dateOfRequest, workOrderNo, typeOfWork,
      jobValue, requesterName, superiorName, partyName, natureOfBG,
      bgAmount, bgExpiryDate, claimPeriod, remarks, status
    ) VALUES (
      @_id, @department, @location, @dateOfRequest, @workOrderNo, @typeOfWork,
      @jobValue, @requesterName, @superiorName, @partyName, @natureOfBG,
      @bgAmount, @bgExpiryDate, @claimPeriod, @remarks, @status
    )
  `);

  const initialRequests = [
    {
      _id: "bg-889101",
      department: "Finance & Accounts",
      location: "Mumbai Port Complex",
      dateOfRequest: "2026-10-12",
      workOrderNo: "WO-2026-ENG-847",
      typeOfWork: "Turnkey Refinery Automation",
      jobValue: 85000000,
      requesterName: "Siddharth Rao",
      superiorName: "Rajeev Bansal",
      partyName: "Bharat Petroleum Corp Ltd",
      natureOfBG: "Performance BG",
      bgAmount: 12500000,
      bgExpiryDate: "2027-12-31",
      claimPeriod: "6 Months",
      remarks: "Covenants verified under master facility.",
      status: "Approved",
    },
    {
      _id: "bg-889102",
      department: "Procurement & Contracts",
      location: "Jamshedpur Hub",
      dateOfRequest: "2026-11-04",
      workOrderNo: "WO-2026-TS-019",
      typeOfWork: "Structural Heavy Fabrication",
      jobValue: 24000000,
      requesterName: "Ananya Deshmukh",
      superiorName: "Deepak Khurana",
      partyName: "Tata Steel Projects",
      natureOfBG: "Performance BG",
      bgAmount: 4500000,
      bgExpiryDate: "2027-06-30",
      claimPeriod: "3 Months",
      remarks: "Cleared by Risk Committee.",
      status: "Approved",
    },
    {
      _id: "bg-889103",
      department: "Operations & Projects",
      location: "Delhi-NCR Corridor",
      dateOfRequest: "2026-11-18",
      workOrderNo: "NHAI-PKG-77",
      typeOfWork: "Expressway Segment 4",
      jobValue: 120000000,
      requesterName: "Kunal Mehra",
      superiorName: "Deepak Khurana",
      partyName: "National Highways Authority",
      natureOfBG: "Advance Payment BG",
      bgAmount: 18000000,
      bgExpiryDate: "2028-03-31",
      claimPeriod: "1 Year",
      remarks: "Requires board sign-off.",
      status: "Pending",
    },
    {
      _id: "bg-889104",
      department: "Legal & Compliance",
      location: "Kochi Metro",
      dateOfRequest: "2026-09-15",
      workOrderNo: "GMRC-SIG-202",
      typeOfWork: "Signaling & Telemetry",
      jobValue: 14000000,
      requesterName: "Meera Nair",
      superiorName: "Rajeev Bansal",
      partyName: "Global Metro Rail Cons.",
      natureOfBG: "Financial Guarantee",
      bgAmount: 2200000,
      bgExpiryDate: "2026-11-30",
      claimPeriod: "1 Month",
      remarks: "Clause 14 indemnity missing.",
      status: "Rejected",
    },
  ];

  initialRequests.forEach((req) => insertStmt.run(req));
  console.log("✅ Seeded initial BG requests in SQLite");
}

module.exports = db;
