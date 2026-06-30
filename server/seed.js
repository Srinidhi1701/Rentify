import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Listing from "./models/Listing.js";
import User from "./models/User.js";

dotenv.config();

const dummyOwners = [
  { name: "Karthik Raja", email: "karthik.raja@example.com", phone: "9840012345" },
  { name: "Divya Shree", email: "divya.shree@example.com", phone: "9941123456" },
  { name: "Arun Prakash", email: "arun.prakash@example.com", phone: "9080034567" },
];

const dummyListings = [
  {
    title: "2BHK Apartment in Anna Nagar",
    description: "Spacious 2BHK with parking, gym access and 24/7 security.",
    price: 18000,
    type: "rent",
    images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"],
    location: { city: "Chennai", area: "Anna Nagar", pincode: "600040" },
    bhk: 2, furnished: "semi-furnished", area_sqft: 1100, isAvailable: true,
  },
  {
    title: "Cozy 1BHK near OMR",
    description: "Perfect for working professionals, close to IT corridor.",
    price: 12000,
    type: "rent",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
    location: { city: "Chennai", area: "OMR", pincode: "600096" },
    bhk: 1, furnished: "furnished", area_sqft: 650, isAvailable: true,
  },
  {
    title: "3BHK Independent House in Velachery",
    description: "Family friendly locality, near schools and hospitals.",
    price: 25000,
    type: "rent",
    images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"],
    location: { city: "Chennai", area: "Velachery", pincode: "600042" },
    bhk: 3, furnished: "unfurnished", area_sqft: 1500, isAvailable: true,
  },
  {
    title: "Studio Apartment in T Nagar",
    description: "Compact and modern, walking distance to shopping district.",
    price: 9500,
    type: "rent",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
    location: { city: "Chennai", area: "T Nagar", pincode: "600017" },
    bhk: 1, furnished: "furnished", area_sqft: 450, isAvailable: true,
  },
  {
    title: "2BHK Gated Community in Porur",
    description: "Clubhouse, pool and kids play area included.",
    price: 16500,
    type: "rent",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    location: { city: "Chennai", area: "Porur", pincode: "600116" },
    bhk: 2, furnished: "semi-furnished", area_sqft: 1050, isAvailable: true,
  },
  {
    title: "4BHK Luxury Villa in ECR",
    description: "Sea facing villa with private garden and parking for 2 cars.",
    price: 45000,
    type: "rent",
    images: ["https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800"],
    location: { city: "Chennai", area: "ECR", pincode: "600119" },
    bhk: 4, furnished: "furnished", area_sqft: 2400, isAvailable: true,
  },
  {
    title: "1BHK Budget Stay in Adyar",
    description: "Compact and pocket-friendly, ideal for students and bachelors.",
    price: 8500,
    type: "rent",
    images: ["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"],
    location: { city: "Chennai", area: "Adyar", pincode: "600020" },
    bhk: 1, furnished: "unfurnished", area_sqft: 500, isAvailable: true,
  },
  {
    title: "3BHK Sea View Flat in Besant Nagar",
    description: "Top floor flat with balcony overlooking the beach road.",
    price: 32000,
    type: "rent",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
    location: { city: "Chennai", area: "Besant Nagar", pincode: "600090" },
    bhk: 3, furnished: "furnished", area_sqft: 1700, isAvailable: true,
  },
  {
    title: "2BHK Modern Flat in Sholinganallur",
    description: "Newly built complex with covered parking and lift access.",
    price: 17500,
    type: "rent",
    images: ["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"],
    location: { city: "Chennai", area: "Sholinganallur", pincode: "600119" },
    bhk: 2, furnished: "semi-furnished", area_sqft: 1000, isAvailable: true,
  },
  {
    title: "Spacious 4BHK Duplex in Mylapore",
    description: "Heritage area, traditional layout with modern interiors.",
    price: 38000,
    type: "rent",
    images: ["https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800"],
    location: { city: "Chennai", area: "Mylapore", pincode: "600004" },
    bhk: 4, furnished: "furnished", area_sqft: 2100, isAvailable: true,
  },
  {
    title: "1BHK Cozy Flat in Tambaram",
    description: "Quiet residential area, close to railway station.",
    price: 7000,
    type: "rent",
    images: ["https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800"],
    location: { city: "Chennai", area: "Tambaram", pincode: "600045" },
    bhk: 1, furnished: "semi-furnished", area_sqft: 480, isAvailable: true,
  },
  {
    title: "2BHK Family Apartment in Nungambakkam",
    description: "Central location, close to schools, offices and metro.",
    price: 22000,
    type: "rent",
    images: ["https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800"],
    location: { city: "Chennai", area: "Nungambakkam", pincode: "600034" },
    bhk: 2, furnished: "furnished", area_sqft: 1150, isAvailable: true,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Create or find dummy owner users (with phone numbers)
    const ownerDocs = [];
    for (const owner of dummyOwners) {
      let existing = await User.findOne({ email: owner.email });
      if (!existing) {
        const hashedPassword = await bcrypt.hash("dummy1234", 10);
        existing = await User.create({
          name: owner.name,
          email: owner.email,
          phone: owner.phone,
          password: hashedPassword,
        });
      } else if (!existing.phone) {
        // backfill phone if missing
        existing.phone = owner.phone;
        await existing.save();
      }
      ownerDocs.push(existing);
    }

    // Distribute listings across the dummy owners round-robin style
    const listingsWithOwner = dummyListings.map((listing, index) => ({
      ...listing,
      owner: ownerDocs[index % ownerDocs.length]._id,
    }));

    await Listing.deleteMany({ type: "rent" });
    await Listing.insertMany(listingsWithOwner);
    console.log(`✅ Inserted ${listingsWithOwner.length} dummy listings across ${ownerDocs.length} owners!`);
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();