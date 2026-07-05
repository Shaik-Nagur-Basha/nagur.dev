import mongoose from "mongoose";
import Project from "../models/Project.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res, next) => {
  try {
    let queryObj = {};

    // For public requests, show only Published projects.
    // If status is "all" or admin mode is requested, show all projects.
    if (req.query.status !== "all" && req.query.isAdmin !== "true") {
      queryObj.status = "Published";
    }

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

    // Get unique categories for project metadata based on status
    let categoriesObj = {};
    if (req.query.status !== "all" && req.query.isAdmin !== "true") {
      categoriesObj.status = "Published";
    }
    const allCategories = await Project.distinct("category", categoriesObj);
    const categoryList = ["ALL", ...new Set(allCategories.filter(Boolean).map(c => c.toUpperCase()))];

    let query = Project.find(queryObj);

    // Determine sort
    // Admin: recently added or updated first (updatedAt covers both cases)
    // Public: featured first, then priority order, then newest
    let sortObj = { featured: -1, order: 1, createdAt: -1 };
    if (req.query.status === "all" || req.query.isAdmin === "true") {
      sortObj = { updatedAt: -1 };
    }
    query = query.sort(sortObj);

    // Select fields: if a specific select parameter is provided, use it.
    // Otherwise, restrict by context:
    //   - admin requests (status=all): full form fields minus Cloudinary internals
    //   - public requests: minimal card fields only
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    } else if (req.query.status === "all" || req.query.isAdmin === "true") {
      // Admin list + edit form fields — exclude Cloudinary publicIds and internal fields
      query = query.select("-imagePublicId -videoPublicId -createdBy -__v");
    } else {
      // Limit fields for public card views to minimize payload
      query = query.select("title slug shortDescription description mediaType image video skills demoLink githubLink category featured order createdAt");
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
    res.status(200).json({
      success: true,
      data: project,
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

    // Check if media is uploaded via Multer/Cloudinary
    if (req.file) {
      const mediaType = req.body.mediaType;
      if (mediaType === "image") {
        req.body.image = req.file.path;
        req.body.imagePublicId = req.file.filename;
      } else if (mediaType === "video") {
        req.body.video = req.file.path;
        req.body.videoPublicId = req.file.filename;
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
    if (project.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({ error: "Not authorized to update this project" });
    }

    // Handle media update if file exists
    if (req.file) {
      // Delete old media from Cloudinary
      if (project.mediaType === "image" && project.imagePublicId) {
        await cloudinary.uploader.destroy(project.imagePublicId);
      } else if (project.mediaType === "video" && project.videoPublicId) {
        await cloudinary.uploader.destroy(project.videoPublicId, { resource_type: "video" });
      }

      // Set new media
      const mediaType = req.body.mediaType || project.mediaType;
      if (mediaType === "image") {
        req.body.image = req.file.path;
        req.body.imagePublicId = req.file.filename;
        req.body.video = null;
        req.body.videoPublicId = null;
      } else if (mediaType === "video") {
        req.body.video = req.file.path;
        req.body.videoPublicId = req.file.filename;
        req.body.image = null;
        req.body.imagePublicId = null;
      }
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
    if (project.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({ error: "Not authorized to delete this project" });
    }

    // Delete media from Cloudinary
    if (project.mediaType === "image" && project.imagePublicId) {
      await cloudinary.uploader.destroy(project.imagePublicId);
    } else if (project.mediaType === "video" && project.videoPublicId) {
      await cloudinary.uploader.destroy(project.videoPublicId, { resource_type: "video" });
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
      return res.status(400).json({ error: "Please provide an array of orders" });
    }

    const updatePromises = orders.map((item) =>
      Project.findByIdAndUpdate(item.id, { order: item.order })
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
