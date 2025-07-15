import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import "./TransactionHistory.css";

const TransactionHistory = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      const docRef = doc(db, "transactions", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const list = Object.values(data.history || {});

        const sorted = list.sort((a, b) => b.timestamp - a.timestamp);
        setTransactions(sorted);
      }
    };

    fetchTransactions();
  }, [user]);

  if (transactions.length === 0) {
    return <p className="no-transactions">No transactions found.</p>;
  }

  return (
    <div className="transaction-history">
      <h2>📄 Transaction History</h2>
      <div className="transaction-list">
        {transactions.map((tx, index) => (
          <div className="transaction-card" key={index}>
            <div>
              <strong>Coin:</strong> {tx.coinName} (
              {tx.coinSymbol.toUpperCase()})
            </div>
            <div>
              <strong>Amount:</strong> {tx.amount}
            </div>
            <div>
              <strong>Price at Purchase:</strong> {tx.price} {tx.currency}
            </div>
            <div>
              <strong>Date:</strong> {new Date(tx.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
