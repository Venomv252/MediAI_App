import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error("Please agree to the terms of service");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://mediai-app.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (platform) => {
    toast.info(`${platform} signup coming soon!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Center container */}
      <div className="flex justify-center items-center py-16 px-4">
        {/* Card */}
        <div className="bg-white w-[480px] rounded-xl shadow-lg px-10 py-10">
          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 text-blue-600 text-xl font-bold mb-3">
              <span className="text-3xl">➕</span>
              <span className="text-2xl">MediAI</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Create Your Account
            </h2>
            <p className="text-gray-500 text-sm">
              Empowering Healthcare with AI Technology
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Full Name input */}
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                👤
              </span>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-700"
              />
            </div>

            {/* Email input */}
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                ✉️
              </span>
              <input
                type="email"
                name="email"
                placeholder="E-mail Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-700"
              />
            </div>

            {/* Password input */}
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                🔒
              </span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-700"
              />
            </div>

            {/* Confirm Password input */}
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                🔒
              </span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-700"
              />
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 mb-6">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="w-4 h-4 mt-1 accent-blue-600 cursor-pointer"
              />
              <label className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  terms of service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  privacy policy
                </a>
              </label>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">Or Sign up with</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => handleSocialSignup("Facebook")}
              className="w-12 h-12 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition flex items-center justify-center shadow-md"
              title="Sign up with Facebook"
            >
              <FaFacebookF className="text-xl" />
            </button>
            <button
              onClick={() => handleSocialSignup("Instagram")}
              className="w-12 h-12 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-lg hover:opacity-90 transition flex items-center justify-center shadow-md"
              title="Sign up with Instagram"
            >
              <FaInstagram className="text-xl" />
            </button>
            <button
              onClick={() => handleSocialSignup("LinkedIn")}
              className="w-12 h-12 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition flex items-center justify-center shadow-md"
              title="Sign up with LinkedIn"
            >
              <FaLinkedinIn className="text-xl" />
            </button>
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
