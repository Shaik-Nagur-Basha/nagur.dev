import Profile from "../models/Profile.js";

// @desc    Get profile
// @route   GET /api/profile
// @access  Public
export const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne().sort({ createdAt: -1 });
    if (!profile) {
      return res.status(404).json({ success: false, error: "Profile not found" });
    }
    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or Update profile
// @route   POST /api/profile
// @access  Private (Admin)
export const updateProfile = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    // We only want one profile, so we'll find the existing one or create it
    let profile = await Profile.findOne();

    if (profile) {
      profile = await Profile.findByIdAndUpdate(profile._id, req.body, {
        new: true,
        runValidators: true,
      });
    } else {
      profile = await Profile.create(req.body);
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
