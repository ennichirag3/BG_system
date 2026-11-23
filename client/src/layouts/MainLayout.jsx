import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import Interactive3DScene from "../components/Interactive3DScene";

function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const { notifications = [] } = useApp() || {};

  const [showNotif, setShowNotif] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // USER FROM LOCAL STORAGE
  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? JSON.parse(storedUser)
    : { fullName: "Admin User", role: "BG Administrator", phoneNumber: "9876543210" };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊", desc: "Overview & Stats" },
    { name: "BG Request", path: "/bg-request", icon: "📝", desc: "Initiate Requisition" },
    { name: "Approval Desk", path: "/approval", icon: "✅", badge: notifications?.length || null, desc: "Review & Sign-off" },
    { name: "Reports & Audit", path: "/reports", icon: "📁", desc: "Ledger & Export" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 relative flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* 3D Depth-of-Field Bokeh Particle Canvas */}
      <Interactive3DScene density={65} className="fixed inset-0 pointer-events-none z-0" />

      {/* TOPBAR */}
      <header className="sticky top-0 z-30 bg-[#0a0e1c]/80 backdrop-blur-xl border-b border-white/10 px-5 sm:px-8 py-3.5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
          >
            ☰
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-indigo-300/30">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white">
                  BG Management System
                </h1>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Secure Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Bank Guarantee Requisitions, Approvals & Compliance
              </p>
            </div>
          </div>
        </div>

        {/* Right: Notifications & User Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <span className="text-base">🔔</span>
              {notifications && notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-indigo-400 rounded-full ring-2 ring-[#0a0e1c] animate-pulse"></span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-glass-card-glow p-4 shadow-2xl z-50 animate-page-enter">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    Pending Approvals
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200">
                    {notifications?.length || 0} Waiting
                  </span>
                </div>

                <div className="mt-3 max-h-60 overflow-y-auto space-y-2">
                  {!notifications || notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No pending approvals at this time.</p>
                  ) : (
                    notifications.slice(0, 5).map((item) => (
                      <div
                        key={item._id}
                        onClick={() => {
                          navigate("/approval");
                          setShowNotif(false);
                        }}
                        className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-indigo-600/20 border border-white/5 hover:border-indigo-500/30 transition cursor-pointer"
                      >
                        <p className="text-xs font-semibold text-white truncate">{item.requester || item.partyName || "BG Request"}</p>
                        <p className="text-[11px] text-indigo-300 mt-0.5">
                          ₹ {Number(item.bgAmount || 0).toLocaleString()} • {item.department}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-white/10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md text-sm">
              {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-white leading-tight">{user?.fullName || "Admin Officer"}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{user?.role || "BG Administrator"}</p>
            </div>
          </div>
        </div>
      </header>

      {/* BODY WITH SIDEBAR AND MAIN CONTENT */}
      <div className="flex-1 flex relative z-10">
        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`fixed inset-y-16 left-0 z-20 w-64 bg-[#0a0e1e]/90 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between p-4 transition-transform duration-300 lg:static lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="space-y-4">
            <div className="px-3 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Navigation
              </span>
            </div>

            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600/30 to-cyan-600/20 text-white border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.25)] font-bold"
                        : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{item.icon}</span>
                      <div>
                        <p className="leading-tight">{item.name}</p>
                        <p className="text-[10px] text-slate-500 leading-tight font-normal">{item.desc}</p>
                      </div>
                    </div>

                    {item.badge ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500 text-white font-mono shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Sign Out Card */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-400">
              <p className="text-[10px] uppercase font-mono text-indigo-300">System Mode</p>
              <p className="text-white font-semibold mt-0.5">SQLite Active (Permanent)</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition cursor-pointer"
            >
              <span>🚪</span>
              <span>Sign Out Session</span>
            </button>
          </div>
        </aside>

        {/* BACKDROP FOR MOBILE */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-10 bg-black/70 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* MAIN PAGE VIEW */}
        <main className="flex-1 min-w-0 p-5 sm:p-7 lg:p-9 animate-page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
