import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
       const { username, password } = req.body;
       const user = new User({ username, password });
       await user.save();
       res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
       res.status(500).json({ message: 'Registration failed.', error: err.message });
    }
   });


   router.post('/login', async (req, res) => {
      try {
         const { username, password } = req.body;
         const user = await User.findOne({ username });
         if (!user) return res.status(400).json({ message: 'Invalid username or password.' });
     
         const validPassword = await user.comparePassword(password);
         if (!validPassword) return res.status(400).json({ message: 'Invalid username or password.' });
     
         const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
         
         res.header('Authorization', token).json({ message: 'Login successful.', token, user: { username: user.username, _id: user._id } });
      } catch (err) {
         res.status(500).json({ message: 'Login failed.', error: err.message });
      }
  });


   router.post('/logout', authMiddleware, async (req, res) => {
      try {
          await User.findByIdAndUpdate(req.user._id, { token: null });
          res.json({ message: 'Logged out successfully.' });
      } catch (err) {
          res.status(500).json({ message: 'Failed to log out.', error: err.message });
      }
  });


router.delete('/user/:id', async (req, res) => {
    try {
       const user = await User.findByIdAndDelete(req.params.id);
       if (!user) return res.status(404).json({ message: 'User not found.' });
   
       res.json({ message: 'User deleted successfully.', user });
    } catch (err) {
       res.status(500).json({ message: 'Failed to delete user.', error: err.message });
    }
   });
   
   

export default router;
