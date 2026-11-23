import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import Interactive3DScene from "../components/Interactive3DScene";
import {
  IconDashboard,
  IconBGRequest,
  IconApproval,
  IconReports,
  IconShield,
} from "../components/Icons3D";

function MainLayout({ children, noScroll = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  const { notifications = [] } = useApp() || {};

  const [showNotif, setShowNotif] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? JSON.parse(storedUser)
    : { fullName: "Chirag (Lead Admin)", role: "BG Administrator", phoneNumber: "9876543210" };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: IconDashboard, desc: "Overview & Metrics" },
    { name: "BG Request", path: "/bg-request", icon: IconBGRequest, desc: "New Guarantee" },
    { name: "Approval Desk", path: "/approval", icon: IconApproval, badge: notifications?.length || null, desc: "Review & Sign-Off" },
    { name: "Reports & Audit", path: "/reports", icon: IconReports, desc: "Ledgers & Export" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <div className="h-screen w-screen bg-[#060812] text-slate-100 flex flex-col overflow-hidden select-none">
      {/* 3D Cosmic Bokeh Background */}
      <Interactive3DScene density={60} className="fixed inset-0 pointer-events-none z-0" />

      {/* COMPACT TOP NAVIGATION BAR */}
      <header className="relative z-30 h-14 bg-[#0a0e1e]/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 shadow-lg">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300"
          >
            ☰
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <IconShield className="w-8 h-8 transition-transform group-hover:scale-105" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold tracking-tight text-white">
                  BG System
                </span>
                <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v3.2 3D
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
                Bank Guarantee Management Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {notifications && notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-400 rounded-full animate-ping"></span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-glass-card-glow p-3.5 shadow-2xl z-50 animate-3d-page">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold uppercase text-indigo-300">Pending Review</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 font-mono">
                    {notifications?.length || 0}
                  </span>
                </div>
                <div className="mt-2 max-h-48 overflow-y-auto space-y-1.5">
                  {!notifications || notifications.length === 0 ? (
                    <p className="text-[11px] text-slate-400 text-center py-3">No pending approvals.</p>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => {
                          navigate("/approval");
                          setShowNotif(false);
                        }}
                        className="p-2 rounded-xl bg-white/[0.03] hover:bg-indigo-600/20 border border-white/5 cursor-pointer text-xs"
                      >
                        <p className="font-semibold text-white truncate">{item.partyName || item.requesterName}</p>
                        <p className="text-[10px] text-indigo-300 mt-0.5">₹ {Number(item.bgAmount || 0).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
              {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <p className="font-bold text-white leading-tight">{user?.fullName || "Admin"}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{user?.role || "Administrator"}</p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`fixed inset-y-14 left-0 z-20 w-56 bg-[#080b18]/90 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between p-3.5 transition-transform duration-300 lg:static lg:translate-x-0 flex-shrink-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="space-y-3">
            <p className="px-2.5 text-[10px] font-mono uppercase text-slate-500 font-bold">
              Navigation
            </p>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600/30 to-cyan-600/20 text-white border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)] font-bold"
                        : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className="w-5 h-5 flex-shrink-0" glow={isActive} />
                      <span>{item.name}</span>
                    </div>

                    {item.badge ? (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-indigo-500 text-white font-mono">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer Card */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400">
              <span className="text-[9px] font-mono uppercase text-indigo-400 block font-bold">Database</span>
              <span className="text-white font-semibold">SQLite Active</span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition cursor-pointer"
            >
              <span>[→</span>
              <span>Sign Out</span>
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

        {/* MAIN PAGE VIEW (3D Page Perspective Animation on route change, Fits on one page) */}
        <main
          key={location.pathname}
          className={`flex-1 min-w-0 p-4 sm:p-5 lg:p-6 animate-3d-page ${
            noScroll ? "overflow-hidden flex flex-col justify-between" : "overflow-y-auto"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
