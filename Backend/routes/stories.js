import express from 'express';
import Story from '../models/Story.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();


router.get('/', async (req, res) => {
    try {
       const stories = await Story.find().populate('createdBy', 'username');
       res.json({ message: 'Stories retrieved successfully.', stories });
    } catch (err) {
       res.status(500).json({ message: 'Failed to retrieve stories.', error: err.message });
    }
   });



   router.post('/', authMiddleware, async (req, res) => {
      try {
          
          const firstCategory = req.body.slides[0].category;
  
         
          for (let i = 1; i < req.body.slides.length; i++) {
              if (req.body.slides[i].category !== firstCategory) {
                  return res.status(400).json({ message: 'All slides must have the same category.' });
              }
          }
  
          const story = new Story({ ...req.body, createdBy: req.user._id });
          await story.save();
          res.status(201).json({ message: 'Story added successfully.', story });
      } catch (err) {
          res.status(500).json({ message: 'Failed to add story.', error: err.message });
      }
  });
  


router.put('/:id', authMiddleware, async (req, res) => {
   try {
      const story = await Story.findById(req.params.id);
      if (!story) return res.status(404).json({ message: 'Story not found.' });
      if (story.createdBy.toString() !== req.user._id) {
        return res.status(403).json({ message: 'You do not have permission to edit this story.' });
      }
      const firstCategory = req.body.slides[0].category;
      for (let i = 1; i < req.body.slides.length; i++) {
          if (req.body.slides[i].category !== firstCategory) {
              return res.status(400).json({ message: 'All slides must have the same category.' });
          }
      }
      
      story.slides = req.body.slides;
      await story.save();
      res.json({ message: 'Story updated successfully.', story });
   } catch (err) {
      res.status(500).json({ message: 'Failed to update story.', error: err.message });
   }
});



router.delete('/:id', authMiddleware, async (req, res) => {
   try {
       const story = await Story.findById(req.params.id);
       if (!story) return res.status(404).json({ message: 'Story not found.' });
       if (story.createdBy.toString() !== req.user._id) {
           return res.status(403).json({ message: 'You do not have permission to delete this story.' });
       }
       
       await Story.findByIdAndDelete(req.params.id);
       res.json({ message: 'Story deleted successfully.' });
   } catch (err) {
       res.status(500).json({ message: 'Failed to delete story.', error: err.message });
   }
});

   

router.post('/bookmark/:storyId', authMiddleware, async (req, res) => {
   try {
       const user = await User.findById(req.user._id);
       if (!user) return res.status(404).json({ message: 'User not found.' });

       const storyId = req.params.storyId;
       const index = user.bookmarks.indexOf(storyId);

       if (index > -1) {
           user.bookmarks.splice(index, 1);
           await user.save();
           res.json({ message: 'Story unbookmarked successfully.', bookmarks: user.bookmarks });
       } else {
           user.bookmarks.push(storyId);
           await user.save();
           res.json({ message: 'Story bookmarked successfully.', bookmarks: user.bookmarks });
       }
   } catch (err) {
       res.status(500).json({ message: 'Failed to update bookmark status.', error: err.message });
   }
});

router.get('/bookmarked', authMiddleware, async (req, res) => {
   try {
      const user = await User.findById(req.user._id).populate('bookmarks');
      if (!user) return res.status(404).json({ message: 'User not found.' });
  
      res.json({ message: 'Bookmarked stories retrieved successfully.', stories: user.bookmarks });
   } catch (err) {
      res.status(500).json({ message: 'Failed to retrieve bookmarked stories.', error: err.message });
   }
});


router.post('/like/:storyId', authMiddleware, async (req, res) => {
   try {
       const story = await Story.findById(req.params.storyId);
       if (!story) return res.status(404).json({ message: 'Story not found.' });

       const userId = req.user._id;
       const index = story.likes.indexOf(userId);

       if (index > -1) {
           story.likes.splice(index, 1);
       } else {
           story.likes.push(userId);
       }

       await story.save();
       res.json({ message: 'Like status updated successfully.', likes: story.likes });
   } catch (err) {
       res.status(500).json({ message: 'Failed to update like status.', error: err.message });
   }
});


router.get('/filter', async (req, res) => {
   try {
       const category = req.query.category;
       if (!category) {
           return res.status(400).json({ message: 'Category query parameter is required.' });
       }

       const stories = await Story.find({ 'slides.category': category }).populate('createdBy', 'username');
       res.json({ message: 'Stories filtered by category successfully.', stories });
   } catch (err) {
       res.status(500).json({ message: 'Failed to filter stories by category.', error: err.message });
   }
});


router.get('/:id', async (req, res) => {
    try {
        const story = await Story.findById(req.params.id).populate('createdBy', 'username');
        if (!story) return res.status(404).json({ message: 'Story not found.' });

        res.json({ message: 'Story retrieved successfully.', story });
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve story.', error: err.message });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const stories = await Story.find({ createdBy: userId }).populate('createdBy', 'username');
        res.json({ message: 'Stories retrieved successfully.', stories });
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve stories.', error: err.message });
    }
});

router.get('/bookmarks', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json({ message: 'User retrieved successfully.', user });
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve user.', error: err.message });
    }
});


   
export default router;
