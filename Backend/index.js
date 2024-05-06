import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import storyRoutes from './routes/stories.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
 .then(() => console.log('MongoDB Connected...'))
 .catch(err => console.log(err));


 app.use(cors());


// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);



app.listen(port, () => console.log(`Server running on port ${port}`));
