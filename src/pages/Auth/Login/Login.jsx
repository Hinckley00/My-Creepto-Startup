import { useState } from "react";
import "./Login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unverified, setUnverified] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const provider = new GoogleAuthProvider();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setUnverified(false);
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!userCredential.user.emailVerified) {
        setUnverified(true);
        setLoading(false);
        return;
      }
      navigate(from);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate(from);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleResendVerification = async () => {
    setResendMsg("");
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);
      setResendMsg("Verification email resent! Please check your inbox.");
    } catch (err) {
      setError(
        "Failed to resend verification email. Please check your credentials."
      );
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSent(false);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err) {
      setResetError(err.message);
    }
  };

  return (
    <div className="container">
      <form
        className="login-box"
        onSubmit={resetMode ? handleForgotPassword : handleLogin}
      >
        <h2>{resetMode ? "Reset Password" : "Login"}</h2>
        {error && (
          <div style={{ color: "#ffb3b3", marginBottom: 10 }}>{error}</div>
        )}
        {unverified && (
          <div
            style={{
              color: "#fff",
              background: "#0b004e",
              padding: 12,
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <b>Your email is not verified.</b>
            <br />
            Please check your inbox for a verification email.
            <br />
            <button
              type="button"
              className="login-btn"
              style={{ marginTop: 10 }}
              onClick={handleResendVerification}
            >
              Resend Verification Email
            </button>
            {resendMsg && (
              <div style={{ color: "#b3ffb3", marginTop: 8 }}>{resendMsg}</div>
            )}
          </div>
        )}
        {resetMode ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="login-btn"
              style={{ marginTop: 10 }}
            >
              Send Password Reset Email
            </button>
            {resetSent && (
              <div style={{ color: "#b3ffb3", marginTop: 10 }}>
                Password reset email sent! Check your inbox.
              </div>
            )}
            {resetError && (
              <div style={{ color: "#ffb3b3", marginTop: 10 }}>
                {resetError}
              </div>
            )}
            <button
              type="button"
              className="login-btn"
              style={{ marginTop: 10 }}
              onClick={() => setResetMode(false)}
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            <div className="options">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <button
                type="button"
                style={{
                  background: "none",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => setResetMode(true)}
              >
                Forgot Password?
              </button>
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="login-btn"
              style={{
                marginTop: "10px",
                backgroundColor: "#4285F4",
                color: "#fff",
              }}
            >
              Sign in with Google
            </button>
          </>
        )}
        <p className="register-text">
          Don’t have an account? <Link to="/signup">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
