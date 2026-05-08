import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
    },
    cv: {
      type: String, // URL to CV (Cloudinary or External)
    },
    profilePicture: {
      type: String, // URL to profile picture
    },
    socialLinks: {
      github: String,
      linkedin: String,
      telegram: String,
      email: String,
    },
    location: String,
    phone: String,
    availability: {
      type: String,
      default: "Available for projects",
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Profile", profileSchema);
