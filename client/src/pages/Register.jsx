import { useNavigate } from "react-router-dom";
import { useState } from "react";
import loginImage from "../assets/login-image.png";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  // FORM STATES
  const [personalNumber, setPersonalNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ONLY NUMBERS
  const handlePersonalNumber = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPersonalNumber(value);
  };

  // REGISTER FUNCTION
  const handleRegister = async (e) => {
    e.preventDefault();

    // VALIDATION
    if (
      !personalNumber ||
      !fullName ||
      !email ||
      !department ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all mandatory fields");
      return;
    }

    if (personalNumber.length !== 10) {
      alert("Phone number must be 10 digits");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      alert("Password must be minimum 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await API.post("/auth/register", {
        phoneNumber: personalNumber,   // ✅ IMPORTANT FIX
        fullName,
        email,
        department,
        password,
      });

      alert(res.data.message || "Account created successfully");

      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5B2EFF] via-[#7B4DFF] to-[#9D7BFF] flex items-center justify-center px-4 py-6">

      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-xl rounded-[35px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-white/20">

        {/* LEFT SIDE */}
        <div className="relative hidden md:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-[#5B2EFF] to-[#6F4BFF] overflow-hidden">

          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>

          <img
            src={loginImage}
            alt="Register"
            className="relative z-10 w-full max-w-md object-contain drop-shadow-2xl"
          />

          <div className="relative z-10 text-center mt-8 text-white">

            <h1 className="text-4xl font-bold leading-tight">
              Create Your
              <br />
              Account
            </h1>

            <p className="mt-4 text-purple-100 text-sm leading-7 max-w-sm">
              Register to access BG requests, approvals,
              reports and workflow management.
            </p>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white px-8 md:px-14 py-10 flex flex-col justify-center">

          <div>
            <h2 className="text-4xl font-bold text-gray-800">Register</h2>
            <p className="text-gray-500 mt-2">
              Create your account to continue
            </p>
          </div>

          <form onSubmit={handleRegister} className="mt-8 space-y-5">

            {/* PHONE NUMBER */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Phone Number *
              </label>

              <input
                type="text"
                value={personalNumber}
                onChange={handlePersonalNumber}
                placeholder="Enter phone number"
                maxLength={10}
                required
                className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-[#6D4AFF] focus:bg-white transition"
              />
            </div>

            {/* FULL NAME */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Full Name *
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                required
                className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-[#6D4AFF] focus:bg-white transition"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Email Address *
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
                className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-[#6D4AFF] focus:bg-white transition"
              />
            </div>

            {/* DEPARTMENT */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Department *
              </label>

              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Enter department"
                required
                className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-[#6D4AFF] focus:bg-white transition"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Password *
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                minLength={6}
                className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-[#6D4AFF] focus:bg-white transition"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Confirm Password *
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                minLength={6}
                className="w-full mt-2 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-[#6D4AFF] focus:bg-white transition"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#6D4AFF] hover:bg-[#5B2EFF] text-white py-3 rounded-2xl font-semibold shadow-lg transition duration-300"
            >
              Create Account
            </button>

            {/* LOGIN LINK */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full border border-[#6D4AFF] text-[#6D4AFF] py-3 rounded-2xl font-semibold hover:bg-purple-50 transition duration-300"
            >
              Back to Login
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Register;