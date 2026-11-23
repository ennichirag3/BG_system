import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import Interactive3DScene from "../components/Interactive3DScene";
import { IconShield } from "../components/Icons3D";

function Login() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("phone"); // "phone" | "email"
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [session, setSession] = useState("24h");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot password
  const [showForgot, setShowForgot] = useState(false);
  const [fpStep, setFpStep] = useState(1);
  const [fpId, setFpId] = useState("");
  const [fpVerified, setFpVerified] = useState(null);
  const [fpNew, setFpNew] = useState("");
  const [fpConfirm, setFpConfirm] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpErr, setFpErr] = useState("");
  const [fpOk, setFpOk] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (tab === "phone" && (!phone || !password)) return setError("Enter phone number and password");
    if (tab === "email" && (!email || !password)) return setError("Enter email and password");
    setLoading(true);
    try {
      const payload = tab === "phone" ? { phoneNumber: phone, password } : { email, password };
      const res = await API.post("/auth/login", payload);
      if (res.data?.token) localStorage.setItem("token", res.data.token);
      if (res.data?.user) localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again or reset your password.");
    } finally {
      setLoading(false);
    }
  };

  const openForgot = () => {
    setFpStep(1); setFpId(phone || email || ""); setFpVerified(null);
    setFpNew(""); setFpConfirm(""); setFpErr(""); setFpOk("");
    setShowForgot(true);
  };

  const verifyAccount = async (e) => {
    e.preventDefault(); setFpErr(""); setFpOk("");
    if (!fpId.trim()) return setFpErr("Enter your registered phone number or email");
    setFpLoading(true);
    try {
      const res = await API.post("/auth/verify-account", { identifier: fpId.trim() });
      setFpVerified(res.data.data);
      setFpStep(2);
    } catch (err) {
      setFpErr(err.response?.data?.message || "Account not found");
    } finally { setFpLoading(false); }
  };

  const resetPassword = async (e) => {
    e.preventDefault(); setFpErr(""); setFpOk("");
    if (!fpNew || !fpConfirm) return setFpErr("Fill both password fields");
    if (fpNew.length < 6) return setFpErr("Password must be at least 6 characters");
    if (fpNew !== fpConfirm) return setFpErr("Passwords do not match");
    setFpLoading(true);
    try {
      const res = await API.post("/auth/reset-password", { identifier: fpId.trim(), newPassword: fpNew });
      setFpOk(res.data?.message || "Password updated! You can now sign in.");
      if (fpId.replace(/\D/g, "").length === 10) { setTab("phone"); setPhone(fpId.replace(/\D/g, "")); }
      else { setTab("email"); setEmail(fpId); }
      setPassword("");
      setTimeout(() => setShowForgot(false), 1800);
    } catch (err) {
      setFpErr(err.response?.data?.message || "Failed to reset password");
    } finally { setFpLoading(false); }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-[#060814] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition";

  return (
    <div className="h-screen w-screen bg-[#060812] flex items-center justify-center p-4 overflow-hidden relative">
      <Interactive3DScene density={70} className="fixed inset-0 pointer-events-none z-0" />

      {/* CARD */}
      <div className="relative z-10 w-full max-w-4xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-2xl border border-white/10 animate-3d-page bg-[#090d1c]">

        {/* LEFT */}
        <div className="p-8 flex flex-col justify-between bg-gradient-to-br from-indigo-950/90 via-[#0a0e20]/90 to-[#060812] border-b md:border-b-0 md:border-r border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <IconShield className="w-10 h-10" />
              <div>
                <p className="text-white font-extrabold text-sm">BG Portal</p>
                <p className="text-indigo-300 text-[11px] font-mono">Bank Guarantee Management System</p>
              </div>
            </div>
            <h1 className="text-2xl font-black text-white leading-snug mb-3">
              Institutional Guarantee Requisition & Approval Portal
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Centralized platform for Bank Guarantee origination, covenant verification, administrative sign-offs, and automated PDF audit ledgers.
            </p>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-white/[0.04] border border-white/5 space-y-3 text-xs">
            <p className="text-indigo-300 font-mono uppercase font-bold tracking-wider text-[10px]">Access Control Policy</p>
            {[
              ["🔒", "Only administrators can Approve or Reject BG requisitions"],
              ["📋", "Any registered staff may submit BG Request forms"],
              ["📊", "Reports show Approved & Rejected records (not Pending)"],
            ].map(([ic, txt]) => (
              <div key={txt} className="flex items-start gap-2 text-slate-300">
                <span>{ic}</span>
                <span>{txt}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>256-BIT SESSION</span>
            <span className="text-emerald-400">SQLITE ACTIVE</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="p-8 flex flex-col justify-center">
          <div className="mb-5">
            <p className="text-indigo-400 text-[10px] font-mono uppercase font-bold tracking-wider">Secure Sign In</p>
            <h2 className="text-2xl font-black text-white mt-0.5">Portal Access</h2>
            <p className="text-slate-400 text-xs mt-0.5">Enter your registered credentials to continue.</p>
          </div>

          {/* TABS */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 mb-5">
            {[["phone","📱  Phone Number"],["email","✉️  Corporate Email"]].map(([t,label]) => (
              <button key={t} type="button" onClick={() => setTab(t)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${tab===t ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>
                {label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
              <span className="mt-0.5">⚠</span><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {tab === "phone" ? (
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Phone Number (10 digits — your User ID)</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,""))}
                  placeholder="Enter 10-digit registered phone" maxLength={10} className={inputCls} />
              </div>
            ) : (
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Corporate Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com" className={inputCls} />
              </div>
            )}

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <button type="button" onClick={openForgot}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 cursor-pointer">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className={inputCls + " pr-10"} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs">
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  className="rounded border-slate-700" />
                Remember Terminal
              </label>
              <div className="flex items-center gap-1">
                <span>Session:</span>
                <select value={session} onChange={e => setSession(e.target.value)}
                  className="bg-transparent text-indigo-300 text-xs outline-none cursor-pointer">
                  <option value="8h" className="bg-[#090d1c]">8 Hours</option>
                  <option value="24h" className="bg-[#090d1c]">24 Hours</option>
                  <option value="7d" className="bg-[#090d1c]">7 Days</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-xl btn-primary-3d font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer">
              {loading ? "Authenticating..." : (<><span>Sign In to Dashboard</span><span>→</span></>)}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-5">
            New user?{" "}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2">
              Register your account
            </Link>
          </p>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl bg-[#0b0f22] border border-indigo-500/30 p-6 shadow-2xl animate-3d-page">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-indigo-400 text-[10px] font-mono uppercase font-bold">Account Recovery</p>
                <h3 className="text-lg font-black text-white">Reset Password</h3>
              </div>
              <button onClick={() => setShowForgot(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">✕</button>
            </div>

            {fpErr && <div className="mb-3 p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">⚠ {fpErr}</div>}
            {fpOk  && <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">✓ {fpOk}</div>}

            {fpStep === 1 ? (
              <form onSubmit={verifyAccount} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Registered Phone or Email</label>
                  <input type="text" value={fpId} onChange={e => setFpId(e.target.value)}
                    placeholder="9876543210 or name@company.com" className={inputCls} autoFocus />
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowForgot(false)} className="px-3 py-2 text-xs text-slate-400 hover:text-white cursor-pointer">Cancel</button>
                  <button type="submit" disabled={fpLoading} className="px-4 py-2 rounded-xl btn-primary-3d text-xs font-semibold cursor-pointer">
                    {fpLoading ? "Verifying..." : "Verify Account →"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={resetPassword} className="space-y-4">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                  Verified: <strong className="text-white">{fpVerified?.fullName}</strong>
                  <span className="block text-slate-400 mt-0.5 font-mono">Ph: {fpVerified?.phoneNumber}</span>
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">New Password (min 6 chars)</label>
                  <input type="password" value={fpNew} onChange={e => setFpNew(e.target.value)}
                    placeholder="New password" className={inputCls} autoFocus />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Confirm Password</label>
                  <input type="password" value={fpConfirm} onChange={e => setFpConfirm(e.target.value)}
                    placeholder="Re-enter new password" className={inputCls} />
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setFpStep(1)} className="px-3 py-2 text-xs text-slate-400 hover:text-white cursor-pointer">← Back</button>
                  <button type="submit" disabled={fpLoading} className="px-4 py-2 rounded-xl btn-primary-3d text-xs font-semibold cursor-pointer">
                    {fpLoading ? "Saving..." : "Save New Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
