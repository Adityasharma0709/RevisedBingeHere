import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./css/AuthForm.css";

const AuthForm = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔐 Static credentials
  const credentials = [
    { email: "user1@gmail.com", password: "user123", role: "user" },
    { email: "user2@gmail.com", password: "user123", role: "user" },
    { email: "admin@gmail.com", password: "admin123", role: "admin" }
  ];

  const handleLogin = (e) => {
    e.preventDefault();

    const user = credentials.find(
      (cred) => cred.email === email && cred.password === password
    );

    if (!user) {
      toast.error("Invalid email or password 🚫");
      return;
    }

    if (user.role === "admin") {  
      toast.success("Welcome Admin 🎬");
      navigate("/admin");
    } else {
      toast.success("Welcome back! 🍿");
      navigate("/landing2");
    }
  };
  return (
    <div className="body-wrapper">
      <div
        className={`container ${isSignUp ? "right-panel-active" : ""}`}
        id="container"
      >
        {/* SIGN UP */}
        <div className="form-container sign-up-container">
          <form onSubmit={(e) => e.preventDefault()}>
            <h1>Create Account</h1>
            <span>Use your email for registration</span>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="text" placeholder="Phone" />
            <input type="password" placeholder="Password" />
            <button type="button" onClick={() => setIsSignUp(false)}>
              Sign Up
            </button>
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

            <a href="#">Forgot your password?</a>

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
                <br />
                The show’s about to start and the popcorn is waiting!
              </p>
              <button onClick={() => setIsSignUp(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;