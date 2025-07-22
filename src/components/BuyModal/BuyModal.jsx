import Modal from "react-modal";
import { useState, useContext } from "react";
import { db } from "../../firebase";
import { doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { CoinContext } from "../../context/CoinContext";
import "./BuyModal.css";

Modal.setAppElement("#root");

const BuyModal = ({ isOpen, onRequestClose, coin }) => {
  const [amount, setAmount] = useState("");
  const { user } = useAuth();
  const { currency } = useContext(CoinContext);

  const handleBuy = async () => {
    if (!user) {
      alert("Please log in to buy coins.");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    const transaction = {
      coinId: coin.id,
      coinName: coin.name,
      coinSymbol: coin.symbol,
      price: coin.current_price,
      amount: Number(amount),
      total: Number(amount) * coin.current_price,
      timestamp: Date.now(),
      currency: currency?.symbol || "USD",
    };
    try {
      const txRef = doc(db, "transactions", user.uid);
      // Ensure the document exists before using arrayUnion
      await setDoc(txRef, { history: [] }, { merge: true });
      await updateDoc(txRef, {
        history: arrayUnion(transaction),
      });
      onRequestClose();
    } catch (err) {
      console.error("Error recording transaction:", err);
      alert("Error recording transaction.");
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
