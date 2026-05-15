import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/AppContext";

function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    notifications,
    searchTerm,
    setSearchTerm,
  } = useApp();

  const [showNotif, setShowNotif] = useState(false);

  // USER FROM LOCAL STORAGE
  const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "BG Request", path: "/bg-request", icon: "📝" },
    { name: "Approval", path: "/approval", icon: "✅" },
    { name: "Reports", path: "/reports", icon: "📁" },
  ];

  return (
    <div className="min-h-screen flex bg-[#F5F3FF]">

      {/* SIDEBAR */}
      <div className="w-72 bg-gradient-to-b from-[#5B2EFF] via-[#6A3EFF] to-[#7B4DFF] text-white p-6 flex flex-col justify-between shadow-2xl">

        <div>

          {/* LOGO */}
          <div className="mb-14 flex items-center gap-3">

            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-lg">
              🛡️
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-wide">
                BG System
              </h1>
              <p className="text-sm text-purple-200 mt-1">
                Management Portal
              </p>
            </div>

          </div>

          {/* MENU */}
          <div className="space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition font-medium shadow-sm ${
                  location.pathname === item.path
                    ? "bg-white text-[#5B2EFF]"
                    : "hover:bg-white/20 text-white"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

        </div>

        {/* BOTTOM USER SECTION */}
        <div>

          {/* USER CARD */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 mb-5 border border-white/10">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-white text-[#5B2EFF] flex items-center justify-center font-bold text-xl shadow-lg">
                {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  {user?.fullName || "Admin User"}
                </h3>
                <p className="text-sm text-purple-200">
                  {user?.role || "BG Administrator"}
                </p>
              </div>

            </div>

          </div>

          {/* LOGOUT */}
          <button
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="w-full bg-white text-[#5B2EFF] py-4 rounded-2xl font-semibold hover:bg-purple-100 transition shadow-xl"
          >
            Logout
          </button>

        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-hidden">

        {/* TOPBAR */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-100 flex items-center justify-between">

          {/* LEFT TEXT */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome Back 👋 {user?.fullName || ""}
            </h2>

            <p className="text-gray-500 mt-2">
              Manage BG requests, approvals and reports efficiently
            </p>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">

            
            {/* NOTIFICATION */}
            <div className="relative">

              <div
                onClick={() => setShowNotif(!showNotif)}
                className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-[#5B2EFF] text-xl shadow-sm cursor-pointer hover:scale-105 transition"
              >
                🔔

                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </div>

              {/* DROPDOWN */}
              {showNotif && (
                <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-2xl border z-50">

                  <div className="p-4 border-b font-semibold">
                    Pending Requests
                  </div>

                  <div className="max-h-72 overflow-y-auto">

                    {notifications.length === 0 ? (
                      <p className="p-4 text-gray-500 text-sm">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => {
                            navigate("/approval");
                            setShowNotif(false);
                          }}
                          className="p-4 hover:bg-purple-50 cursor-pointer border-b"
                        >
                          <p className="text-sm font-semibold">
                            {item.requesterName}
                          </p>
                          <p className="text-xs text-gray-500">
                            ₹ {item.bgAmount} • {item.department}
                          </p>
                        </div>
                      ))
                    )}

                  </div>

                </div>
              )}

            </div>

            {/* PROFILE ICON */}
            <div className="w-12 h-12 rounded-2xl bg-[#6D4AFF] text-white flex items-center justify-center font-bold text-lg shadow-lg">
              {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
            </div>

          </div>

        </div>

        {/* PAGE CONTENT */}
        <div className="mt-8">
          {children}
        </div>

      </div>

    </div>
  );
}

export default MainLayout;