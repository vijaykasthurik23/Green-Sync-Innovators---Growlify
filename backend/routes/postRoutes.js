const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET shorts
router.get('/shorts', async (req, res) => {
    try {
        const shorts = await Post.find({ type: 'video' }).sort({ createdAt: -1 });
        res.json(shorts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new post
router.post('/', async (req, res) => {
    const { user, image, caption, isPlant, tags } = req.body;

    const post = new Post({
        user,
        image,
        caption,
        isPlant,
        tags
    });

    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST like
router.post('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Simple toggle simulation (in real app tracking user likes is needed)
        // For now we just increment
        post.likes += 1;
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST comment
router.post('/:id/comment', async (req, res) => {
    console.log(`Adding comment to post: ${req.params.id}`);
    try {
        const { user, text } = req.body;
        if (!user || !text) {
            console.warn("Missing user or text in comment request");
            return res.status(400).json({ message: 'User and text are required' });
        }

        // Validate if ID is a valid MongoDB ObjectID
        if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
            console.error(`Invalid Post ID format: ${req.params.id}`);
            return res.status(400).json({ message: 'Invalid Post ID format. Comments are only supported for real posts.' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            console.error(`Post not found in DB: ${req.params.id}`);
            return res.status(404).json({ message: 'Post not found' });
        }

        // Migration check: if comments is not an array, reset it
        if (!Array.isArray(post.comments)) {
            console.log("Migrating comments field from Number to Array for post:", post._id);
            post.comments = [];
        }

        post.comments.push({ user, text });
        await post.save();
        console.log("Comment added successfully to:", post._id);
        res.status(201).json(post);
    } catch (err) {
        console.error("Error adding comment:", err);
        res.status(500).json({ message: err.message });
    }
});

// DELETE post
router.delete('/:id', async (req, res) => {
    try {
        if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Post ID' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
