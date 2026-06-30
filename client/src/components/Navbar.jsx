import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        🏠 Rentify
      </Link>

      <div style={styles.links}>
        <Link to="/rent" className="nav-link">
          Rent
        </Link>
        <Link to="/sell" className="nav-link">
          Sell
        </Link>

        {user ? (
          <>
            <span style={styles.username}>Hi, {user.name}</span>
            <button onClick={handleLogout} className="nav-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-btn">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px",
    backgroundColor: "#1a1a2e",
    color: "white",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#E8DCC8",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  username: {
    color: "#E8DCC8",
    fontSize: "14px",
  },
};

export default Navbar;