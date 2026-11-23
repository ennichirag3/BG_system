import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import Interactive3DScene from "../components/Interactive3DScene";
import { IconShield } from "../components/Icons3D";

const DEPARTMENTS = [
  "Finance & Accounts","Procurement & Contracts","Operations & Projects",
  "Legal & Compliance","Engineering","Human Resources","Administration","Other"
];

function Register() {
  const navigate = useNavigate();

  const [phone, setPhone]           = useState("");
  const [fullName, setFullName]     = useState("");
  const [email, setEmail]           = useState("");
  const [dept, setDept]             = useState("");
  const [pass, setPass]             = useState("");
  const [confirmPass, setConfirm]   = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!phone || !fullName || !email || !dept || !pass || !confirmPass)
      return setError("All fields are required");
    if (phone.length !== 10)
      return setError("Phone number must be exactly 10 digits");
    if (pass.length < 6)
      return setError("Password must be at least 6 characters");
    if (pass !== confirmPass)
      return setError("Passwords do not match");

    setLoading(true);
    try {
      const res = await API.post("/auth/register", {
        phoneNumber: phone, fullName, email, department: dept, password: pass, role: "Requester"
      });
      setSuccess(res.data?.message || "Account created! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-[#060814] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition";

  return (
    <div className="min-h-screen w-screen bg-[#060812] flex items-center justify-center p-4 overflow-x-hidden relative">
      <Interactive3DScene density={50} className="fixed inset-0 pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-4xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-5 shadow-2xl border border-white/10 my-6 animate-3d-page bg-[#090d1c]">

        {/* LEFT — 2 cols */}
        <div className="md:col-span-2 p-8 flex flex-col justify-between bg-gradient-to-br from-indigo-950/90 via-[#0a0e20] to-[#060812] border-b md:border-b-0 md:border-r border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <IconShield className="w-10 h-10" />
              <div>
                <p className="text-white font-extrabold text-sm">BG Portal</p>
                <p className="text-indigo-300 text-[11px] font-mono">Bank Guarantee System</p>
              </div>
            </div>
            <h2 className="text-xl font-black text-white leading-snug mb-2">Create Your Account</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Register to submit and track Bank Guarantee requisitions for your department.
            </p>
            <div className="mt-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1">
              <p className="font-bold text-amber-300">Note on Roles</p>
              <p>All registered accounts are assigned the <strong>Requester</strong> role. Only designated Administrators can approve or reject BG dockets.</p>
            </div>
          </div>
          <div className="mt-6 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>SECURE REGISTRATION</span>
            <span className="text-emerald-400">SQLITE ACTIVE</span>
          </div>
        </div>

        {/* RIGHT — 3 cols */}
        <div className="md:col-span-3 p-8">
          <p className="text-indigo-400 text-[10px] font-mono uppercase font-bold tracking-wider mb-1">New Account</p>
          <h3 className="text-xl font-black text-white mb-5">Staff Registration</h3>

          {error   && <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">⚠ {error}</div>}
          {success && <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">✓ {success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Phone → User ID */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Phone Number <span className="text-indigo-400 font-normal">(This is your User ID for login)</span>
              </label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,""))}
                placeholder="10-digit mobile number" maxLength={10} className={inputCls} />
            </div>

            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="As per company records" className={inputCls} />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Corporate Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com" className={inputCls} />
            </div>

            {/* Department */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Department</label>
              <select value={dept} onChange={e => setDept(e.target.value)} className={inputCls + " cursor-pointer"}>
                <option value="" className="bg-[#090d1c]">Select department…</option>
                {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-[#090d1c]">{d}</option>)}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Password <span className="text-slate-500 font-normal">(min 6 characters)</span></label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={pass} onChange={e => setPass(e.target.value)}
                  placeholder="Create a secure password" className={inputCls + " pr-14"} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer">
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm Password</label>
              <input type="password" value={confirmPass} onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter your password" className={inputCls} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-xl btn-primary-3d font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer mt-2">
              {loading ? "Creating Account..." : (<><span>Create Account</span><span>→</span></>)}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-5">
            Already have an account?{" "}
            <Link to="/" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
