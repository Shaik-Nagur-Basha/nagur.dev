import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: [true, "Media type is required"],
    },
    image: {
      type: String, // Cloudinary URL
      default: null,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    video: {
      type: String, // Cloudinary URL
      default: null,
    },
    videoPublicId: {
      type: String,
      default: null,
    },
    skills: {
      type: [String],
      required: [true, "At least one skill is required"],
    },
    githubLink: {
      type: String,
      required: [true, "GitHub link is required"],
    },
    demoLink: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    featuresList: [
      {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
      }
    ],
    gallery: [
      {
        url: { type: String, default: "" },
        caption: { type: String, default: "" },
      }
    ],
    techStackDetails: [
      {
        category: { type: String, default: "" },
        items: { type: [String], default: [] },
      }
    ],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
