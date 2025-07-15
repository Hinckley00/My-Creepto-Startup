import Modal from "react-modal";
import { useState } from "react";
import { db } from "../../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import "./BuyModal.css";

Modal.setAppElement("#root");

const BuyModal = ({ isOpen, onRequestClose, coin }) => {
  const [amount, setAmount] = useState("");
  const { user } = useAuth();

  const handleBuy = async () => {
    if (!user) {
      alert("Please log in to buy coins.");
      return;
    }

    const transaction = {
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      priceAtPurchase: coin.current_price,
      amount: Number(amount),
      total: Number(amount) * coin.current_price,
      date: new Date().toISOString(),
      currency: "usd",
    };

    try {
      const txRef = doc(db, "transactions", user.uid);
      await updateDoc(txRef, {
        records: arrayUnion(transaction),
      });
      alert("✅ Fake purchase recorded!");
      onRequestClose();
    } catch (err) {
      console.error("Error recording transaction:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Buy Coin"
      style={{
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 9999,
  },
  content: {
    background: "linear-gradient(#0b004e, #1d152f, #002834)",
    padding: "30px",
    borderRadius: "15px",
    width: "400px",
    maxWidth: "90vw",
    margin: "auto",
    color: "white",
    boxShadow: "0 0 15px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",      
    justifyContent: "center",  
    height: "fit-content",    
  },
}}

    >
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        Buy {coin.name}
      </h2>
      <input
        type="number"
        placeholder="Amount to buy"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          border: "none",
          borderRadius: "10px",
          backgroundColor: "rgba(255,255,255,0.1)",
          color: "white",
        }}
      />
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={handleBuy}
          style={{
            flex: 1,
            padding: "10px",
            background: "transparent",
            color: "white",
            border: "1px solid white",
            borderRadius: "20px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ✅ Confirm Purchase
        </button>
        <button
          onClick={onRequestClose}
          style={{
            flex: 1,
            padding: "10px",
            background: "transparent",
            color: "white",
            border: "1px solid white",
            borderRadius: "20px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ❌ Cancel Purchase
        </button>
      </div>
    </Modal>
  );
};

export default BuyModal;
