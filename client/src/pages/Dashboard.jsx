import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";
import TiltCard from "../components/TiltCard";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalRequests: 32,
    approvedRequests: 24,
    rejectedRequests: 2,
    pendingRequests: 6,
    totalBGAmount: 64250000,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [targetMarket, setTargetMarket] = useState("SBI & HDFC Consortium (INR)");
  const [analysisPeriod, setAnalysisPeriod] = useState("12 Months");
  const [watchlistCount, setWatchlistCount] = useState(3);
  const [historyCount, setHistoryCount] = useState(12);

  const quickFilters = ["ALL", "PBG (Performance)", "APG (Advance)", "FINANCIAL"];
  const quickCompanies = [
    { name: "L&T Infrastructure", code: "L&T" },
    { name: "Reliance Projects", code: "RIL" },
    { name: "Tata Power", code: "TATA" },
    { name: "Bharat Petroleum", code: "BPCL" },
    { name: "Siemens India", code: "SIEMENS" },
  ];

  // FETCH DASHBOARD STATS
  const fetchDashboardStats = async () => {
    try {
      const response = await API.get("/bg/stats/dashboard");
      if (response?.data?.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.log("Using live offline stats:", error);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
        
        {/* LEFT COLUMN: USER PREFERENCES & WATCHLIST (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* USER PREFERENCES CARD */}
          <div className="cyber-panel p-5 rounded-2xl border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base text-[#00ff88]">🌐</span>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Guarantee Facility Parameters
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Default Issuing Consortium
                </label>
                <div className="relative">
                  <select
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06140d] border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-[#00ff88]"
                  >
                    <option value="SBI & HDFC Consortium (INR)">SBI & HDFC Consortium (INR)</option>
                    <option value="ICICI Global Trade Facility (USD)">ICICI Global Trade Facility (USD)</option>
                    <option value="Standard Chartered Treasury (INR)">Standard Chartered Treasury (INR)</option>
                    <option value="Axis Bank Corporate Trade (INR)">Axis Bank Corporate Trade (INR)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Standard Guarantee Validity Horizon
                </label>
                <div className="relative">
                  <select
                    value={analysisPeriod}
                    onChange={(e) => setAnalysisPeriod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06140d] border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-[#00ff88]"
                  >
                    <option value="6 Months">6 Months</option>
                    <option value="12 Months">12 Months (Standard)</option>
                    <option value="24 Months">24 Months (Capital Projects)</option>
                    <option value="36 Months">36 Months (EPC Concession)</option>
                  </select>
                </div>
              </div>

              {/* Glowing Neon Green Button (Directly matching screenshot) */}
              <button
                type="button"
                onClick={() => alert("Facility parameters updated successfully!")}
                className="w-full py-2.5 px-4 rounded-xl btn-neon-solid flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
              >
                <span>✓</span>
                <span>Save Facility Preferences</span>
              </button>
            </div>
          </div>

          {/* SAVED WATCHLIST CARD */}
          <div className="cyber-panel p-5 rounded-2xl border border-emerald-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base text-[#00ff88]">🔖</span>
                <h3 className="text-sm font-bold text-white tracking-wide">High-Value Watchlist</h3>
              </div>
              <span className="w-5 h-5 rounded-full bg-[#081b12] border border-emerald-500/40 text-[#00ff88] text-[10px] font-mono font-bold flex items-center justify-center">
                {watchlistCount}
              </span>
            </div>

            <div className="space-y-2 mt-3">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-emerald-500/15 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">L&T Infrastructure</p>
                  <p className="text-[10px] text-emerald-400/80 font-mono">₹ 14.5 Cr • Exp: 2027-12</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-[#00ff88] font-mono">SEALED</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-emerald-500/15 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">Siemens Power Ltd</p>
                  <p className="text-[10px] text-amber-400/80 font-mono">₹ 8.2 Cr • In Review</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">PENDING</span>
              </div>
            </div>
          </div>

          {/* AUDIT / RESEARCH HISTORY */}
          <div className="cyber-panel p-5 rounded-2xl border border-emerald-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base text-[#00ff88]">🕒</span>
                <h3 className="text-sm font-bold text-white tracking-wide">Audit & Swift Logs</h3>
              </div>
              <span className="w-5 h-5 rounded-full bg-[#081b12] border border-emerald-500/40 text-[#00ff88] text-[10px] font-mono font-bold flex items-center justify-center">
                {historyCount}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Recent ledger verification: <span className="text-[#00ff88] font-mono">0x4a9...f812</span> confirmed 14 mins ago.
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: SEARCH & SPECIALIZED 4 AI AGENTS (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">

          {/* GUARANTEE SEARCH & INTELLIGENCE BAR */}
          <div className="cyber-panel p-5 rounded-2xl border border-emerald-500/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-base text-[#00ff88]">🔍</span>
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Guarantee Search & Exposure Query
                </h2>
              </div>

              {/* Exchange / Guarantee Type Pills */}
              <div className="flex items-center gap-1.5">
                {quickFilters.map((pill) => (
                  <button
                    key={pill}
                    onClick={() => setSelectedTag(pill)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                      selectedTag === pill
                        ? "bg-[#00ff88] text-[#05150d] shadow-[0_0_12px_rgba(0,255,136,0.5)]"
                        : "bg-[#06140d] text-slate-400 hover:text-white border border-emerald-500/20"
                    }`}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>

            {/* Input + Solid Green Button Row (Directly matching screenshot) */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by company name or docket ID (e.g. L&T, Siemens, BPCL, WO-2026)..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#06140d] border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#00ff88]"
                />
                <span className="absolute left-3 top-3 text-slate-400 text-xs">🔍</span>
              </div>

              <button
                onClick={() => navigate("/approval")}
                className="py-2.5 px-5 rounded-xl btn-neon-solid text-xs font-bold flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
              >
                <span>⚡</span>
                <span>Search & Verify Docket</span>
              </button>
            </div>

            {/* Quick Alpha / Company Tags */}
            <div className="flex items-center flex-wrap gap-2 pt-1 text-[11px]">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Quick Alpha:</span>
              {quickCompanies.map((comp) => (
                <button
                  key={comp.code}
                  onClick={() => setSearchQuery(comp.name)}
                  className="px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-[#00ff88]/15 text-slate-300 hover:text-[#00ff88] border border-white/5 transition text-[10px] font-mono"
                >
                  {comp.name}
                </button>
              ))}
            </div>
          </div>

          {/* SPECIALIZED GUARANTEE AI AGENTS HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-base text-[#00ff88]">🤖</span>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Specialized Guarantee Analysis AI Agents
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/bg-request")}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.04] hover:bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs transition cursor-pointer"
              >
                <span>🔄</span>
                <span>Run Multi-Agent Deep Dive</span>
              </button>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse"></span>
                4 Specialized Agents
              </span>
            </div>
          </div>

          {/* 4 SPECIALIZED AI AGENTS (2x2 Grid with 3D Tilt matching screenshot) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* AGENT #1 */}
            <TiltCard
              maxTilt={10}
              onClick={() => navigate("/bg-request")}
              className="cyber-panel p-5 rounded-2xl border border-emerald-500/25 hover:border-emerald-500/50 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-sm text-[#00ff88]">
                    📈
                  </div>
                  <span className="badge-agent">AGENT #1</span>
                </div>

                <h3 className="text-sm font-bold text-white tracking-wide">
                  Fundamental Analysis Agent
                </h3>
                <p className="text-[11px] text-cyan-300 font-mono mt-0.5">
                  Tender Covenants & Valuation
                </p>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  Evaluates balance sheet capacity, cash flow ratios, work order milestones, and contract indemnity limits.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-cyan-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>Standby</span>
                </div>
                <span className="text-slate-400 font-mono text-[10px]">
                  Autonomous Agent Ready
                </span>
              </div>
            </TiltCard>

            {/* AGENT #2 */}
            <TiltCard
              maxTilt={10}
              onClick={() => navigate("/reports")}
              className="cyber-panel p-5 rounded-2xl border border-emerald-500/25 hover:border-emerald-500/50 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-sm text-[#00ff88]">
                    📉
                  </div>
                  <span className="badge-agent">AGENT #2</span>
                </div>

                <h3 className="text-sm font-bold text-white tracking-wide">
                  Technical Analysis Agent
                </h3>
                <p className="text-[11px] text-cyan-300 font-mono mt-0.5">
                  Exposure Velocity & Momentum Signals
                </p>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  Synthesizes portfolio drawdown trends, maturity clusters, moving concentration averages, and liquidity buffers.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-cyan-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>Standby</span>
                </div>
                <span className="text-slate-400 font-mono text-[10px]">
                  Autonomous Agent Ready
                </span>
              </div>
            </TiltCard>

            {/* AGENT #3 */}
            <TiltCard
              maxTilt={10}
              onClick={() => navigate("/approval")}
              className="cyber-panel p-5 rounded-2xl border border-emerald-500/25 hover:border-emerald-500/50 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-sm text-[#00ff88]">
                    📡
                  </div>
                  <span className="badge-agent">AGENT #3</span>
                </div>

                <h3 className="text-sm font-bold text-white tracking-wide">
                  News & Sentiment Agent
                </h3>
                <p className="text-[11px] text-cyan-300 font-mono mt-0.5">
                  Beneficiary Disputes & Macro Feeds
                </p>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  Aggregates real-time regulatory notices, legal arbitrations, court injunctions, and counterparty credit ratings.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-cyan-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>Standby</span>
                </div>
                <span className="text-slate-400 font-mono text-[10px]">
                  Autonomous Agent Ready
                </span>
              </div>
            </TiltCard>

            {/* AGENT #4 */}
            <TiltCard
              maxTilt={10}
              onClick={() => navigate("/approval")}
              className="cyber-panel p-5 rounded-2xl border border-emerald-500/25 hover:border-emerald-500/50 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-sm text-[#00ff88]">
                    🛡️
                  </div>
                  <span className="badge-agent">AGENT #4</span>
                </div>

                <h3 className="text-sm font-bold text-white tracking-wide">
                  Risk Management Agent
                </h3>
                <p className="text-[11px] text-cyan-300 font-mono mt-0.5">
                  Volatility & Claim Drawdown Guard
                </p>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  Cross-checks counter-guarantee margin coverage, multi-level sign-offs, and consortium ceiling thresholds.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-cyan-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>Standby</span>
                </div>
                <span className="text-slate-400 font-mono text-[10px]">
                  Autonomous Agent Ready
                </span>
              </div>
            </TiltCard>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Dashboard;
