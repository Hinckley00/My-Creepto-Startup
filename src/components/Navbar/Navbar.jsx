import "./Navbar.css";
import newlogo from "../../assets/newlogo.jpg";
import arrow_icon from "../../assets/arrow_icon.png";
import { useAuth } from "../../context/AuthContext.jsx";
import { useContext } from "react";
import { CoinContext } from "../../context/CoinContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { setCurrency } = useContext(CoinContext);
  const { user, logout } = useAuth();

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

  return (
    <div className="navbar">
      <Link to={"/"}>
        <img src={newlogo} alt="logo" className="logo" />
      </Link>
      <ul>
        <Link to={"/"}>
          <li>Home</li>
        </Link>
        <Link to={"/features"}>
          <li>Features</li>
        </Link>
        <Link to={"/pricing"}>
          <li>Pricing</li>
        </Link>
        <Link to={"/blog"}>
          <li>Blog</li>
        </Link>
        <Link to={"/watchlist"}>
          <li>Watchlist</li>
        </Link>
      </ul>
      <div className="nav-right">
        <select onChange={currencyHandler}>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="ngn">NGN</option>
        </select>
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <Link to="/signup">
            <button>
              Sign up <img src={arrow_icon} alt="" />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
