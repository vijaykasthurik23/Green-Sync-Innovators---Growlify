const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        name: { type: String, required: true },
        avatar: { type: String, default: '' },
        handle: { type: String, required: true },
        userId: { type: String } // link to User model if needed
    },
    image: { type: String },
    video: { type: String }, // URL for video file
    thumbnail: { type: String }, // URL for video poster
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    caption: { type: String },
    likes: { type: Number, default: 0 },
    comments: [
        {
            user: { type: String, required: true },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    isPlant: { type: Boolean, default: false },
    tags: [String],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
