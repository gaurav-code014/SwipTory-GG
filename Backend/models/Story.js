import mongoose from 'mongoose';

const SlideSchema = new mongoose.Schema({
 heading: { type: String, required: true },
 description: { type: String, required: true },
 Image: { type: String, required: true }, 
 category: { type: String, required: true, enum: ['food', 'health and fitness', 'travel', 'movies', 'education'] }
});

const StorySchema = new mongoose.Schema({
 slides: [SlideSchema],
 likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
 createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Story = mongoose.model('Story', StorySchema);
export default Story;