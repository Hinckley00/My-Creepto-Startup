import { useEffect, useState } from "react";
import "./Blog.css";

const Blog = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/status_updates");
        const data = await res.json();
        setNews(data.status_updates);
      } catch (err) {
        console.error("Failed to fetch updates:", err);
      }
    };

    fetchUpdates();
    const interval = setInterval(fetchUpdates, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container">
      <h1>Crypto Insights & Market News</h1>
      <p style={{ marginBottom: "2rem" }}>
        Stay informed with expert commentary, strategy tips, and the latest
        market trends. Our blog delivers insights for beginners and seasoned
        investors alike.
      </p>

      <article style={{ marginBottom: "2rem" }}>
        <h2>📈 Bitcoin Hits $100k: What It Means for the Market</h2>
        <p>
          Bitcoin recently crossed the $100,000 mark, setting a new all-time
          high. Learn what's fueling the surge and how it impacts altcoins and
          investor sentiment.
        </p>
      </article>

      <article style={{ marginBottom: "2rem" }}>
        <h2>🔐 5 Security Tips for Managing Your Crypto Portfolio</h2>
        <p>
          As crypto adoption grows, so does the need for security. Discover
          practical tips to safeguard your digital assets and stay protected
          from scams and vulnerabilities.
        </p>
      </article>

      <article style={{ marginBottom: "2rem" }}>
        <h2>🧠 How to Read Crypto Charts Like a Pro</h2>
        <p>
          Understanding price movements is key to making smart trades. This
          guide breaks down candlesticks, volume trends, and technical
          indicators in a beginner-friendly format.
        </p>
      </article>

      <h2 style={{ marginTop: "3rem" }}>🔴 Live Crypto Status Updates</h2>
      {!news || news.length === 0 ? (
        <p>Loading live updates...</p>
      ) : (
        <ul className="live-updates">
          {news.slice(0, 5).map((update, index) => (
            <li key={index} style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {update.project?.image?.small && (
                  <img
                    src={update.project.image.small}
                    alt={update.project.name}
                    width="30"
                    height="30"
                    style={{ borderRadius: "50%" }}
                  />
                )}
                <strong>{update.project?.name || "Unknown Project"}:</strong>
              </div>
              <p style={{ marginTop: "5px" }}>{update.description}</p>
              <small style={{ color: "#999" }}>
                {new Date(update.created_at).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Blog;
