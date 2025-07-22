import { useState, useEffect } from "react";
import "../Login/Login.css";
import { auth } from "../../../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  reload,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const getProviderLink = (email) => {
  if (!email || typeof email !== "string" || !email.includes("@")) return null;
  const domain = email.split("@")[1];
  if (!domain) return null;
  if (domain.includes("gmail")) return "https://mail.google.com/";
  if (domain.includes("yahoo")) return "https://mail.yahoo.com/";
  if (domain.includes("outlook") || domain.includes("hotmail"))
    return "https://outlook.live.com/";
  if (domain.includes("icloud")) return "https://www.icloud.com/mail";
  return `https://${domain}`;
};

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState("");
  const [userObj, setUserObj] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (verificationSent && userObj && !isVerified) {
      setChecking(true);
      interval = setInterval(async () => {
        await reload(userObj);
        if (userObj.emailVerified) {
          setIsVerified(true);
          setChecking(false);
          clearInterval(interval);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [verificationSent, userObj, isVerified]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);
      setVerificationSent(true);
      setUserObj(userCredential.user);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleContinue = () => {
    navigate("/login");
  };

  const providerLink = getProviderLink(email);

  return (
    <div className="container">
      <form className="login-box" onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        {verificationSent ? (
          <div
            style={{
              color: "#fff",
              background: "#0b004e",
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <b>Verification email sent!</b>
            <br />
            Please check your inbox and verify your email before logging in.
            <br />
            {providerLink && (
              <a
                href={providerLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#ffd700",
                  textDecoration: "underline",
                  display: "block",
                  marginTop: 8,
                }}
              >
                Open your email provider
              </a>
            )}
            {checking && !isVerified && (
              <div style={{ color: "#ffd700", marginTop: 8 }}>
                Waiting for verification...
              </div>
            )}
            {isVerified && (
              <button
                type="button"
                className="login-btn"
                style={{ marginTop: 16 }}
                onClick={handleContinue}
              >
                Continue to Login
              </button>
            )}
          </div>
        ) : null}
        {error && (
          <div style={{ color: "#ffb3b3", marginBottom: 10 }}>{error}</div>
        )}
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={verificationSent}
        />
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={verificationSent}
          />
          <span
            className="toggle-eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        <button type="submit" className="login-btn" disabled={verificationSent}>
          Create Account
        </button>
        <p className="register-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
