import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createListing } from "../services/api";
import { useAuth } from "../context/AuthContext";

const PostListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "rent",
    bhk: "",
    furnished: "unfurnished",
    area_sqft: "",
    location: { city: "", area: "", pincode: "" },
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(""); 

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (e) => {
    setForm({
      ...form,
      location: { ...form.location, [e.target.name]: e.target.value },
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let imageUrl = "";

  if (image) {
    const formData = new FormData();

    formData.append("file", image);

    formData.append(
      "upload_preset",
      "rentify"
    );

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/embl8eyq/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    imageUrl = data.secure_url;
  }

  await createListing({
    ...form,
    images: imageUrl ? [imageUrl] : [],
  });

  navigate("/rent");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Post a Property 🏠</h2>
        <p style={styles.subtitle}>Fill in the details below</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          

          <input
            style={styles.input}
            type="text"
            name="title"
            placeholder="Title (e.g. 2BHK in Anna Nagar)"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            style={{ ...styles.input, height: "100px", resize: "vertical" }}
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          />
          <div style={styles.uploadContainer}>
  <label htmlFor="imageUpload" style={styles.uploadBox}>
    {preview ? (
      <img
        src={preview}
        alt="Preview"
        style={styles.previewImage}
      />
    ) : (
      <>
        <div style={styles.uploadIcon}>🏡</div>
        <p style={styles.uploadTitle}>Upload Property Image</p>
        <p style={styles.uploadText}>
          Click here to choose an image
        </p>
        <span style={styles.uploadSubText}>
          JPG • PNG • WEBP
        </span>
      </>
    )}
  </label>

  <input
    id="imageUpload"
    type="file"
    accept="image/*"
    style={{ display: "none" }}
    onChange={(e) => {
      if (e.target.files[0]) {
        setImage(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
      }
    }}
  />

  {preview && (
    <button
      type="button"
      style={styles.changeImageBtn}
      onClick={() => document.getElementById("imageUpload").click()}
    >
      Change Image
    </button>
  )}
</div>
          <input
            style={styles.input}
            type="number"
            name="price"
            placeholder="Monthly Rent (₹)"
            value={form.price}
            onChange={handleChange}
            required
          />

          {/* Location */}
          <input
            style={styles.input}
            type="text"
            name="city"
            placeholder="City"
            value={form.location.city}
            onChange={handleLocationChange}
          />
          <input
            style={styles.input}
            type="text"
            name="area"
            placeholder="Area / Locality"
            value={form.location.area}
            onChange={handleLocationChange}
          />
          <input
            style={styles.input}
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={form.location.pincode}
            onChange={handleLocationChange}
          />

          {/* Details */}
          <input
            style={styles.input}
            type="number"
            name="bhk"
            placeholder="BHK (e.g. 2)"
            value={form.bhk}
            onChange={handleChange}
          />
          <select
            style={styles.input}
            name="furnished"
            value={form.furnished}
            onChange={handleChange}
          >
            <option value="unfurnished">Unfurnished</option>
            <option value="semi-furnished">Semi Furnished</option>
            <option value="furnished">Furnished</option>
          </select>
          <input
            style={styles.input}
            type="number"
            name="area_sqft"
            placeholder="Area in sqft"
            value={form.area_sqft}
            onChange={handleChange}
          />

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post Listing"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f0f1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  card: {
    backgroundColor: "#1a1a2e",
    padding: "40px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "500px",
  },
  title: {
    color: "white",
    fontSize: "24px",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#aaa",
    marginBottom: "24px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "16px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "#0f0f1a",
    color: "white",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  toggleGroup: {
    display: "flex",
    marginBottom: "20px",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #333",
  },
  btn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#e94560",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "#e94560",
    marginBottom: "16px",
    fontSize: "14px",
  },
  uploadContainer: {
  marginBottom: "20px",
},

uploadBox: {
  width: "100%",
  height: "230px",
  border: "2px dashed #555",
  borderRadius: "12px",
  backgroundColor: "#0f0f1a",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  transition: "0.3s",
  overflow: "hidden",
  boxSizing: "border-box",
  boxShadow: "0 0 10px rgba(233,69,96,0.08)",
},

uploadIcon: {
  fontSize: "46px",
  marginBottom: "12px",
},

uploadTitle: {
  color: "#E8DCC8",
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "6px",
},

uploadText: {
  color: "#aaa",
  fontSize: "14px",
  marginBottom: "4px",
},

uploadSubText: {
  color: "#666",
  fontSize: "12px",
},

previewImage: {
  width: "100%",
  height: "100%",
  objectFit: "cover",
},

changeImageBtn: {
  marginTop: "12px",
  width: "100%",
  padding: "12px",
  backgroundColor: "#252538",
  color: "#E8DCC8",
  border: "1px solid #333",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
},
};

export default PostListing;