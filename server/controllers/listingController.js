import Listing from "../models/Listing.js";

// @route GET /api/listings
export const getListings = async (req, res) => {
  try {
    const { type, city, bhk, furnished, minPrice, maxPrice } = req.query;

    let filter = {};

    if (type) filter.type = type;
    if (city) filter["location.city"] = new RegExp(city, "i");
    if (bhk) filter.bhk = Number(bhk);
    if (furnished) filter.furnished = furnished;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(filter)
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({
      owner: req.user._id,
    })
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/listings/:id
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "owner",
      "name email phone"
    );
    if (!listing)
      return res.status(404).json({ message: "Listing not found" });

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/listings
export const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      type,
      location,
      bhk,
      furnished,
      area_sqft,
      images,
    } = req.body;

    const listing = await Listing.create({
      title,
      description,
      price,
      type,
      location,
      bhk,
      furnished,
      area_sqft,
      images,
      owner: req.user._id,
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/listings/:id
export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing)
      return res.status(404).json({ message: "Listing not found" });

    if (listing.owner.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/listings/:id
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing)
      return res.status(404).json({ message: "Listing not found" });

    if (listing.owner.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    await listing.deleteOne();
    res.json({ message: "Listing removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/listings/:id/like
export const toggleLike = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing)
      return res.status(404).json({ message: "Listing not found" });

    const alreadyLiked = listing.likes.includes(req.user._id);

    if (alreadyLiked) {
      listing.likes = listing.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      listing.likes.push(req.user._id);
    }

    await listing.save();
    res.json({ likes: listing.likes.length, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/listings/:id/contact
export const trackContact = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing)
      return res.status(404).json({ message: "Listing not found" });

    const alreadyContacted = listing.contactedBy.includes(req.user._id);

    if (!alreadyContacted) {
      listing.contactedBy.push(req.user._id);
      await listing.save();
    }

    res.json({ contactedCount: listing.contactedBy.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};