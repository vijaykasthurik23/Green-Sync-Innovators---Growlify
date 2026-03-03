const CommunityPost = require('../models/CommunityPost');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Save = require('../models/Save');
const Short = require('../models/Short');
const ShortInteraction = require('../models/ShortInteraction');
const Notification = require('../models/Notification');

// ===== COMMUNITY POSTS =====

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { content, images } = req.body;
        const { _id, name } = req.user;

        const post = await CommunityPost.create({
            userId: _id,
            username: name,
            userAvatar: req.user.avatar || '',
            content,
            images: images || []
        });

        res.status(201).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all posts (paginated)
exports.getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await CommunityPost.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get user's interactions for each post
        const userId = req.user?._id;
        const postsWithUserData = await Promise.all(posts.map(async (post) => {
            const postObj = post.toObject();

            if (userId) {
                const [liked, saved] = await Promise.all([
                    Like.exists({ postId: post._id, userId }),
                    Save.exists({ postId: post._id, userId })
                ]);
                postObj.isLiked = !!liked;
                postObj.isSaved = !!saved;
            }

            return postObj;
        }));

        const total = await CommunityPost.countDocuments();

        res.json({
            success: true,
            posts: postsWithUserData,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await CommunityPost.findById(id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Delete associated data
        await Promise.all([
            Comment.deleteMany({ postId: id }),
            Like.deleteMany({ postId: id }),
            Save.deleteMany({ postId: id }),
            Notification.deleteMany({ postId: id })
        ]);

        await post.deleteOne();

        res.json({ success: true, message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ===== LIKES =====

// Toggle like on a post
exports.toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const post = await CommunityPost.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const existingLike = await Like.findOne({ postId: id, userId });

        if (existingLike) {
            // Unlike
            await existingLike.deleteOne();
            post.likesCount = Math.max(0, post.likesCount - 1);
            await post.save();

            return res.json({ success: true, liked: false, likesCount: post.likesCount });
        } else {
            // Like
            await Like.create({ postId: id, userId });
            post.likesCount += 1;
            await post.save();

            // Create notification (don't notify self)
            if (post.userId.toString() !== userId.toString()) {
                await Notification.create({
                    recipientId: post.userId,
                    senderId: userId,
                    senderName: req.user.name,
                    senderAvatar: req.user.avatar || '',
                    type: 'like',
                    postId: id,
                    message: `${req.user.name} liked your post`
                });
            }

            return res.json({ success: true, liked: true, likesCount: post.likesCount });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ===== COMMENTS =====

// Add comment to a post
exports.addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        console.log(`Adding comment to post ${id} by user ${req.user?._id}`);

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        const { _id, name } = req.user;

        const post = await CommunityPost.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const comment = await Comment.create({
            postId: id,
            userId: _id,
            username: name,
            userAvatar: req.user.avatar || '',
            content
        });

        post.commentsCount += 1;
        await post.save();

        // Create notification (don't notify self)
        if (post.userId.toString() !== _id.toString()) {
            await Notification.create({
                recipientId: post.userId,
                senderId: _id,
                senderName: name,
                senderAvatar: req.user.avatar || '',
                type: 'comment',
                postId: id,
                message: `${name} commented on your post`
            });
        }

        res.status(201).json({ success: true, comment, commentsCount: post.commentsCount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get comments for a post
exports.getComments = async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await Comment.find({ postId: id }).sort({ createdAt: -1 });

        res.json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        // Allow comment author OR post author to delete?
        // For now, only comment author
        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const post = await CommunityPost.findById(comment.postId);
        if (post) {
            post.commentsCount = Math.max(0, post.commentsCount - 1);
            await post.save();
        }

        await comment.deleteOne();

        res.json({ success: true, message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ===== SAVES =====

// Toggle save on a post
exports.toggleSave = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const post = await CommunityPost.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const existingSave = await Save.findOne({ postId: id, userId });

        if (existingSave) {
            // Unsave
            await existingSave.deleteOne();
            post.savesCount = Math.max(0, post.savesCount - 1);
            await post.save();

            return res.json({ success: true, saved: false, savesCount: post.savesCount });
        } else {
            // Save
            await Save.create({ postId: id, userId });
            post.savesCount += 1;
            await post.save();

            // Create notification (don't notify self)
            if (post.userId.toString() !== userId.toString()) {
                await Notification.create({
                    recipientId: post.userId,
                    senderId: userId,
                    senderName: req.user.name,
                    senderAvatar: req.user.avatar || '',
                    type: 'save',
                    postId: id,
                    message: `${req.user.name} saved your post`
                });
            }

            return res.json({ success: true, saved: true, savesCount: post.savesCount });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ===== SHORTS =====

// Create a short
exports.createShort = async (req, res) => {
    try {
        const { videoUrl, thumbnail, caption } = req.body;
        const { _id, name } = req.user;

        const short = await Short.create({
            userId: _id,
            username: name,
            userAvatar: req.user.avatar || '',
            videoUrl,
            thumbnail: thumbnail || '',
            caption: caption || ''
        });

        res.status(201).json({ success: true, short });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get shorts feed
exports.getShorts = async (req, res) => {
    try {
        const shorts = await Short.find().sort({ createdAt: -1 }).limit(50);

        // Get user's interactions
        const userId = req.user?._id;
        const shortsWithUserData = await Promise.all(shorts.map(async (short) => {
            const shortObj = short.toObject();

            if (userId) {
                const liked = await ShortInteraction.exists({
                    shortId: short._id,
                    userId,
                    type: 'like'
                });
                shortObj.isLiked = !!liked;
            }

            return shortObj;
        }));

        res.json({ success: true, shorts: shortsWithUserData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Track short view
exports.trackShortView = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const short = await Short.findById(id);
        if (!short) {
            return res.status(404).json({ success: false, message: 'Short not found' });
        }

        // Check if already viewed
        const existingView = await ShortInteraction.findOne({
            shortId: id,
            userId,
            type: 'view'
        });

        if (!existingView) {
            await ShortInteraction.create({ shortId: id, userId, type: 'view' });
            short.viewsCount += 1;
            await short.save();
        }

        res.json({ success: true, viewsCount: short.viewsCount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle like on a short
exports.toggleShortLike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const short = await Short.findById(id);
        if (!short) {
            return res.status(404).json({ success: false, message: 'Short not found' });
        }

        const existingLike = await ShortInteraction.findOne({
            shortId: id,
            userId,
            type: 'like'
        });

        if (existingLike) {
            // Unlike
            await existingLike.deleteOne();
            short.likesCount = Math.max(0, short.likesCount - 1);
            await short.save();

            return res.json({ success: true, liked: false, likesCount: short.likesCount });
        } else {
            // Like
            await ShortInteraction.create({ shortId: id, userId, type: 'like' });
            short.likesCount += 1;
            await short.save();

            // Create notification (don't notify self)
            if (short.userId.toString() !== userId.toString()) {
                await Notification.create({
                    recipientId: short.userId,
                    senderId: userId,
                    senderName: req.user.name,
                    senderAvatar: req.user.avatar || '',
                    type: 'short_like',
                    shortId: id,
                    message: `${req.user.name} liked your short`
                });
            }

            return res.json({ success: true, liked: true, likesCount: short.likesCount });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ===== PERSONAL ACTIVITY =====

// Get user's liked posts
exports.getLikedPosts = async (req, res) => {
    try {
        const userId = req.user._id;

        const likes = await Like.find({ userId })
            .sort({ createdAt: -1 })
            .populate('postId');

        const posts = likes
            .filter(like => like.postId)
            .map(like => ({
                ...like.postId.toObject(),
                isLiked: true,
                likedAt: like.createdAt
            }));

        res.json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's saved posts
exports.getSavedPosts = async (req, res) => {
    try {
        const userId = req.user._id;

        const saves = await Save.find({ userId })
            .sort({ createdAt: -1 })
            .populate('postId');

        const posts = saves
            .filter(save => save.postId)
            .map(save => ({
                ...save.postId.toObject(),
                isSaved: true,
                savedAt: save.createdAt
            }));

        res.json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's commented posts
exports.getCommentedPosts = async (req, res) => {
    try {
        const userId = req.user._id;

        const comments = await Comment.find({ userId })
            .sort({ createdAt: -1 })
            .populate('postId');

        // Group by post and get unique posts
        const postMap = new Map();
        comments.forEach(comment => {
            if (comment.postId && !postMap.has(comment.postId._id.toString())) {
                postMap.set(comment.postId._id.toString(), {
                    ...comment.postId.toObject(),
                    lastCommentedAt: comment.createdAt
                });
            }
        });

        const posts = Array.from(postMap.values());

        res.json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's viewed shorts
exports.getViewedShorts = async (req, res) => {
    try {
        const userId = req.user._id;

        const views = await ShortInteraction.find({ userId, type: 'view' })
            .sort({ createdAt: -1 })
            .populate('shortId');

        const shorts = views
            .filter(view => view.shortId)
            .map(view => ({
                ...view.shortId.toObject(),
                viewedAt: view.createdAt
            }));

        res.json({ success: true, shorts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ===== NOTIFICATIONS =====

// Get user notifications
exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ recipientId: userId })
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            recipientId: userId,
            read: false
        });

        res.json({ success: true, notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mark notification as read
exports.markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findById(id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        notification.read = true;
        await notification.save();

        res.json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mark all notifications as read
exports.markAllNotificationsRead = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.updateMany(
            { recipientId: userId, read: false },
            { read: true }
        );

        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
