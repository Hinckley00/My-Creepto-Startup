import { db } from "../../firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Watchlist.css";

const Watchlist = () => {
  const { user } = useAuth();
  const [coins, setCoins] = useState({});

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (user) {
        const coinRef = doc(db, "watchlists", user.uid);
        const docSnap = await getDoc(coinRef);
        if (docSnap.exists()) {
          setCoins(docSnap.data().coins || {});
        }
      }
    };

    fetchWatchlist();
  }, [user]);

  const removeCoin = async (coinId) => {
    const coinRef = doc(db, "watchlists", user.uid);
    const updated = { ...coins };
    delete updated[coinId];

    await updateDoc(coinRef, {
      coins: updated,
    });

    setCoins(updated);
  };

  return (
    <div className="watchlist-page">
      <h1>Your Watchlist</h1>

      {Object.keys(coins).length === 0 ? (
        <p>No coins saved yet.</p>
      ) : (
        Object.entries(coins).map(([id, coin]) => (
          <div key={id} className="watchlist-coin">
            <img src={coin.image} alt={coin.name} width="30" />
            <span>
              {coin.name} ({coin.symbol.toUpperCase()})
            </span>
            <button onClick={() => removeCoin(id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Watchlist;
