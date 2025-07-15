import "./Pricing.css";

const Pricing = () => {
  return (
    <div className="page-container">
      <h1>Simple, Transparent Pricing</h1>
      <p style={{ margin: "1rem 0" }}>
        CreepTo is completely free and always will be for core features. Whether
        you're a casual crypto enthusiast or an active trader, we deliver
        powerful tracking tools at no cost.
      </p>
      <h2>Current Plan</h2>
      <ul>
        <li>
          <strong>Free Forever</strong>: Access real-time prices, charts and
          coin information without subscription.
        </li>
        <li>
          <strong>Watchlist</strong>: Track up to 50 favorite coins.
        </li>
        <li>
          <strong>Full Access</strong>: Use all features including buy
          simultations without limitations.
        </li>
      </ul>

      <h2 style={{ marginTop: "2rem" }}>Coming Soon...</h2>
      <ul>
        <li>
          <strong>Pro Plan</strong>: Deeper analytics, portfolio syncing, and
          real-time alerts.
        </li>
        <li>
          <strong>Premium Insights</strong>: Exclusive reports and early access
          to new features.
        </li>
      </ul>
    </div>
  );
};

export default Pricing;
