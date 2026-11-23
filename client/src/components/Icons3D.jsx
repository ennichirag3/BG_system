import React from "react";

// Reusable 3D Base Badge Wrapper with Glass Bevel & Specular Sheen
function IconBadge3D({ children, className = "w-6 h-6", glowColor = "rgba(99, 102, 241, 0.4)" }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center transition-transform hover:scale-110 duration-200 select-none ${className}`}
      style={{ filter: `drop-shadow(0 4px 10px ${glowColor})` }}
    >
      {children}
    </div>
  );
}

// 1. DASHBOARD 3D ICON
export function IconDashboard({ className = "w-6 h-6", glow = true }) {
  return (
    <IconBadge3D className={className} glowColor="rgba(99, 102, 241, 0.45)">
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="bg-dash" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4338ca" />
            <stop offset="1" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="bar-1" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#a5b4fc" />
            <stop offset="1" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="bar-2" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#67e8f9" />
            <stop offset="1" stopColor="#0891b2" />
          </linearGradient>
          <linearGradient id="bar-3" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#c084fc" />
            <stop offset="1" stopColor="#9333ea" />
          </linearGradient>
        </defs>
        {/* 3D Chamfered Tile Base */}
        <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#bg-dash)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        {/* Specular Top Shine */}
        <path d="M4 10C4 6.68629 6.68629 4 10 4H22C25.3137 4 28 6.68629 28 10C28 7.5 25.3137 6 22 6H10C6.68629 6 4 7.5 4 10Z" fill="white" fillOpacity="0.25" />
        {/* 3D Vertical Metric Pillars */}
        <rect x="6.5" y="15" width="4.5" height="11" rx="2" fill="url(#bar-1)" />
        <rect x="13.75" y="9" width="4.5" height="17" rx="2" fill="url(#bar-2)" />
        <rect x="21" y="6" width="4.5" height="20" rx="2" fill="url(#bar-3)" />
      </svg>
    </IconBadge3D>
  );
}

// 2. BG REQUEST 3D ICON (Origination File & Plus Stamp)
export function IconBGRequest({ className = "w-6 h-6", glow = true }) {
  return (
    <IconBadge3D className={className} glowColor="rgba(6, 182, 212, 0.45)">
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="bg-req" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0284c7" />
            <stop offset="1" stopColor="#082f49" />
          </linearGradient>
          <linearGradient id="btn-plus" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#bg-req)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <path d="M4 10C4 6.68629 6.68629 4 10 4H22C25.3137 4 28 6.68629 28 10C28 7.5 25.3137 6 22 6H10C6.68629 6 4 7.5 4 10Z" fill="white" fillOpacity="0.25" />
        {/* Docket Sheet */}
        <path d="M8 8C8 6.89543 8.89543 6 10 6H18L24 12V22C24 23.1046 23.1046 24 22 24H10C8.89543 24 8 23.1046 8 22V8Z" fill="#1e293b" stroke="rgba(255,255,255,0.2)" />
        <path d="M18 6V12H24" fill="#38bdf8" fillOpacity="0.4" />
        {/* Floating 3D Stamp */}
        <circle cx="21" cy="21" r="5.5" fill="url(#btn-plus)" stroke="#0f172a" strokeWidth="1.5" />
        <path d="M21 18.5V23.5M18.5 21H23.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </IconBadge3D>
  );
}

// 3. APPROVAL DESK 3D ICON (Shield & Verification Seal)
export function IconApproval({ className = "w-6 h-6", glow = true }) {
  return (
    <IconBadge3D className={className} glowColor="rgba(16, 185, 129, 0.45)">
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="bg-appr" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#059669" />
            <stop offset="1" stopColor="#064e3b" />
          </linearGradient>
          <linearGradient id="shield-core" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#34d399" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#bg-appr)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <path d="M4 10C4 6.68629 6.68629 4 10 4H22C25.3137 4 28 6.68629 28 10C28 7.5 25.3137 6 22 6H10C6.68629 6 4 7.5 4 10Z" fill="white" fillOpacity="0.25" />
        {/* 3D Shield */}
        <path d="M16 6L9 9V16C9 20.5 12 24.5 16 26C20 24.5 23 20.5 23 16V9L16 6Z" fill="url(#shield-core)" stroke="rgba(255,255,255,0.3)" />
        <path d="M12.5 16L15 18.5L20 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </IconBadge3D>
  );
}

// 4. REPORTS & AUDIT 3D ICON (Analytics Ledger Folder)
export function IconReports({ className = "w-6 h-6", glow = true }) {
  return (
    <IconBadge3D className={className} glowColor="rgba(168, 85, 247, 0.45)">
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="bg-rep" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7e22ce" />
            <stop offset="1" stopColor="#3b0764" />
          </linearGradient>
          <linearGradient id="folder-tab" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#c084fc" />
            <stop offset="1" stopColor="#9333ea" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#bg-rep)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <path d="M4 10C4 6.68629 6.68629 4 10 4H22C25.3137 4 28 6.68629 28 10C28 7.5 25.3137 6 22 6H10C6.68629 6 4 7.5 4 10Z" fill="white" fillOpacity="0.25" />
        {/* Ledger Folder */}
        <path d="M6 10C6 8.89543 6.89543 8 8 8H13L15 10H24C25.1046 10 26 10.8954 26 12V22C26 23.1046 25.1046 24 24 24H8C6.89543 24 6 23.1046 6 22V10Z" fill="url(#folder-tab)" />
        <path d="M10 18L13.5 14.5L17 17.5L22 12.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="22" cy="12.5" r="1.5" fill="white" />
      </svg>
    </IconBadge3D>
  );
}

// 5. TOTAL REQUESTS 3D TILE
export function IconTotal({ className = "w-6 h-6" }) {
  return (
    <IconBadge3D className={className} glowColor="rgba(99, 102, 241, 0.4)">
      <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="tot-tile" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#312e81" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="24" height="24" rx="7" fill="url(#tot-tile)" stroke="rgba(255,255,255,0.2)" />
        <path d="M7 8H21M7 13H21M7 18H15" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </IconBadge3D>
  );
}

// 6. APPROVED ISSUED 3D TILE
export function IconApproved({ className = "w-6 h-6" }) {
  return (
    <IconBadge3D className={className} glowColor="rgba(16, 185, 129, 0.4)">
      <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="app-tile" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10b981" />
            <stop offset="1" stopColor="#064e3b" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="24" height="24" rx="7" fill="url(#app-tile)" stroke="rgba(255,255,255,0.2)" />
        <path d="M8 14L12 18L20 10" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </IconBadge3D>
  );
}

// 7. PENDING REVIEW 3D TILE
export function IconPending({ className = "w-6 h-6" }) {
  return (
    <IconBadge3D className={className} glowColor="rgba(245, 158, 11, 0.4)">
      <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="pend-tile" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f59e0b" />
            <stop offset="1" stopColor="#78350f" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="24" height="24" rx="7" fill="url(#pend-tile)" stroke="rgba(255,255,255,0.2)" />
        <circle cx="14" cy="14" r="6" stroke="white" strokeWidth="2" />
        <path d="M14 11V14.5L16.5 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </IconBadge3D>
  );
}

// 8. FLAGGED / REJECTED 3D TILE
export function IconRejected({ className = "w-6 h-6" }) {
  return (
    <IconBadge3D className={className} glowColor="rgba(239, 68, 68, 0.4)">
      <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="rej-tile" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ef4444" />
            <stop offset="1" stopColor="#7f1d1d" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="24" height="24" rx="7" fill="url(#rej-tile)" stroke="rgba(255,255,255,0.2)" />
        <path d="M10 10L18 18M18 10L10 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </IconBadge3D>
  );
}

// 9. TOTAL BG AMOUNT 3D TILE
export function IconAmount({ className = "w-6 h-6" }) {
  return (
    <IconBadge3D className={className} glowColor="rgba(6, 182, 212, 0.4)">
      <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="amt-tile" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#06b6d4" />
            <stop offset="1" stopColor="#0e7490" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="24" height="24" rx="7" fill="url(#amt-tile)" stroke="rgba(255,255,255,0.2)" />
        <path d="M9 8H18M9 12H15M9 8V18M15 12C16.8 12 18 10.8 18 9C18 7.2 16.8 6 15 6M13.5 12L18.5 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </IconBadge3D>
  );
}

// 10. SYSTEM SHIELD 3D ICON
export function IconShield({ className = "w-6 h-6" }) {
  return (
    <IconBadge3D className={className} glowColor="rgba(99, 102, 241, 0.5)">
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="shield-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#818cf8" />
            <stop offset="0.5" stopColor="#4f46e5" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <path d="M16 3L5 7.5V15C5 21.5 9.7 27.5 16 29C22.3 27.5 27 21.5 27 15V7.5L16 3Z" fill="url(#shield-grad)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
        <circle cx="16" cy="15" r="4.5" fill="white" fillOpacity="0.25" />
        <circle cx="16" cy="15" r="2.2" fill="white" />
      </svg>
    </IconBadge3D>
  );
}
