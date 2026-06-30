import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [mode, setMode] = useState("rent");
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate(mode === "rent" ? "/rent" : "/sell");
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Find Your Perfect Home 🏠</h1>
        <h2 style={styles.title}>Hassle free, Quick and Honest</h2>
        <p style={styles.subtitle}>
          Browse thousands of properties to rent or buy across India
        </p>

        {/* Toggle Switch */}
        <div style={styles.toggleWrapper}>
          <span style={{ ...styles.label, color: mode === "rent" ? "#e94560" : " #E8DCC8" }}>
            Rent
          </span>
          <div style={styles.switchTrack} onClick={() => setMode(mode === "rent" ? "sell" : "rent")}>
            <div style={{
              ...styles.switchThumb,
              transform: mode === "sell" ? "translateX(28px)" : "translateX(2px)",
            }} />
          </div>
          <span style={{ ...styles.label, color: mode === "sell" ? "#e94560" : "#E8DCC8" }}>
            Sell
          </span>
        </div>

        {/* Mode description */}
        <p style={styles.modeText}>
          {mode === "rent"
            ? "🔍 Browse available rental properties"
            : "🏷️ List your property for sale"}
        </p>

        <button style={styles.primaryBtn} onClick={handleExplore}>
          {mode === "rent" ? "Browse Rentals →" : "Go to Sell →"}
        </button>
      </div>

      {/* Features */}
      <div style={styles.features}>
        <div style={styles.featureCard}>
          <span style={styles.icon}>🔍</span>
          <h3 style={styles.featureTitle}>Search & Filter</h3>
          <p style={styles.featureText}>Find homes by city, BHK, price and more</p>
        </div>
        <div style={styles.featureCard}>
          <span style={styles.icon}>❤️</span>
          <h3 style={styles.featureTitle}>Save Favourites</h3>
          <p style={styles.featureText}>Like properties and revisit them anytime</p>
        </div>
        <div style={styles.featureCard}>
          <span style={styles.icon}>💬</span>
          <h3 style={styles.featureTitle}>Contact Owner</h3>
          <p style={styles.featureText}>Message owners directly from the listing</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#0f0f1a",
    minHeight: "100vh",
    color: "#E8DCC8",
  },
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "100px 20px 60px",
    textAlign: "center",
    color: "#E8DCC8",
  },
  title: {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "16px",

  },
  subtitle: {
    fontSize: "18px",
    color: "#aaa",
    marginBottom: "40px",
    maxWidth: "500px",
     color: "#E8DCC8",
  },
  toggleWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },
  label: {
    fontSize: "18px",
    fontWeight: "bold",
    transition: "color 0.3s",
  },
  switchTrack: {
    width: "60px",
    height: "30px",
    backgroundColor: "#e94560",
    borderRadius: "15px",
    cursor: "pointer",
    position: "relative",
    transition: "background 0.3s",
  },
  switchThumb: {
    position: "absolute",
    top: "3px",
    width: "24px",
    height: "24px",
    backgroundColor: "white",
    borderRadius: "50%",
    transition: "transform 0.3s ease",
  },
  modeText: {
     color: "#E8DCC8",
    fontSize: "15px",
    marginBottom: "30px",
  },
  primaryBtn: {
    backgroundColor: "#e94560",
    color: "white",
    padding: "14px 40px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  features: {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    padding: "60px 40px",
    flexWrap: "wrap",
  },
  featureCard: {
    backgroundColor: "#1a1a2e",
    padding: "32px",
    borderRadius: "12px",
    textAlign: "center",
    width: "250px",
  },
  icon: {
    fontSize: "40px",
  },
  featureTitle: {
    fontSize: "18px",
    margin: "12px 0 8px",
  },
  featureText: {
     color: "#E8DCC8",
    fontSize: "14px",
  },

};

export default Home;