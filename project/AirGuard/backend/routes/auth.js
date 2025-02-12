require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const cors = require('cors');
const User = require('../models/User');

const router = express.Router();
router.use(express.json());
router.use(cors());

if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET in .env file");
  process.exit(1);
}
// Register route
router.post('/register', async (req, res) => {
  try {
    console.log("Received data:", req.body);

    const { name, email, password, contact, dob, country, city, diseases, wantsAlerts, notificationType, alertFrequency } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // ✅ Check if the email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // ✅ Check if the username already exists
    const nameExists = await User.findOne({ name });
    if (nameExists) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // ✅ Optimized password reuse check
    const existingUsers = await User.find(); // Fetch all users
    for (let user of existingUsers) {
      const isPasswordUsed = await bcrypt.compare(password, user.password);
      if (isPasswordUsed) {
        return res.status(400).json({ error: 'This password has already been used. Please choose another one.' });
      }
    }

    // ✅ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      contact,
      dob,
      country,
      city,
      diseases,
      wantsAlerts,
      notificationType,
      alertFrequency,
    });

    await newUser.save();
    console.log("User saved:", newUser);

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if all required fields are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ 
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    console.log("Received forgot password request for email:", email);

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate Secure Reset Token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetToken = hashedToken;
    user.tokenExpiry = Date.now() + 3600000; // 1-hour expiration
    await user.save();

    console.log("Reset token generated and saved for user:", user.email);

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>This link is valid for 1 hour.</p>`,
    };

    console.log("Sending email to:", user.email);

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    res.json({ message: 'Password reset email sent!' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const user = await User.findOne({ resetToken: hashedToken, tokenExpiry: { $gt: Date.now() } });

      if (!user) {
          return res.status(400).json({ error: 'Invalid or expired token' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.tokenExpiry = undefined;
      await user.save();

      res.json({ message: 'Password reset successfully!' });
  } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
