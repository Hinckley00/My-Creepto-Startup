import { useAuth } from "../../context/AuthContext";
import Watchlist from "../../components/Watchlist/Watchlist.jsx";
import TransactionHistory from "../../components/Transactions/TransactionHistory.jsx";
import "./Profile.css"; 

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <h1>👋 Welcome, {user?.email}</h1>
      <div className="profile-info">
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>User ID:</strong> {user?.uid}</p>
      </div>

      <div className="profile-section">
        <h2>⭐ Watchlist</h2>
        <Watchlist />
      </div>

      <div className="profile-section">
        <h2>📄 Transaction History</h2>
        <TransactionHistory />
      </div>
    </div>
  );
};

export default Profile;
