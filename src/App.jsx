import React from "react";
import Home from "./pages/Home/Home";
import Coin from "./pages/Coin/Coin";
import TransactionHistory from "./pages/Transactions/TransactionHistory";
import Watchlist from "./components/Watchlist/Watchlist";
// import Footer from "./components/Footer/Footer";

const App = () => {
  return (
    <div className="app">
      <Home />
      {/* <Route path="/transactions" element={<TransactionHistory />} /> */}
      {/* <Route path="/watchlist" element={<Watchlist />} /> */}
    </div>
  );
};

export default App;
