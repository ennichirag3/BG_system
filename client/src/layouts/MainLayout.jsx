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
    : { fullName: "Chirag (Lead Officer)", email: "ennichirag065@gmail.com", role: "BG Administrator" };

  const menuItems = [
    { name: "Overview Desk", path: "/dashboard", icon: "📊", tag: "AGENT #1" },
    { name: "BG Requisition", path: "/bg-request", icon: "📝", tag: "AGENT #2" },
    { name: "Approval Engine", path: "/approval", icon: "🛡️", badge: notifications?.length || null },
    { name: "Ledger & Audit", path: "/reports", icon: "📈", tag: "AGENT #4" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#040806] text-[#e5f6ee] relative flex flex-col selection:bg-[#00ff88] selection:text-[#040806]">
      {/* 3D Depth-of-Field Bokeh Canvas Background */}
      <Interactive3DScene density={70} accent="#00ff88" className="fixed inset-0 pointer-events-none z-0" />

      {/* TOP HEADER BAR (Directly matching user screenshot) */}
      <header className="sticky top-0 z-30 bg-[#050e09]/85 backdrop-blur-xl border-b border-[#00ff88]/20 px-4 sm:px-6 py-3 flex items-center justify-between shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
        {/* Left Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:text-white"
          >
            ☰
          </button>

          <div className="w-10 h-10 rounded-xl bg-[#00ff88]/15 border border-[#00ff88]/40 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(0,255,136,0.3)]">
            🛡️
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black tracking-wider text-white">
                BG INTELLIGENCE SYSTEM
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/40">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse"></span>
                v2.4 ONLINE
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-emerald-400/80 font-mono tracking-wide uppercase">
              Multi-Agent Guarantee Research Engine
            </p>
          </div>
        </div>

        {/* Right User & Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative p-2 rounded-xl bg-[#081811] hover:bg-[#0c2419] border border-emerald-500/25 text-emerald-400 hover:text-white transition cursor-pointer"
            >
              <span className="text-base">🔔</span>
              {notifications && notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#00ff88] rounded-full ring-2 ring-[#050e09] animate-pulse"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotif && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl cyber-panel-glow p-4 shadow-2xl z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00ff88]">Pending Approvals</span>
                  <span className="badge-agent">{notifications?.length || 0} Ready</span>
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
                        className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-[#00ff88]/15 border border-white/5 hover:border-[#00ff88]/30 transition cursor-pointer"
                      >
                        <p className="text-xs font-semibold text-white truncate">{item.requester || item.partyName || "BG Docket"}</p>
                        <p className="text-[11px] text-emerald-400/80 mt-0.5">
                          ₹ {Number(item.bgAmount || 0).toLocaleString()} • {item.department}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Email Pill (Exactly like screenshot) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#081811] border border-emerald-500/30 text-xs text-slate-200">
            <span className="w-5 h-5 rounded-full bg-[#00ff88] text-[#05150d] font-bold text-[11px] flex items-center justify-center">
              {user?.fullName?.charAt(0)?.toUpperCase() || "E"}
            </span>
            <span className="font-mono text-[11px] text-slate-300">
              {user?.email || "ennichirag065@gmail.com"}
            </span>
          </div>

          {/* Red Outline Logout Button (Matching screenshot) */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/50 bg-red-950/20 hover:bg-red-900/30 text-red-400 text-xs font-semibold transition cursor-pointer"
          >
            <span>[→</span>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* BODY WITH NAVIGATION AND CONTENT */}
      <div className="flex-1 flex relative z-10">
        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`fixed inset-y-16 left-0 z-20 w-64 bg-[#050e09]/90 backdrop-blur-2xl border-r border-[#00ff88]/20 flex flex-col justify-between p-4 transition-transform duration-300 lg:static lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="space-y-4">
            <div className="px-3 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Specialized Agents
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
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/40 shadow-[0_0_15px_rgba(0,255,136,0.15)] font-bold"
                        : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>

                    {item.badge ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#00ff88] text-[#05150d] font-mono">
                        {item.badge}
                      </span>
                    ) : item.tag ? (
                      <span className="badge-agent text-[9px]">{item.tag}</span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick System Telemetry Card */}
          <div className="p-3.5 rounded-2xl bg-[#081811] border border-emerald-500/20 text-xs">
            <div className="flex items-center justify-between text-[11px] text-emerald-400 font-mono">
              <span>LEDGER SYNC</span>
              <span className="text-[#00ff88]">ONLINE</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Active Guarantee Facility:
              <p className="font-mono text-sm font-bold text-white mt-0.5">₹ 250.0 Cr</p>
            </div>
          </div>
        </aside>

        {/* BACKDROP FOR MOBILE */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-10 bg-black/70 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* MAIN PAGE VIEW (With smooth transitions) */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
