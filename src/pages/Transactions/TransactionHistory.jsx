import React, { useContext, useEffect, useState } from "react";
import "./TransactionHistory.css";
import { CoinContext } from "../../context/CoinContext";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const conversionRates = {
  usd: 1,
  eur: 0.92,
  ngn: 1500,
};

const TransactionHistory = () => {
  const { currency } = useContext(CoinContext);
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const rate = conversionRates[currency.name] || 1;
  const symbol = currency.symbol || "$";

  useEffect(() => {
    if (!user) return;
    const txRef = doc(db, "transactions", user.uid);
    const unsub = onSnapshot(txRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const list = Array.isArray(data.history) ? data.history : [];
        // Sort by timestamp descending
        setTransactions(list.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setTransactions([]);
      }
    });
    return () => unsub();
  }, [user]);

  return (
    <div className="transaction-history-bg">
      <div className="transaction-history-container">
        <h2>Transaction History</h2>
        {!user || transactions.length === 0 ? (
          <p style={{ color: "#ccc", textAlign: "center" }}>
            No transactions found.
          </p>
        ) : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Coin</th>
                <th>Amount</th>
                <th>
                  Price ({symbol} {currency.name.toUpperCase()})
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr key={idx}>
                  <td>{new Date(tx.timestamp).toLocaleString()}</td>
                  <td>
                    {tx.coinName} ({tx.coinSymbol.toUpperCase()})
                  </td>
                  <td>{tx.amount}</td>
                  <td>
                    {symbol}{" "}
                    {(tx.price * rate).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
