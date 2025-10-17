import React from "react";
import "./UberLogin.css"; // we'll make this next

function UberLogin() {
  return (
    <div className="uber-login">
      {/* Top bar */}
      <header className="uber-header">
        <h1>ThatFoodTruck</h1>
      </header>

      {/* Login container */}
      <div className="login-container">
        <h2>What's your phone number or email?</h2>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter phone number or email"
          className="input-field"
        />

        {/* Continue button */}
        <button className="continue-btn">Continue</button>

        {/* Divider */}
        <div className="divider">
          <hr />
          <span>or</span>
          <hr />
        </div>

        {/* Google Login */}
        <button className="google-btn">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google logo"
          />
          Continue with Google
        </button>

        {/* Apple Login */}
        <button className="apple-btn">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
            alt="Apple logo"
          />
          Continue with Apple
        </button>

        {/* Divider */}
        <div className="divider">
          <hr />
          <span>or</span>
          <hr />
        </div>

        {/* QR Code Login */}
        <button className="qr-btn">
          <span role="img" aria-label="QR">
            ⌗
          </span>{" "}
          Log in with QR code
        </button>

        {/* Terms text */}
        <p className="terms">
          By continuing, you agree to calls, including by autodialer, WhatsApp,
          or texts from ThatFoodTruck and its affiliates. Text “STOP” to 89203 to opt out.
        </p>
      </div>
    </div>
  );
}

export default UberLogin;
