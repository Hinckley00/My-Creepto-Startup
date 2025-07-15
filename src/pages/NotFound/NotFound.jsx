import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/"), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // vertical center
        alignItems: "center", // horizontal center
        background: "linear-gradient(#0b004e, #1d152f, #002834)",
        color: "white",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "6rem", marginBottom: "1rem", color: "#ff5555" }}>
        404
      </h1>
      <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
        Oops! Nothing to see here. <br /> Redirecting to home...
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 25px",
          borderRadius: "25px",
          fontWeight: "bold",
          backgroundColor: "#ffffff",
          color: "#000000",
          border: "none",
          cursor: "pointer",
        }}
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
