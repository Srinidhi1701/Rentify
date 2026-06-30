import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach token to every request
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("rentifyUser"));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// Listings
export const getListings = (params) => API.get("/listings", { params });
export const getMyListings = () => API.get("/listings/my");
export const getListingById = (id) => API.get(`/listings/${id}`);
export const createListing = (data) => API.post("/listings", data);
export const updateListing = (id, data) => API.put(`/listings/${id}`, data);
export const deleteListing = (id) => API.delete(`/listings/${id}`);
export const toggleLike = (id) => API.put(`/listings/${id}/like`);
export const trackContact = (id) => API.put(`/listings/${id}/contact`);