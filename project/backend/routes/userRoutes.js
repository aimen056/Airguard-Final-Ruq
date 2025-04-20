const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { 
      name, 
      email, 
      contact, 
      dob, 
      country, 
      city, 
      wantsAlerts, 
      notificationType, 
      alertFrequency, 
      diseases 
    } = req.body;
    
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,
        contact,
        dob,
        country,
        city,
        wantsAlerts,
        ...(wantsAlerts && {
          notificationType,
          alertFrequency,
          diseases
        })
      },
      { new: true }
    ).select('-password');
    
    res.json({ 
      message: 'Profile updated successfully', 
      user: updatedUser 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;