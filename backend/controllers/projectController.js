import mongoose from "mongoose";
import Project from "../models/Project.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import jwt from "jsonwebtoken";

// Helper to check if requester is an approved Admin
const checkIsAdmin = async (req) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return false;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    return !!(user && user.role === "admin" && user.isApproved);
  } catch (error) {
    return false;
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res, next) => {
  try {
    const isExplicitAdminRequest =
      req.query.isAdmin === "true" ||
      req.query.status === "all" ||
      req.query.status?.toLowerCase() === "draft";
    const isAdminUser = isExplicitAdminRequest && (await checkIsAdmin(req));
    let queryObj = {};

    const requestedStatus = req.query.status?.toString().trim();
    const normalizedStatus = requestedStatus?.toLowerCase();

    // Category filter
    if (req.query.category && req.query.category !== "ALL") {
      queryObj.category = new RegExp(`^${req.query.category}$`, "i");
    }

    // Search query
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      queryObj.$or = [
        { title: searchRegex },
        { shortDescription: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { skills: searchRegex },
        { "featuresList.title": searchRegex },
        { "featuresList.description": searchRegex },
        { "techStackDetails.category": searchRegex },
        { "techStackDetails.items": searchRegex },
      ];
    }

    let categoryList = ["ALL"];
    let query;

    if (isAdminUser) {
      // Admin request: allow status filters
      if (normalizedStatus === "draft") {
        queryObj.status = "Draft";
      } else if (normalizedStatus === "published") {
        queryObj.status = "Published";
      } else {
        // Fetch all (Draft + Published) if status is 'all' or default
      }

      // Admin categories lookup (includes drafts)
      const allCategories = await Project.distinct("category");
      categoryList = [
        "ALL",
        ...new Set(allCategories.filter(Boolean).map((c) => c.toUpperCase())),
      ];

      query = Project.find(queryObj);

      // Admin sorting
      query = query.sort({ updatedAt: -1 });

      // Admin select
      if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
      } else {
        query = query.select("-imagePublicId -videoPublicId -createdBy -__v");
      }
    } else {
      // Public request: Forcibly restrict to Published projects only
      queryObj.status = "Published";

      // Public categories lookup (Published only)
      const allCategories = await Project.distinct("category", {
        status: "Published",
      });
      categoryList = [
        "ALL",
        ...new Set(allCategories.filter(Boolean).map((c) => c.toUpperCase())),
      ];

      query = Project.find(queryObj);

      // Public sorting
      query = query.sort({ featured: -1, order: 1, createdAt: -1 });

      // Public fields whitelist
      const publicWhitelist = [
        "_id",
        "title",
        "slug",
        "image",
        "video",
        "mediaType",
        "description",
        "skills",
        "demoLink",
        "githubLink",
        "category",
        "featured",
        "order",
        "createdAt",
      ];

      if (req.query.select) {
        const fields = req.query.select
          .split(",")
          .map((f) => f.trim())
          .filter((f) => publicWhitelist.includes(f))
          .join(" ");
        if (fields) {
          query = query.select(fields);
        } else {
          query = query.select(publicWhitelist.join(" "));
        }
      } else {
        query = query.select(publicWhitelist.join(" "));
      }
    }

    const page = req.query.page ? parseInt(req.query.page, 10) : null;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;

    if (page && limit) {
      const startIndex = (page - 1) * limit;
      const total = await Project.countDocuments(queryObj);

      query = query.skip(startIndex).limit(limit);
      const projects = await query;

      return res.status(200).json({
        success: true,
        count: projects.length,
        categories: categoryList,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          limit,
        },
        data: projects,
      });
    }

    const projects = await query;
    res.status(200).json({
      success: true,
      count: projects.length,
      categories: categoryList,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProject = async (req, res, next) => {
  try {
    let project;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      project = await Project.findById(req.params.id);
    } else {
      project = await Project.findOne({ slug: req.params.id });
    }

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Strict validation for Draft projects
    if (project.status === "Draft") {
      const isAdminUser = await checkIsAdmin(req);
      if (!isAdminUser) {
        return res.status(404).json({ error: "Project not found" });
      }
    }

    // Restrict response fields for security
    const projectObj = project.toObject();
    delete projectObj.imagePublicId;
    delete projectObj.videoPublicId;
    delete projectObj.createdBy;
    delete projectObj.__v;

    res.status(200).json({
      success: true,
      data: projectObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;

    // Check if media files are uploaded via Multer/Cloudinary fields
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        req.body.image = req.files.image[0].path;
        req.body.imagePublicId = req.files.image[0].filename;
      }
      if (req.files.video && req.files.video[0]) {
        req.body.video = req.files.video[0].path;
        req.body.videoPublicId = req.files.video[0].filename;
      }
    }

    // Get current max order
    const lastProject = await Project.findOne().sort("-order");
    req.body.order = lastProject ? lastProject.order + 1 : 0;

    const project = await Project.create(req.body);

    // Add project to user's projects array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { projects: project._id },
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if user is project owner
    if (
      project.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({ error: "Not authorized to update this project" });
    }

    // Handle media update if files are uploaded
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        // Delete old image from Cloudinary if it exists
        if (project.imagePublicId) {
          await cloudinary.uploader.destroy(project.imagePublicId);
        }
        req.body.image = req.files.image[0].path;
        req.body.imagePublicId = req.files.image[0].filename;
      }
      if (req.files.video && req.files.video[0]) {
        // Delete old video from Cloudinary if it exists
        if (project.videoPublicId) {
          await cloudinary.uploader.destroy(project.videoPublicId, {
            resource_type: "video",
          });
        }
        req.body.video = req.files.video[0].path;
        req.body.videoPublicId = req.files.video[0].filename;
      }
    }

    // Clean up if mediaType changed to image (delete video asset)
    const mediaType = req.body.mediaType || project.mediaType;
    if (mediaType === "image" && project.videoPublicId) {
      await cloudinary.uploader.destroy(project.videoPublicId, {
        resource_type: "video",
      });
      req.body.video = null;
      req.body.videoPublicId = null;
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if user is project owner
    if (
      project.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({ error: "Not authorized to delete this project" });
    }

    // Delete media from Cloudinary
    if (project.mediaType === "image" && project.imagePublicId) {
      await cloudinary.uploader.destroy(project.imagePublicId);
    } else if (project.mediaType === "video" && project.videoPublicId) {
      await cloudinary.uploader.destroy(project.videoPublicId, {
        resource_type: "video",
      });
    }

    await project.deleteOne();

    // Remove from user's array
    await User.findByIdAndUpdate(project.createdBy, {
      $pull: { projects: project._id },
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Update project order
// @route   PUT /api/projects/order
// @access  Private/Admin
export const updateProjectOrder = async (req, res, next) => {
  try {
    const { orders } = req.body; // Array of { id, order }

    if (!orders || !Array.isArray(orders)) {
      return res
        .status(400)
        .json({ error: "Please provide an array of orders" });
    }

    const updatePromises = orders.map((item) =>
      Project.findByIdAndUpdate(item.id, { order: item.order }),
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Projects order updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related projects for explore section (up to 4)
// @route   GET /api/projects/:id/explore
// @access  Public
export const getExploreProjects = async (req, res, next) => {
  try {
    let currentProject;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      currentProject = await Project.findById(req.params.id);
    } else {
      currentProject = await Project.findOne({ slug: req.params.id });
    }

    if (!currentProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    const currentCategory = currentProject.category ? currentProject.category.trim() : "";

    const exploreProjects = await Project.aggregate([
      {
        $match: {
          status: "Published",
          _id: { $ne: currentProject._id }
        }
      },
      {
        $addFields: {
          categoryMatch: {
            $cond: {
              if: {
                $and: [
                  { $ne: [currentCategory, ""] },
                  { $eq: [{ $type: "$category" }, "string"] },
                  { $eq: [{ $toLower: "$category" }, currentCategory.toLowerCase()] }
                ]
              },
              then: 1,
              else: 0
            }
          },
          isFeaturedInt: {
            $cond: {
              if: { $eq: ["$featured", true] },
              then: 1,
              else: 0
            }
          }
        }
      },
      {
        $sort: {
          categoryMatch: -1,
          isFeaturedInt: -1,
          order: 1,
          createdAt: -1
        }
      },
      { $limit: 4 },
      {
        $project: {
          _id: 1,
          title: 1,
          slug: 1,
          image: 1,
          video: 1,
          mediaType: 1,
          description: 1,
          skills: 1,
          category: 1,
          featured: 1,
          order: 1,
          createdAt: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: exploreProjects.length,
      data: exploreProjects,
    });
  } catch (error) {
    next(error);
  }
};

