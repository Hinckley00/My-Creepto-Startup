import { useEffect, useState, useRef } from "react";
import "./Blog.css";

const DEMO_UPDATE = {
  project: {
    name: "Demo Project",
    image: { small: "bitcoin-logo.png" },
  },
  description:
    "Welcome to CreepTo! Live updates will appear here when available.",
  created_at: new Date().toISOString(),
};

const Blog = () => {
  const [news, setNews] = useState(null); // null = loading, [] = no data
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/status_updates"
        );

        // Handle rate limits or failure
        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }

        const data = await res.json();
        console.log("Live Update Response:", data);

        if (
          Array.isArray(data.status_updates) &&
          data.status_updates.length > 0
        ) {
          setNews(data.status_updates);
          setError("");
        } else {
          setNews([]);
          setError("No updates available.");
        }
      } catch (err) {
        console.error("Failed to fetch live updates:", err);
        setError("Failed to fetch live updates. Showing demo update.");
        setNews([]);
      }
    };

    fetchUpdates();
    const interval = setInterval(fetchUpdates, 5 * 60 * 1000); // Refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  // Carousel effect for live updates
  useEffect(() => {
    if (!news || news.length === 0) return;

    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % Math.min(news.length, 10));
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [news]);

  // Prepare content to show
  let updateContent;
  if (news === null) {
    updateContent = <p>Loading live updates...</p>;
  } else if (news.length === 0) {
    updateContent = (
      <>
        {error && (
          <div style={{ color: "#ffb3b3", marginBottom: 10 }}>{error}</div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 12,
          }}
        >
          <img
            src={DEMO_UPDATE.project.image.small}
            alt="Demo"
            width="40"
            height="40"
            style={{ borderRadius: "50%", boxShadow: "0 2px 8px #0002" }}
          />
          <strong style={{ fontSize: 18 }}>{DEMO_UPDATE.project.name}</strong>
        </div>
        <p style={{ margin: "8px 0", fontSize: 16 }}>
          {DEMO_UPDATE.description}
        </p>
        <small style={{ color: "#999" }}>
          {new Date(DEMO_UPDATE.created_at).toLocaleString()}
        </small>
      </>
    );
  } else {
    const update = news[current];
    updateContent = (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 12,
          }}
        >
          {update.project?.image?.small && (
            <img
              src={update.project.image.small}
              alt={update.project.name}
              width="40"
              height="40"
              style={{ borderRadius: "50%", boxShadow: "0 2px 8px #0002" }}
            />
          )}
          <strong style={{ fontSize: 18 }}>
            {update.project?.name || "Unknown Project"}
          </strong>
        </div>
        <p style={{ margin: "8px 0", fontSize: 16 }}>{update.description}</p>
        <small style={{ color: "#999" }}>
          {new Date(update.created_at).toLocaleString()}
        </small>
      </>
    );
  }

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
      <div
        className="live-update-carousel"
        style={{
          minHeight: 120,
          margin: "2rem auto",
          maxWidth: 500,
          background: "rgba(0,0,0,0.15)",
          borderRadius: 16,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {updateContent}
      </div>
    </div>
  );
};

export default Blog;
