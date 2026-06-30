import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["rent", "sell"],
      required: true,
    },
    images: [
      {
        type:String,
      },
    ],
    location: {
      city: String,
      area: String,
      pincode: String,
    },
    bhk: {
      type: Number,
    },
    furnished: {
      type: String,
      enum: ["furnished", "semi-furnished", "unfurnished"],
    },
    area_sqft: {
      type: Number,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    contactedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);