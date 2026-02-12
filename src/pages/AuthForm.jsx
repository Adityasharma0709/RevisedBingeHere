import React, { useState } from 'react';
import './css/AuthForm.css';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="body-wrapper">
      <div className={`container ${isSignUp ? "right-panel-active" : ""}`} id="container">
        
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form action="#">
            <h1>Create Account</h1>
            <span>Use your email for registration</span> 
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type='text' placeholder='Phone'/>
            <input type="password" placeholder="Password" />
            <button>Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form action="#">
            <h1>Sign in</h1>
            
            <span>Use your account</span>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <a href="#">Forgot your password?</a>
            <button>Log In</button>
          </form>
        </div>

        {/* The Sliding Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={() => setIsSignUp(false)}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hey, Cinephile!</h1>
              <p>Quick, hit that login button!<br></br>
                The show’s about to start and the popcorn is waiting! 
              </p>
              <button className="ghost" onClick={() => setIsSignUp(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;