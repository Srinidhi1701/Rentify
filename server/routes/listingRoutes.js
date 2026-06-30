import express from "express";
import {
  getListings,
  getMyListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  toggleLike,
  trackContact,
} from "../controllers/listingController.js";
import protect from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getListings);
router.get("/my", protect, getMyListings);
router.get("/:id", getListingById);
router.post("/", protect, createListing);
router.put("/:id", protect, updateListing);
router.delete("/:id", protect, deleteListing);
router.put("/:id/like", protect, toggleLike);
router.put("/:id/contact", protect, trackContact);

export default router;