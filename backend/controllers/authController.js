import User from "../models/User.js";
import { sendToken } from "../utils/sendToken.js";

// @desc    Register user (Admin only for now)
// @route   POST /api/auth/register
// @access  Public (should be protected or limited in production)
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log("Register attempt:", { name, email });

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Check if it's the first user
    const isFirstUser = (await User.countDocuments({})) === 0;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: isFirstUser ? "admin" : "user",
      isApproved: isFirstUser,
    });

    sendToken(user, 201, res);
  } catch (error) {
    console.error("Auth Error:", error);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email);

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if approved
    if (!user.isApproved) {
      return res.status(403).json({ error: "Your account is pending approval from the administrator." });
    }

    sendToken(user, 200, res);
  } catch (error) {
    console.error("Auth Error:", error);
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Auth Error:", error);
    next(error);
  }
};
// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private (Admin)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort("-createdAt");
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve and/or update user role
// @route   PUT /api/auth/users/:id
// @access  Private (Admin)
export const approveUser = async (req, res, next) => {
  try {
    const { role, isApproved } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isApproved },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ error: "You cannot delete your own account" });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "Please provide all password fields" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New passwords do not match" });
    }

    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
