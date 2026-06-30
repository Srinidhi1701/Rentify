import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getListings } from "../services/api";
import { useAuth } from "../context/AuthContext";

const RentPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [bhk, setBhk] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = { type: "rent" };
      if (city) params.city = city;
      if (bhk) params.bhk = bhk;

      const { data } = await getListings(params);
      console.log("Listings:", data);
      setListings(data.filter((l) => l.isAvailable));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleCardClick = (id) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    navigate(`/listing/${id}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Available Properties for Rent</h1>
        <p style={styles.subtitle}>
          {listings.length} {listings.length === 1 ? "property" : "properties"} available
        </p>
      </div>

      <form style={styles.filterBar} onSubmit={handleSearch}>
        <input
          style={styles.filterInput}
          type="text"
          placeholder="Search by city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <select
          style={styles.filterInput}
          value={bhk}
          onChange={(e) => setBhk(e.target.value)}
        >
          <option value="">Any BHK</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4+ BHK</option>
        </select>
        <button type="submit" style={styles.searchBtn}>
          Search
        </button>
      </form>

      {loading ? (
        <p style={styles.emptyText}>Loading properties...</p>
      ) : listings.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={{ fontSize: "48px" }}>🏠</span>
          <p style={styles.emptyText}>No properties available right now</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {listings.map((listing) => (
            <div
              key={listing._id}
              style={styles.card}
              onClick={() => handleCardClick(listing._id)}
            >
              <div style={styles.imagePlaceholder}>
                {listing.images?.[0] ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    style={styles.image}
                  />
                ) : (
                  <span style={{ fontSize: "32px" }}>🏠</span>
                )}
              </div>
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{listing.title}</h3>
                <p style={styles.cardLocation}>
                  📍 {listing.location?.area}, {listing.location?.city}
                </p>
                <div style={styles.cardMeta}>
                  <span>{listing.bhk} BHK</span>
                  <span>•</span>
                  <span>{listing.area_sqft} sqft</span>
                  <span>•</span>
                  <span style={{ textTransform: "capitalize" }}>
                    {listing.furnished}
                  </span>
                </div>
                <div style={styles.cardFooter}>
                  <span style={styles.price}>₹{listing.price?.toLocaleString()}/mo</span>
                  <span style={styles.likes}>❤️ {listing.likes?.length || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showLoginPrompt && (
        <div style={styles.modalOverlay} onClick={() => setShowLoginPrompt(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <span style={styles.modalIcon}>🔒</span>
            <h2 style={styles.modalTitle}>Login to view more details</h2>
            <p style={styles.modalText}>
              Create a free account to see full property details, contact owners, and save your favourites.
            </p>
            <div style={styles.modalActions}>
              <Link to="/login" style={styles.modalLoginBtn}>
                Login
              </Link>
              <Link to="/register" style={styles.modalRegisterBtn}>
                Register
              </Link>
            </div>
            <button
              style={styles.modalClose}
              onClick={() => setShowLoginPrompt(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#0f0f1a",
    minHeight: "100vh",
    padding: "40px",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    color: "#E8DCC8",
    fontSize: "32px",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#aaa",
    fontSize: "14px",
  },
  filterBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "32px",
    flexWrap: "wrap",
  },
  filterInput: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "#1a1a2e",
    color: "white",
    fontSize: "14px",
    minWidth: "180px",
  },
  searchBtn: {
    padding: "12px 24px",
    backgroundColor: "#e94560",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: "12px",
    overflow: "hidden",
    color: "white",
    transition: "transform 0.2s ease",
    cursor: "pointer",
  },
  imagePlaceholder: {
    height: "180px",
    backgroundColor: "#252538",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardBody: {
    padding: "16px",
  },
  cardTitle: {
    fontSize: "16px",
    marginBottom: "6px",
    color: "#E8DCC8",
  },
  cardLocation: {
    fontSize: "13px",
    color: "#aaa",
    marginBottom: "10px",
  },
  cardMeta: {
    display: "flex",
    gap: "6px",
    fontSize: "12px",
    color: "#888",
    marginBottom: "14px",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    color: "#e94560",
    fontWeight: "bold",
    fontSize: "16px",
  },
  likes: {
    fontSize: "13px",
    color: "#aaa",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
  },
  emptyText: {
    color: "#aaa",
    fontSize: "16px",
    marginTop: "12px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: "#1a1a2e",
    padding: "40px",
    borderRadius: "16px",
    maxWidth: "380px",
    width: "90%",
    textAlign: "center",
    position: "relative",
  },
  modalIcon: {
    fontSize: "36px",
  },
  modalTitle: {
    color: "#E8DCC8",
    fontSize: "20px",
    margin: "12px 0 8px",
  },
  modalText: {
    color: "#aaa",
    fontSize: "14px",
    marginBottom: "24px",
    lineHeight: "1.5",
  },
  modalActions: {
    display: "flex",
    gap: "12px",
  },
  modalLoginBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#e94560",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "bold",
  },
  modalRegisterBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "transparent",
    border: "1px solid #e94560",
    color: "#e94560",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "bold",
  },
  modalClose: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "none",
    border: "none",
    color: "#aaa",
    fontSize: "18px",
    cursor: "pointer",
  },
};

export default RentPage;