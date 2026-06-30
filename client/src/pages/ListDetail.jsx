import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getListingById, toggleLike, trackContact } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ListingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [contacted, setContacted] = useState(false);
  const [contactedCount, setContactedCount] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchListing();
  }, [id, user]);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const { data } = await getListingById(id);
      setListing(data);
      setLikesCount(data.likes?.length || 0);
      setLiked(data.likes?.includes(user._id));
      setContactedCount(data.contactedBy?.length || 0);
      setContacted(data.contactedBy?.includes(user._id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await toggleLike(id);
      setLikesCount(data.likes);
      setLiked(data.liked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleContact = async () => {
    try {
      const { data } = await trackContact(id);
      setContactedCount(data.contactedCount);
      setContacted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;
  if (loading) return <p style={styles.loadingText}>Loading...</p>;
  if (!listing) return <p style={styles.loadingText}>Listing not found</p>;

  const isOwner = listing.owner?._id === user._id;

  return (
    <div style={styles.container}>
      <Link to={listing.type === "rent" ? "/rent" : "/sell"} style={styles.backLink}>
        ← Back to {listing.type === "rent" ? "Rentals" : "Listings"}
      </Link>

      <div style={styles.content}>
        <div style={styles.imageWrapper}>
          {listing.images?.[0] ? (
            <img src={listing.images[0]} alt={listing.title} style={styles.image} />
          ) : (
            <div style={styles.imagePlaceholder}>
              <span style={{ fontSize: "48px" }}>🏠</span>
            </div>
          )}
        </div>

        <div style={styles.details}>
          <div style={styles.titleRow}>
            <h1 style={styles.title}>{listing.title}</h1>
            <span style={styles.typeBadge}>
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </span>
          </div>

          <p style={styles.location}>
            📍 {listing.location?.area}, {listing.location?.city} - {listing.location?.pincode}
          </p>

          <p style={styles.price}>
            ₹{listing.price?.toLocaleString()}
            {listing.type === "rent" && <span style={styles.perMonth}>/month</span>}
          </p>

          <div style={styles.metaGrid}>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>BHK</span>
              <span style={styles.metaValue}>{listing.bhk}</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Area</span>
              <span style={styles.metaValue}>{listing.area_sqft} sqft</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Furnished</span>
              <span style={{ ...styles.metaValue, textTransform: "capitalize" }}>
                {listing.furnished}
              </span>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>Description</h3>
          <p style={styles.description}>{listing.description}</p>

          <h3 style={styles.sectionTitle}>Owner</h3>
          <div style={styles.ownerCard}>
          <p style={styles.ownerText}>👤<strong> {listing.owner?.name}</strong></p>
          {contacted || isOwner ? (
    <>
      <p style={styles.ownerText}>📧 {listing.owner?.email}</p>
      <p style={styles.ownerText}>📞 {listing.owner?.phone}</p>
    </>
  ) : (
    <>
      <p style={styles.hiddenText}>📧 Hidden until you contact the owner</p>
      <p style={styles.hiddenText}>📞 Hidden until you contact the owner</p>
    </>
  )}
  </div>

         <div style={styles.actions}>
  <button
    style={{
      ...styles.likeBtn,
      ...(liked ? styles.likeBtnActive : {}),
      ...(isOwner ? styles.disabledBtn : {}),
    }}
    onClick={handleLike}
    disabled={isOwner}
  >
    {liked ? "❤️" : "🤍"} {likesCount} {likesCount === 1 ? "Like" : "Likes"}
  </button>

  <button
    style={{
      ...styles.contactBtn,
      ...(contacted ? styles.contactBtnActive : {}),
      ...(isOwner ? styles.disabledBtn : {}),
    }}
    onClick={handleContact}
    disabled={contacted || isOwner}
  >
    {isOwner
      ? "Your Listing"
      : contacted
      ? "✓ Owner Contacted"
      : "💬 Contact Owner"}
  </button>
</div>
         

          {isOwner && (
            <div style={styles.ownerStats}>
              <p style={styles.ownerStatsTitle}>This is your listing</p>
              <div style={styles.statsRow}>
                <span>❤️ {likesCount} likes</span>
                <span>💬 {contactedCount} contacted</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: "#0f0f1a", minHeight: "100vh", padding: "40px" },
  loadingText: { color: "#aaa", textAlign: "center", padding: "100px" },
  backLink: { color: "#aaa", textDecoration: "none", fontSize: "14px", display: "inline-block", marginBottom: "24px" },
  content: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", maxWidth: "1100px", margin: "0 auto" },
  imageWrapper: { borderRadius: "16px", overflow: "hidden", height: "420px" },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  imagePlaceholder: { width: "100%", height: "100%", backgroundColor: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" },
  details: { color: "#E8DCC8" },
  titleRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" },
  title: { fontSize: "28px", marginBottom: "8px" },
  typeBadge: { backgroundColor: "#252538", color: "#e94560", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", whiteSpace: "nowrap" },
  location: { color: "#aaa", fontSize: "14px", marginBottom: "16px" },
  price: { fontSize: "32px", fontWeight: "bold", color: "#e94560", marginBottom: "24px" },
  perMonth: { fontSize: "16px", color: "#aaa", fontWeight: "normal" },
  metaGrid: { display: "flex", gap: "24px", marginBottom: "28px", paddingBottom: "24px", borderBottom: "1px solid #252538" },
  metaItem: { display: "flex", flexDirection: "column", gap: "4px" },
  metaLabel: { fontSize: "12px", color: "#888" },
  metaValue: { fontSize: "16px", fontWeight: "bold" },
  sectionTitle: { fontSize: "16px", marginBottom: "8px", marginTop: "20px" },
  description: { color: "#aaa", fontSize: "14px", lineHeight: "1.6" },
  ownerText: { color: "#aaa", fontSize: "14px" },
  actions: { display: "flex", gap: "12px", marginTop: "32px" },
  likeBtn: { padding: "14px 20px", backgroundColor: "#1a1a2e", border: "1px solid #333", color: "#E8DCC8", borderRadius: "8px", fontSize: "14px", cursor: "pointer" },
  likeBtnActive: { borderColor: "#e94560" },
  contactBtn: { flex: 1, padding: "14px 20px", backgroundColor: "#e94560", border: "none", color: "white", borderRadius: "8px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" },
  contactBtnActive: { backgroundColor: "#252538", color: "#A8B5A0", cursor: "default" },
  contactInfo: { marginTop: "20px", padding: "16px", backgroundColor: "#1a1a2e", borderRadius: "8px" },
  contactLabel: { fontSize: "13px", color: "#aaa", marginBottom: "8px" },
  contactDetail: { fontSize: "14px", marginBottom: "4px" },
  ownerStats: { marginTop: "32px", padding: "20px", backgroundColor: "#1a1a2e", borderRadius: "8px" },
  ownerStatsTitle: { fontSize: "14px", color: "#aaa", marginBottom: "12px" },
  statsRow: { display: "flex", gap: "20px", fontSize: "14px" },

  ownerCard: {
   backgroundColor: "#1a1a2e",
  padding: "16px",
  borderRadius: "10px",
  marginTop: "10px",
  marginBottom: "24px",
},

hiddenText: {
  color: "#777",
  fontSize: "13px",
  fontStyle: "italic",
  marginTop: "6px",
},

disabledBtn: {
  opacity: 0.6,
  cursor: "not-allowed",
},
};

export default ListingDetail;