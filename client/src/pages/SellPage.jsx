import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyListings, deleteListing } from "../services/api";
import { useAuth } from "../context/AuthContext";

const SellPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyListings = async () => {
  setLoading(true);
  try {
    const { data } = await getMyListings();
    setListings(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMyListings();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await deleteListing(id);
      setListings(listings.filter((l) => l._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Your Listings</h1>
          <p style={styles.subtitle}>
            {listings.length} {listings.length === 1 ? "property" : "properties"}  you've posted
          </p>
        </div>
        <Link to="/post" style={styles.postBtn}>
          + Post New Listing
        </Link>
      </div>

      {loading ? (
        <p style={styles.emptyText}>Loading your listings...</p>
      ) : listings.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={{ fontSize: "48px" }}>🏷️</span>
          <p style={styles.emptyText}>You haven't posted any properties yet</p>
          <Link to="/post" style={styles.postBtn}>
            Post Your First Listing
          </Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {listings.map((listing) => (
            <div key={listing._id} style={styles.card}>
              <Link to={`/listing/${listing._id}`} style={styles.cardLink}>
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
                  <span style={styles.price}>
                    ₹{listing.price?.toLocaleString()}
                  </span>
                </div>
              </Link>

              {/* Stats row */}
              <div style={styles.statsRow}>
                <span style={styles.stat}>❤️ {listing.likes?.length || 0} likes</span>
                <span style={styles.stat}>
                  💬 {listing.contactedBy?.length || 0} contacted
                </span>
              </div>

              <div style={styles.actionsRow}>
                <Link to={`/listing/${listing._id}`} style={styles.viewBtn}>
                  View / Messages
                </Link>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(listing._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px",
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
  postBtn: {
    backgroundColor: "#e94560",
    color: "white",
    padding: "12px 22px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
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
  },
  cardLink: {
    textDecoration: "none",
    color: "white",
    display: "block",
  },
  imagePlaceholder: {
    height: "160px",
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
    padding: "16px 16px 0",
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
  price: {
    color: "#e94560",
    fontWeight: "bold",
    fontSize: "16px",
  },
  statsRow: {
    display: "flex",
    gap: "16px",
    padding: "12px 16px",
    fontSize: "13px",
    color: "#aaa",
    borderTop: "1px solid #252538",
    marginTop: "12px",
  },
  actionsRow: {
    display: "flex",
    gap: "10px",
    padding: "0 16px 16px",
  },
  viewBtn: {
    flex: 1,
    textAlign: "center",
    padding: "10px",
    backgroundColor: "#252538",
    color: "#E8DCC8",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "13px",
  },
  deleteBtn: {
    padding: "10px 16px",
    backgroundColor: "transparent",
    border: "1px solid #e94560",
    color: "#e94560",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
  },
  emptyText: {
    color: "#aaa",
    fontSize: "16px",
    marginTop: "12px",
    marginBottom: "20px",
  },
};

export default SellPage;