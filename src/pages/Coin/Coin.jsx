import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Coin.css";

import { CoinContext } from "../../context/CoinContext";
import LineChart from "../../components/LineChart/LineChart";

import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext.jsx";
import BuyModal from "../../components/BuyModal/BuyModal";

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState();
  const [historicalData, setHistoricalData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currency } = useContext(CoinContext);
  const { user } = useAuth();

  const fetchCoinData = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-vVvPYnsUUj7GfNCsCi5cgfEs",
      },
    };

    fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options)
      .then((res) => res.json())
      .then((res) => setCoinData(res))
      .catch((err) => console.error(err));
  };

  const fetchHistoricalData = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-vVvPYnsUUj7GfNCsCi5cgfEs",
      },
    };

    fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`,
      options
    )
      .then((res) => res.json())
      .then((res) => setHistoricalData(res))
      .catch((err) => console.error(err));
  };

  const saveToWatchlist = async () => {
    if (!user) {
      alert("Please log in to save coins to your watchlist.");
      return;
    }

    const coinRef = doc(db, "watchlists", user.uid);

    try {
      await setDoc(
        coinRef,
        {
          coins: {
            [coinData.id]: {
              name: coinData.name,
              symbol: coinData.symbol,
              image: coinData.image.large,
            },
          },
        },
        { merge: true }
      );
      alert("✅ Added to Watchlist!");
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  };

  useEffect(() => {
    fetchCoinData();
    fetchHistoricalData();
  }, [currency]);

  if (!coinData || !historicalData) {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }

  return (
    <div className="coin">
      <div className="coin-name">
        <img src={coinData.image?.large} alt={coinData.name} />
        <p>
          <b>
            {coinData.name} ({coinData.symbol.toUpperCase()})
          </b>
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          margin: "10px 0",
          justifyContent: "center",
          border: "none",
          padding: "10px 20px",
          fontWeight: "bold",
        }}
      >
        <button
          onClick={saveToWatchlist}
          style={{
            borderRadius: "25px",
            border: "none",
            background: "white",
            fontWeight: 500,
            fontSize: "15px",
            padding: "10px 25px",
          }}
        >
          ⭐ Add to Watchlist
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ 
            borderRadius: "25px",
            border: "none",
            background: "white",
            fontWeight: 500,
            fontSize: "15px",
            padding: "10px 25px", 
          }}
        >
          🛒 Buy
        </button>
      </div>

      <BuyModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        coin={{
          id: coinData.id,
          name: coinData.name,
          symbol: coinData.symbol,
          current_price: coinData.market_data.current_price[currency.name],
        }}
      />

      <div className="coin-chart">
        <LineChart historicalData={historicalData} />
      </div>

      <div className="coin-info">
        <ul>
          <li>Crypto Market Rank</li>
          <li>{coinData.market_cap_rank}</li>
        </ul>
        <ul>
          <li>Current Price</li>
          <li>
            {currency.symbol}{" "}
            {coinData.market_data.current_price[currency.name].toLocaleString()}
          </li>
        </ul>
        <ul>
          <li>Market Cap</li>
          <li>
            {currency.symbol}{" "}
            {coinData.market_data.market_cap[currency.name].toLocaleString()}
          </li>
        </ul>
        <ul>
          <li>24 Hour High</li>
          <li>
            {currency.symbol}{" "}
            {coinData.market_data.high_24h[currency.name].toLocaleString()}
          </li>
        </ul>
        <ul>
          <li>24 Hour Low</li>
          <li>
            {currency.symbol}{" "}
            {coinData.market_data.low_24h[currency.name].toLocaleString()}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Coin;
