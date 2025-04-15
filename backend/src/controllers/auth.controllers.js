import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Forgot Password Controller
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError(404, 'User with this email does not exist'));
    }

    // Respond with success (you can implement email sending here if needed)
    res.status(200).json(new ApiResponse(200, 'Email validated successfully', { userId: user._id }));
  } catch (error) {
    next(error);
  }
};

// Reset Password Controller
export const resetPassword = async (req, res, next) => {
  const { userId, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json(new ApiResponse(200, 'Password updated successfully'));
  } catch (error) {
    next(error);
  }
};