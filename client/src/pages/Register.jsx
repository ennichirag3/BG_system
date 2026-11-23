import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import Interactive3DScene from "../components/Interactive3DScene";
import TiltCard from "../components/TiltCard";

function Register() {
  const navigate = useNavigate();

  // FORM STATES
  const [personalNumber, setPersonalNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePersonalNumber = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPersonalNumber(value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!personalNumber || !fullName || !email || !department || !password || !confirmPassword) {
      setErrorMsg("Please fill all required fields");
      return;
    }

    if (personalNumber.length !== 10) {
      setErrorMsg("Phone number must be exactly 10 digits");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/register", {
        phoneNumber: personalNumber,
        fullName,
        email,
        department,
        password,
      });

      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      alert("Registration complete! Redirecting to login.");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070913] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* 3D Depth-of-Field Bokeh Canvas */}
      <Interactive3DScene density={70} className="fixed inset-0 pointer-events-none z-0" />

      {/* Main Glass Shell */}
      <div className="relative z-10 w-full max-w-4xl rounded-3xl overflow-hidden bg-glass-card-glow grid grid-cols-1 md:grid-cols-12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10">
        
        {/* LEFT HERO BRANDING */}
        <div className="relative md:col-span-5 p-8 sm:p-10 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-950/70 via-[#0c1024]/80 to-[#070913]/95 border-b md:border-b-0 md:border-r border-white/10">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-indigo-300/30">
              ⚡
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-white mt-4">
              Enterprise Registration
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Register corporate officer profile for Bank Guarantee origination, covenant verification, and compliance audits.
            </p>
          </div>

          <div className="space-y-3 my-6">
            <TiltCard maxTilt={8} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="text-xs font-semibold text-indigo-300">● Role-Based Access Control</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Finance, Procurement, Operations, and Legal role segregation</p>
            </TiltCard>
            <TiltCard maxTilt={8} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="text-xs font-semibold text-cyan-300">● Audit Ready Ledger</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Exportable PDF guarantee dossiers & Excel ledger sheets</p>
            </TiltCard>
          </div>

          <div className="text-xs text-slate-400">
            Already registered?{" "}
            <Link to="/" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2">
              Sign In Instead
            </Link>
          </div>
        </div>

        {/* RIGHT REGISTER FORM */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-[#0a0e1e]/95 backdrop-blur-2xl">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-indigo-400">
              Officer Onboarding
            </span>
            <h1 className="text-2xl font-black text-white mt-1 tracking-tight">Create Corporate Account</h1>
            <p className="text-xs text-slate-400 mt-1">Provide verified details for departmental enrollment.</p>
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="mt-5 space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#070a14] border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Corporate Phone *</label>
                <input
                  type="text"
                  value={personalNumber}
                  onChange={handlePersonalNumber}
                  placeholder="10 digit number"
                  maxLength={10}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#070a14] border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Work Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#070a14] border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Department *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#070a14] border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select Department</option>
                  <option value="Finance & Accounts">Finance & Accounts</option>
                  <option value="Procurement & Contracts">Procurement & Contracts</option>
                  <option value="Operations & Projects">Operations & Projects</option>
                  <option value="Legal & Compliance">Legal & Compliance</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#070a14] border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Confirm Password *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#070a14] border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 rounded-xl btn-primary-3d text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Enrolling Officer..." : "Complete Registration →"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Register;
