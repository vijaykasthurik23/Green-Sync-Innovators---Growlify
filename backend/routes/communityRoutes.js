const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const communityController = require('../controllers/communityController');

// ===== POST ROUTES =====
router.post('/posts', protect, communityController.createPost);
router.get('/posts', protect, communityController.getPosts);
router.delete('/posts/:id', protect, communityController.deletePost);

// ===== INTERACTION ROUTES =====
router.post('/posts/:id/like', protect, communityController.toggleLike);
router.post('/posts/:id/comment', protect, communityController.addComment);
router.get('/posts/:id/comments', protect, communityController.getComments);
router.delete('/comments/:id', protect, communityController.deleteComment);
router.post('/posts/:id/save', protect, communityController.toggleSave);

// ===== SHORTS ROUTES =====
router.post('/shorts', protect, communityController.createShort);
router.get('/shorts', protect, communityController.getShorts);
router.post('/shorts/:id/view', protect, communityController.trackShortView);
router.post('/shorts/:id/like', protect, communityController.toggleShortLike);

// ===== PERSONAL ACTIVITY ROUTES =====
router.get('/activity/liked', protect, communityController.getLikedPosts);
router.get('/activity/saved', protect, communityController.getSavedPosts);
router.get('/activity/commented', protect, communityController.getCommentedPosts);
router.get('/activity/shorts-viewed', protect, communityController.getViewedShorts);

// ===== NOTIFICATION ROUTES =====
router.get('/notifications', protect, communityController.getNotifications);
router.put('/notifications/:id/read', protect, communityController.markNotificationRead);
router.put('/notifications/read-all', protect, communityController.markAllNotificationsRead);

module.exports = router;
