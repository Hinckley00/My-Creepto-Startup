import "./Navbar.css";
import newlogo from "../../assets/newlogo.jpg";
import arrow_icon from "../../assets/arrow_icon.png";
import { useAuth } from "../../context/AuthContext.jsx";
import { useContext } from "react";
import { CoinContext } from "../../context/CoinContext";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { setCurrency } = useContext(CoinContext);
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navbarRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const currencyHandler = (e) => {
    switch (e.target.value) {
      case "usd":
        setCurrency({ name: "usd", symbol: "$" });
        break;
      case "eur":
        setCurrency({ name: "eur", symbol: "€" });
        break;
      case "ngn":
        setCurrency({ name: "ngn", symbol: "₦" });
        break;
      default:
        setCurrency({ name: "usd", symbol: "$" });
    }
  };

  const handleHamburgerClick = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="navbar" ref={navbarRef}>
      <div className="navbar-content">
        <Link to={"/"}>
          <img src={newlogo} alt="logo" className="logo" />
        </Link>
        <ul className={menuOpen ? "open" : ""}>
          <Link to={"/"} onClick={() => setMenuOpen(false)}>
            <li>Home</li>
          </Link>
          <Link to={"/features"} onClick={() => setMenuOpen(false)}>
            <li>Features</li>
          </Link>
          <Link to={"/pricing"} onClick={() => setMenuOpen(false)}>
            <li>Pricing</li>
          </Link>
          <Link to={"/blog"} onClick={() => setMenuOpen(false)}>
            <li>Blog</li>
          </Link>
          <Link to={"/watchlist"} onClick={() => setMenuOpen(false)}>
            <li>Watchlist</li>
          </Link>
          <Link to={"/transactions"} onClick={() => setMenuOpen(false)}>
            <li>Transaction History</li>
          </Link>
        </ul>
        <div className="nav-actions">
          <div className="nav-right">
            <select onChange={currencyHandler}>
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="ngn">NGN</option>
            </select>
            {user ? (
              <button onClick={logout}>Logout</button>
            ) : (
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                <button>
                  Sign up <img src={arrow_icon} alt="" />
                </button>
              </Link>
            )}
          </div>
          <div
            className={`hamburger${menuOpen ? " open" : ""}`}
            onClick={handleHamburgerClick}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
