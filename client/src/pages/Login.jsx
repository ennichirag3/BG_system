import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import loginImage from "../assets/login-image.png";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  // STATES
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  // ONLY NUMBERS ALLOWED (PHONE NUMBER)
  const handleUserIdChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setUserId(value);
  };

  // LOGIN FUNCTION
  const handleLogin = async () => {
    if (!userId || !password) {
      alert("Please enter Phone Number and Password");
      return;
    }

    try {
      const res = await API.post("/auth/login", {
        phoneNumber: userId,   // ✅ FIXED FIELD NAME
        password: password,
      });

      // SAVE TOKEN (if backend sends it)
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // SAVE USER DATA
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      alert("Login successful");

      navigate("/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5B2EFF] via-[#7B4DFF] to-[#9D7BFF] flex items-center justify-center px-4 py-6">

      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-[35px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-white/20">

        {/* LEFT SIDE */}
        <div className="relative hidden md:flex flex-col justify-center items-center p-10 bg-gradient-to-br from-[#5B2EFF] to-[#6F4BFF] text-white overflow-hidden">

          <div className="absolute w-72 h-72 bg-purple-300/20 blur-3xl rounded-full top-10 left-10"></div>

          <div className="relative z-10 flex flex-col items-center">

            <img
              src={loginImage}
              alt="Login Illustration"
              className="w-full max-w-sm object-contain drop-shadow-2xl"
            />

            <div className="mt-6 text-center px-4">

              <h2 className="text-4xl font-bold leading-tight">
                BG Management
                <br />
                System
              </h2>

              <p className="mt-4 text-purple-100 text-sm leading-7 max-w-sm">
                Secure and professional workflow platform for BG requests,
                approvals, reports and document tracking.
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white px-10 md:px-14 py-14 flex flex-col justify-center">

          <div>
            <h1 className="text-4xl font-bold text-gray-800">Hello!</h1>
            <p className="text-gray-500 mt-2 text-sm">
              Welcome back, login to continue
            </p>
          </div>

          <div className="mt-10 space-y-6">

            {/* PHONE NUMBER */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Phone Number
              </label>

              <input
                type="text"
                value={userId}
                onChange={handleUserIdChange}
                placeholder="Enter phone number"
                maxLength={10}
                className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-[#6D4AFF] focus:bg-white transition"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-[#6D4AFF] focus:bg-white transition"
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              onClick={handleLogin}
              className="w-full bg-[#6D4AFF] hover:bg-[#5B2EFF] text-white py-3 rounded-2xl font-semibold shadow-lg transition duration-300"
            >
              Login
            </button>

            {/* REGISTER BUTTON */}
            <Link to="/register">
              <button
                className="w-full border border-[#6D4AFF] text-[#6D4AFF] py-3 rounded-2xl font-semibold hover:bg-purple-50 transition duration-300"
              >
                Create Account
              </button>
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;