import React, { useState } from "react";
import Loader from "../components/Common/Loader.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./css/AuthForm.css";
import {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../services/auth.services";

const AuthForm = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [resetEmail, setResetEmail] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cities, setCities] = useState([]);

  // ðŸ” Static credentials
  // const credentials = [
  //   { email: "user1@gmail.com", password: "user123", role: "user" },
  //   { email: "user2@gmail.com", password: "user123", role: "user" },
  //   { email: "admin@gmail.com", password: "admin123", role: "admin" },
  // ];

  const stateCityData = {
    Odisha: ["Bhubaneswar", "Cuttack", "Puri", "Rourkela"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Karnataka: ["Bangalore", "Mysore"],
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    state: "",
  });

  const handleStateChange = (e) => {
    const selectedState = e.target.value;

    setFormData({
      ...formData,
      state: selectedState,
      city: "", // reset city
    });

    setCities(stateCityData[selectedState] || []);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email above first");
      return;
    }
    setIsLoading(true);
    setResetEmail(email);
    try {
      const response = await forgotPassword(email);
      toast.success(response.message || "OTP sent to your email");
      setStep(2);
      setShowModal(true);
    } catch (error) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otpValues.join("");
    if (otpString.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setIsLoading(true);
    try {
      const response = await verifyOTP(resetEmail, otpString);
      toast.success(response.message || "OTP verified");
      setStep(3);
    } catch (error) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await resetPassword(resetEmail, newPassword);
      toast.success(response.message || "Password reset successful");
      closeModal();
    } catch (error) {
      toast.error(error.message || "Error resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setStep(1);
    setResetEmail("");
    setOtpValues(["", "", "", "", "", ""]);
    setNewPassword("");
  };

  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    if (value && isNaN(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.substring(value.length - 1);
    setOtpValues(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      location: {
        city: formData.city,
        state: formData.state,
      },
    };

    try {
      const res = await registerUser(userData);

      // ✅ Show success toast
      toast.success(res.message || "Account created successfully 🎉");

      // ✅ Switch to Sign In panel
      setIsSignUp(false);

      // ✅ Optional: clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        city: "",
        state: "",
      });
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleLogin = (e) => {
  //   e.preventDefault();

  //   const user = credentials.find(
  //     (cred) => cred.email === email && cred.password === password,
  //   );

  //   if (!user) {
  //     toast.error("Invalid email or password ðŸš«");
  //     return;
  //   }

  //   if (user.role === "admin") {
  //     toast.success("Welcome Admin ðŸŽ¬");
  //     navigate("/admin");
  //   } else {
  //     toast.success("Welcome back! ðŸ¿");
  //     navigate("/landing2");
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser({ email, password });

      // ❗ Check if backend signals failure
      if (!response || response.success === false) {
        toast.error(response?.message || "Invalid email or password 🚫");
        return;
      }

      toast.success(response.message || "Welcome back! 🎉");

      const userId =
        response.user?._id ??
        response.user?.id ??
        response.user?.userId ??
        response.userId;

      const userProfile = {
        _id: userId,
        name: response.user?.name,
        email: response.user?.email,
        phone: response.user?.phone,
        role: response.user?.role ?? response.role,
      };

      localStorage.setItem("user", JSON.stringify(userProfile));

      if (userProfile.role === "admin") {
        navigate("/admin");
      } else if (userProfile.role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      // ✅ Handle actual thrown errors (like 401, network issues)
      const message =
        error.response?.data?.message || // axios backend message
        error.message ||
        "Invalid email or password 🚫";

      toast.error(message);
    }
  };

  return (
    <div className="body-wrapper">
      <Loader isLoading={isLoading} />
      <div
        className={`container ${isSignUp ? "right-panel-active" : ""}`}
        id="container"
      >
        {/* SIGN UP */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <span>Use your email for registration</span>
            <input
              name="name"
              type="text"
              placeholder="Name"
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              name="phone"
              type="text"
              placeholder="Phone"
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <select
              name="state"
              value={formData.state}
              onChange={handleStateChange}
              required
            >
              <option value="">Select State</option>
              {Object.keys(stateCityData).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={!formData.state}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* SIGN IN */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1>Sign in</h1>
            <span>Use your account</span>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <a href="#" onClick={handleForgotPassword}>
              Forgot your password?
            </a>

            <button type="submit">Log In</button>
          </form>
        </div>

        {/* OVERLAY */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button onClick={() => setIsSignUp(false)}>Sign In</button>
            </div>

            <div className="overlay-panel overlay-right">
              <h1>Hey, Cinephile!</h1>
              <p>
                Quick, hit that login button!
                <br></br>
                The show is about to start and the popcorn is waiting!
              </p>
              <button onClick={() => setIsSignUp(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {step === 2 && (
              <form
                onSubmit={handleVerifyOTP}
                style={{ padding: 0, height: "auto" }}
              >
                <h2>Verify OTP</h2>
                <p>Enter the 6-digit OTP sent to {resetEmail}</p>
                <div className="otp-container">
                  {otpValues.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="otp-box"
                      required
                    />
                  ))}
                </div>
                <div className="modal-actions">
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify"}
                  </button>
                  <button
                    type="button"
                    className="ghost"
                    onClick={closeModal}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {step === 3 && (
              <form
                onSubmit={handleResetPassword}
                style={{ padding: 0, height: "auto" }}
              >
                <h2>Reset Password</h2>
                <p>Enter your new password.</p>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <div className="modal-actions">
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? "Resetting..." : "Reset"}
                  </button>
                  <button
                    type="button"
                    className="ghost"
                    onClick={closeModal}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
