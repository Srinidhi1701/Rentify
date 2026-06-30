import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RentPage from "./pages/RentPage";
import SellPage from "./pages/SellPage";
import ListingDetail from "./pages/ListDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostListing from "./pages/PostListing";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rent" element={<RentPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post" element={<PostListing />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;