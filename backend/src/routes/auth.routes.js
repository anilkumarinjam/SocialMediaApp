import express from 'express';
import { forgotPassword, resetPassword } from '../controllers/auth.controllers.js';

const router = express.Router();

// Route to handle forgot password
router.post('/forgot-password', forgotPassword);

// Route to handle password reset
router.post('/reset-password', resetPassword);

export default router;