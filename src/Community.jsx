import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Share2, Bookmark,
  Plus, MoreHorizontal, Leaf,
  TrendingUp, Award, Image as ImageIcon,
  X, ChevronRight, Play, ArrowLeft, Bell, Trash2
} from 'lucide-react';
import './Community.css';
import Confetti from 'react-confetti';
import axios from 'axios';

// --- CONFIG & DUMMY DATA ---
const API_BASE = "http://localhost:5002/api";

// Get auth token for API requests
const getAuthHeaders = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      return { headers: { Authorization: `Bearer ${parsed.token}` } };
    } catch (e) {
      return {};
    }
  }
  return {};
};

// Helper function to format time
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};

const DUMMY_REELS = [
  {
    id: 'r1',
    user: 'botanist_jane',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    video: 'https://commons.wikimedia.org/wiki/Special:FilePath/Monstera_Deliciosa_Leaf_Bloom.webm',
    poster: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=400',
    caption: 'My Monstera Deliciosa unfurling a new leaf! 🌿 #monstera #timelapse',
    likes: 120,
    isPlant: true
  },
  {
    id: 'r2',
    user: 'green_thumb_mike',
    avatar: 'https://i.pravatar.cc/150?u=mike',
    video: 'https://commons.wikimedia.org/wiki/Special:FilePath/Venus_Flytrap_(time_lapse).webm',
    poster: 'https://images.unsplash.com/photo-1554631221-f9603e6808ba?auto=format&fit=crop&q=80&w=400',
    caption: 'Venus Flytrap in action! 🦟 Beware pests! #carnivorousplants',
    likes: 85,
    isPlant: true
  },
  {
    id: 'r3',
    user: 'urban_jungle',
    avatar: 'https://i.pravatar.cc/150?u=urban',
    video: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lima_Bean_Time_Lapse.webm',
    poster: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&q=80&w=400',
    caption: 'Lima Bean growth speedrun 🏃‍♂️🌱 #growth #nature',
    likes: 210,
    isPlant: true
  },
  {
    id: 'r4',
    user: 'succulent_sam',
    avatar: 'https://i.pravatar.cc/150?u=sam',
    video: 'https://commons.wikimedia.org/wiki/Special:FilePath/Strawberry_growth_(Video).webm',
    poster: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=400',
    caption: 'From flower to strawberry 🍓 Amazing process! #fruit #garden',
    likes: 95,
    isPlant: true
  },
  {
    id: 'r5',
    user: 'clover_fan',
    avatar: 'https://i.pravatar.cc/150?u=clover',
    video: 'https://commons.wikimedia.org/wiki/Special:FilePath/Time_lapse_clover.webm',
    poster: 'https://images.unsplash.com/photo-1595855739818-45d2f70d22c5?auto=format&fit=crop&q=80&w=400',
    caption: 'Watching these clovers dance is mesmerizing 🍀 #clover #timelapse',
    likes: 150,
    isPlant: true
  },
];

const DUMMY_POSTS = [
  {
    id: 'p1',
    user: { name: 'Sarah Green', avatar: 'https://i.pravatar.cc/150?u=sarah', handle: '@sarah_g' },
    image: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&q=80&w=800',
    caption: 'My Monstera finally put out a fenestrated leaf! 🌿 Only took 6 months of patience and a lot of humidity.',
    likes: 42,
    comments: 8,
    isPlant: true,
    time: '2 hours ago',
    tags: ['monstera', 'growth', 'victory']
  },
  {
    id: 'p2',
    user: { name: 'David Chen', avatar: 'https://i.pravatar.cc/150?u=david', handle: '@d_chen' },
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800',
    caption: 'Anyone know what\'s wrong with my tomato leaves? They are turning yellow at the bottom. 🍅 #help',
    likes: 12,
    comments: 15,
    isPlant: true,
    time: '5 hours ago',
    tags: ['help', 'tomatoes', 'diagnosis']
  },
  {
    id: 'p3',
    user: { name: 'Emily Rose', avatar: 'https://i.pravatar.cc/150?u=emily', handle: '@rose_garden' },
    image: 'https://images.unsplash.com/photo-1446071103084-c257b5f70672?auto=format&fit=crop&q=80&w=800',
    caption: 'Behold the beauty of my new Succulent arrangement! 🌵 Spent all weekend potting these babies. Do they look crowded?',
    likes: 89,
    comments: 23,
    isPlant: true,
    time: '1 day ago',
    tags: ['succulents', 'arrangements', 'diy']
  },
  {
    id: 'p4',
    user: { name: 'Jungle Jim', avatar: 'https://i.pravatar.cc/150?u=jim', handle: '@urban_jungle_jim' },
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=800',
    caption: 'Living room goals. 🛋️🌿 I think I might have an addiction, but at least the air is clean!',
    likes: 342,
    comments: 45,
    isPlant: true,
    time: '2 days ago',
    tags: ['interiordesign', 'indoorplants', 'airpurifying']
  },
  {
    id: 'p5',
    user: { name: 'Growlify Team', avatar: 'https://i.pravatar.cc/150?u=growlify', handle: '@growlify_official' },
    image: '/challenge.png',
    caption: '🌿 SHOW US YOUR GREEN SPACE! | Join the #GreenThumbChallenge 📸 Take a beautiful photo of your plant and tell us your favorite plant care tip to win 500 Growlify Points!',
    likes: 240,
    comments: 56,
    isPlant: false,
    time: 'Just now',
    tags: ['GreenThumbChallenge', 'community', 'Growlify', 'challenge']
  }
];

const REWARDS_DATA = [
  { id: 'rem1', name: 'Starter Succulent Seeds', points: 300, icon: '🌱' },
  { id: 'rem2', name: 'Organic Fertilizer Pro', points: 500, icon: '🍃' },
  { id: 'rem3', name: 'Premium Ceramic Pot', points: 1200, icon: '🏺' },
  { id: 'rem4', name: 'Growlify Shop 20% OFF', points: 2000, icon: '🏷️' },
];

// --- COMPONENTS ---

const HeroSection = ({ onOpenNotifications, notificationCount = 0 }) => {
  const [greeting, setGreeting] = useState('Welcome Back');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div className="hero-section">
      <div className="hero-header">
        <div className="greeting-box">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p style={{ margin: 0, color: 'var(--c-text-tertiary)', fontWeight: 600 }}>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <h1>{greeting}, Gardener 🌿</h1>
          </motion.div>
        </div>

        <div className="community-pulse">
          <motion.div className="pulse-badge" whileHover={{ scale: 1.05 }}>
            <div className="pulse-dot"></div>
            <span>1.2k Active Now</span>
          </motion.div>
          <motion.div className="pulse-badge" whileHover={{ scale: 1.05 }}>
            <TrendingUp size={16} color="var(--c-accent-primary)" />
            <span>Trending: #MonsteraMonday</span>
          </motion.div>
          {/* Notification Bell */}
          <motion.button
            className="notification-bell-btn"
            whileHover={{ scale: 1.05 }}
            onClick={onOpenNotifications}
            style={{
              position: 'relative',
              background: 'white',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Bell size={18} color="var(--c-accent-primary)" />
            {notificationCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -6,
                right: -6,
                background: '#D64045',
                color: 'white',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700
              }}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const NotificationDropdown = ({ isOpen, onClose, notifications = [], onMarkAsRead, onMarkAllAsRead }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ background: 'rgba(0,0,0,0.3)' }}>
      <motion.div
        className="notification-dropdown"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        style={{
          position: 'fixed',
          top: 100,
          right: 20,
          width: '400px',
          maxHeight: '500px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10001
        }}
      >
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Notifications</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onMarkAllAsRead}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--c-accent-primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Mark all read
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '400px' }}>
          {notifications.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
              <Bell size={48} color="#ddd" style={{ marginBottom: 12 }} />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif._id}
                onClick={() => onMarkAsRead(notif._id)}
                style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid #f5f5f5',
                  cursor: 'pointer',
                  background: notif.read ? 'white' : '#f0f8ff',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'}
                onMouseLeave={e => e.currentTarget.style.background = notif.read ? 'white' : '#f0f8ff'}
              >
                <div style={{ display: 'flex', gap: 12 }}>
                  <img
                    src={notif.senderAvatar || 'https://i.pravatar.cc/150?u=' + notif.senderName}
                    alt={notif.senderName}
                    style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#333' }}>
                      {notif.message}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#999', marginTop: 4, display: 'block' }}>
                      {timeAgo(new Date(notif.createdAt))}
                    </span>
                  </div>
                  {!notif.read && (
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'var(--c-accent-primary)',
                      flexShrink: 0,
                      marginTop: 6
                    }} />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div >
  );
};

const CommentDrawer = ({ isOpen, onClose, reelId, comments = [], onAddComment }) => {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  return (
    <div className="shorts-comments-drawer" onClick={e => e.stopPropagation()}>
      <div className="drawer-header">
        <span>Comments ({comments.length})</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>
      <div className="drawer-body">
        {comments.map((c, i) => (
          <div key={i} className="comment-item">
            <div className="comment-avatar" style={{ background: '#eee' }}></div> {/* Placeholder avatar */}
            <div className="comment-content">
              <div className="comment-username">{c.user}</div>
              <div className="comment-text">{c.text}</div>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>No comments yet.</div>
        )}
      </div>
      <div className="drawer-footer">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#ccc', flexShrink: 0 }}></div>
          <input
            type="text"
            className="comment-inline-input"
            style={{ margin: 0, flex: 1 }}
            placeholder="Add a comment..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && text.trim()) {
                onAddComment(text);
                setText('');
              }
            }}
          />
          <button
            style={{ background: 'none', border: 'none', color: text.trim() ? 'var(--c-accent-primary)' : '#ccc', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => {
              if (text.trim()) {
                onAddComment(text);
                setText('');
              }
            }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

const ShortsViewer = ({ initialReelId, shorts, onClose }) => {
  // Find index of initial reel
  const initialIndex = shorts.findIndex(r => r.id === initialReelId);
  const scrollRef = useRef(null);
  const [playingId, setPlayingId] = useState(initialReelId);

  useEffect(() => {
    // Scroll to initial reel
    if (scrollRef.current && initialIndex !== -1) {
      const el = scrollRef.current.children[initialIndex];
      // Timeout to ensure DOM is ready and layout is stable
      setTimeout(() => el.scrollIntoView(), 50);
    }
  }, [initialIndex]);

  // Observer to track which video is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.id;
            if (id) setPlayingId(id);
          }
        });
      },
      { threshold: 0.6 }
    );

    const children = scrollRef.current?.children;
    if (children) {
      Array.from(children).forEach(child => observer.observe(child));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="shorts-modal-overlay">
      {/* Back Button (Top Left) */}
      <button
        className="shorts-back-btn"
        onClick={onClose}
      >
        <ArrowLeft size={24} strokeWidth={2.5} />
      </button>

      {/* Close Button (Top Right - Keep purely for desktop/habit, or remove if redundant. Keeping as backup) */}
      <button className="shorts-close-btn" onClick={onClose}>
        <X size={24} />
      </button>

      <div className="shorts-container" ref={scrollRef}>
        {shorts.map(reel => (
          <ShortsSlide key={reel.id} reel={reel} isPlaying={playingId === reel.id} />
        ))}
      </div>
    </div>
  );
};

const ShortsSlide = ({ reel, isPlaying }) => {
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState([
    { user: 'PlantLover', text: 'Amazing growth! 🌱' },
    { user: 'GreenThumb', text: 'How often do you water?' }
  ]);

  const trackView = useCallback(async () => {
    try {
      // Only track real shorts from backend, not dummy data
      if (reel.id && reel._id) {
        await axios.post(API_BASE + '/community/shorts/' + reel.id + '/view', {}, getAuthHeaders());
      }
    } catch (e) {
      console.warn('View tracking failed', e);
    }
  }, [reel.id, reel._id]);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      videoRef.current?.play().catch(() => { });
      // Track view when short starts playing
      trackView();
    } else {
      videoRef.current?.pause();
      if (!isPlaying) videoRef.current.currentTime = 0;
    }
  }, [isPlaying, isPaused, trackView]);

  // Double tap gesture
  const lastTapRef = useRef(0);
  const handleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      handleLike();
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 1000);
    } else {
      // Single tap - toggle play/pause
      togglePlay();
    }
    lastTapRef.current = now;
  };

  const togglePlay = async () => {
    if (!videoRef.current) return;

    try {
      if (videoRef.current.paused) {
        await videoRef.current.play();
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    } catch (e) {
      console.warn("Playback error:", e);
      // Optional: set UI state to show error
    }
  };

  const handleLike = async () => {
    const previousLiked = liked;
    setLiked(!previousLiked);

    try {
      // Use new shorts API endpoint
      if (reel.id && reel._id) {
        await axios.post(API_BASE + '/community/shorts/' + reel.id + '/like', {}, getAuthHeaders());
      } else {
        // Dummy short - just update UI
        console.log('Dummy short liked (not persisted)');
      }
    } catch (e) {
      console.error("Like failed", e);
      setLiked(previousLiked);
    }
  };

  const handleShare = () => {
    const shareData = {
      title: 'Growlify Shorts',
      text: 'Check out this amazing plant video by ' + reel.user + '!',
      url: window.location.href
    };
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied! 📋");
    }
  };

  const addComment = async (text) => {
    // Optimistic update for local view
    const newComment = { user: 'You', text };
    setComments([...comments, newComment]);

    try {
      if (reel.id && reel.id.length > 5) {
        await axios.post(API_BASE + '/posts/' + reel.id + '/comment', {
          user: 'You',
          text
        });
      }
    } catch (e) {
      console.error("Comment failed", e);
      // Optional: show error to user
    }
  };

  return (
    <div className="short-slide" data-id={reel.id}>
      <video
        ref={videoRef}
        src={reel.video}
        className="short-video"
        loop
        playsInline
        onClick={handleTap}
        poster={reel.poster}
        onError={(e) => {
          console.error("Video error:", e.nativeEvent);
          e.target.style.display = 'none'; // Fallback to poster
        }}
      />

      {/* Double Tap Heart Animation */}
      {showHeartAnim && (
        <div className="double-tap-heart">
          <Heart size={100} fill="rgba(255, 255, 255, 0.9)" color="transparent" />
        </div>
      )}

      <div className={'play-pause-indicator ' + (isPaused ? 'paused' : '')}>
        <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: 20 }}>
          <Play size={40} fill="white" color="white" />
        </div>
      </div>

      <div className="short-overlay-ui">
        <div className="short-content-info">
          <div className="short-user-row">
            <img src={reel.avatar} alt={reel.user} className="short-avatar" />
            <span className="short-username">{reel.user}</span>
            <button className="short-follow-btn">Follow</button>
          </div>
          <div className="short-caption">{reel.caption}</div>
        </div>

        <div className="short-actions-sidebar">
          <button className="short-action-btn" onClick={handleLike}>
            <div className="short-action-icon-wrap">
              <Heart size={28} fill={liked ? '#D64045' : 'none'} color={liked ? '#D64045' : 'white'} />
            </div>
            <span className="short-action-label">{reel.likes + (liked ? 1 : 0)}</span>
          </button>

          <button className="short-action-btn" onClick={() => setIsCommentsOpen(true)}>
            <div className="short-action-icon-wrap">
              <MessageCircle size={28} color="white" />
            </div>
            <span className="short-action-label">{comments.length}</span>
          </button>

          <button className="short-action-btn" onClick={handleShare}>
            <div className="short-action-icon-wrap">
              <Share2 size={28} color="white" />
            </div>
            <span className="short-action-label">Share</span>
          </button>

          <button className="short-action-btn">
            <div className="short-action-icon-wrap">
              <MoreHorizontal size={28} color="white" />
            </div>
          </button>

          <div style={{
            width: 40, height: 40, borderRadius: 6, border: '2px solid white',
            overflow: 'hidden', marginTop: 10
          }}>
            <img src={reel.poster} alt="Reel thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isCommentsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10009 }}
            onClick={() => setIsCommentsOpen(false)}
          >
            <CommentDrawer
              isOpen={isCommentsOpen}
              onClose={() => setIsCommentsOpen(false)}
              comments={comments}
              onAddComment={addComment}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReelsRail = ({ shorts = [], onOpenShorts }) => {
  return (
    <div className="reels-rail">
      <div className="rail-header">
        <h3>Grow-Shorts</h3>
        <span
          style={{ fontSize: '0.9rem', color: 'var(--c-accent-primary)', cursor: 'pointer', fontWeight: 600 }}
          onClick={() => {
            if (shorts.length > 0) onOpenShorts(shorts[0].id);
          }}
        >
          View All
        </span>
      </div>
      <div className="rail-scroll-area">
        {shorts.map((reel) => (
          <div
            key={reel.id}
            className="reel-card"
            style={{
              backgroundImage: 'url(' + reel.poster + ')',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onMouseEnter={async (e) => {
              const video = e.currentTarget.querySelector('video');
              try {
                await video.play();
              } catch (err) {
                // Silently fail if autoplay blocked
              }
            }}
            onMouseLeave={(e) => {
              const video = e.currentTarget.querySelector('video');
              video.pause();
              video.currentTime = 0;
            }}
            onClick={() => onOpenShorts(reel.id)}
          >
            <video
              className="reel-bg-video"
              loop
              muted
              playsInline
              poster={reel.poster}
            >
              <source src={reel.video} type="video/mp4" />
            </video>

            <div className="reel-overlay">
              <div className="reel-user">
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', marginRight: 6 }}></div>
                {reel.user}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{reel.caption.substring(0, 30)}...</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RedeemModal = ({ isOpen, onClose, reward, onRedeem, userPoints }) => {
  if (!isOpen || !reward) return null;
  const canAfford = userPoints >= reward.points;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="modal-header">
          Redeem Reward
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>{reward.icon}</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>{reward.name}</h3>
          <p style={{ color: 'var(--c-text-secondary)', marginTop: 8, fontSize: '0.95rem' }}>
            Cost: <strong style={{ color: 'var(--c-accent-primary)' }}>{reward.points} points</strong>
          </p>
          <div style={{
            marginTop: 20,
            padding: 16,
            background: canAfford ? 'var(--c-accent-soft)' : 'rgba(214, 64, 69, 0.1)',
            borderRadius: 12,
            fontSize: '0.95rem',
            fontWeight: 600,
            border: '2px solid ' + (canAfford ? 'var(--c-accent-primary)' : 'var(--c-danger)'),
            color: canAfford ? 'var(--c-accent-primary)' : 'var(--c-danger)'
          }}>
            Your Balance: <strong>{userPoints} points</strong>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            <button
              className="tab-pill"
              style={{
                flex: 1,
                border: '2px solid #e0e0e0',
                background: 'white',
                padding: '12px 24px',
                fontWeight: 600
              }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="tab-pill active"
              style={{
                flex: 1,
                opacity: canAfford ? 1 : 0.5,
                cursor: canAfford ? 'pointer' : 'not-allowed',
                border: 'none',
                padding: '12px 24px',
                fontWeight: 600
              }}
              disabled={!canAfford}
              onClick={() => onRedeem(reward)}
            >
              Confirm
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const CreatePostModal = ({ isOpen, onClose, onPost }) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!text.trim() && !imageFile) return;
    setIsSubmitting(true);

    const newPost = {
      id: 'p-new-' + Date.now(),
      user: { name: 'You', avatar: 'https://i.pravatar.cc/150?u=me', handle: '@you' },
      image: imagePreview || 'https://picsum.photos/seed/' + Date.now() + '/800/800',
      caption: text,
      likes: 0,
      comments: 0,
      isPlant: true,
      time: 'Just Now',
      tags: ['community']
    };

    onPost(newPost);
    setText('');
    setImageFile(null);
    setImagePreview(null);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{ maxWidth: '550px', background: 'white' }}
      >
        <div className="create-post-header" style={{ background: 'white' }}>
          <h2>Create New Post</h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: 8 }}>
            <X size={24} />
          </button>
        </div>

        <div className="create-post-body">
          <div className="user-preview-row">
            <img src="https://i.pravatar.cc/150?u=me" alt="You" className="author-avatar" />
            <span className="author-name">You</span>
          </div>

          <textarea
            className="caption-input"
            placeholder="What's growing in your garden today?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />

          {!imagePreview ? (
            <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
              <div className="upload-icon-circle">
                <ImageIcon size={24} color="var(--c-accent-primary)" />
              </div>
              <span className="upload-text">Add Photo or Video</span>
              <span style={{ fontSize: '0.8rem', color: '#aaa', marginTop: 4 }}>Drag & drop or click to upload</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*,video/*"
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Preview" />
              <button className="remove-image-btn" onClick={removeImage}>
                <X size={18} />
              </button>
            </div>
          )}

          <div className="modal-footer-actions">
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={(!text.trim() && !imageFile) || isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Feed = ({ posts, onPostDeleted, onCommentAdded, userInfo, onLike, onBookmark }) => {
  const [expandedComments, setExpandedComments] = useState({});
  const [filter, setFilter] = useState('all'); // 'all', 'plants', 'challenge', 'tips'
  const [openMenuId, setOpenMenuId] = useState(null); // New state for menu

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await axios.delete(API_BASE + '/comments/' + commentId, getAuthHeaders());
      // Optimistic update
      const post = posts.find(p => (p._id === postId || p.id === postId));
      if (post && post.comments) {
        const newComments = post.comments.filter(c => c._id !== commentId);
        onCommentAdded(postId, newComments);
      }
    } catch (e) {
      console.error("Failed to delete comment", e);
      alert("Failed to delete comment");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        // Check if it's a real MongoDB ID (24 hex characters)
        const isRealId = /^[0-9a-fA-F]{24}$/.test(id);

        if (isRealId) {
          await axios.delete(`${API_BASE}/posts/${id}`);
        } else {
          console.log("Removing dummy post locally:", id);
        }

        if (onPostDeleted) onPostDeleted(id);

      } catch (e) {
        console.error("Delete failed", e);
        // If error is 404, it means post is already gone, so we should remove it locally anyway
        if (e.response && e.response.status === 404) {
          alert("Post was already deleted or not found. Removing from view.");
          if (onPostDeleted) onPostDeleted(id);
          setOpenMenuId(null);
          return;
        }

        const errorMsg = e.response?.data?.message || e.message;
        alert(`Failed to delete post: ${errorMsg}`);
      }
    }
    setOpenMenuId(null);
  };


  const handleLike = (id) => {
    if (onLike) onLike(id);
  };

  const toggleComments = async (id) => {
    if (!expandedComments[id]) {
      // Fetch comments when opening
      try {
        const res = await axios.get(API_BASE + '/community/posts/' + id + '/comments', getAuthHeaders());
        if (res.data.success) {
          onCommentAdded(id, res.data.comments);
        }
      } catch (e) { console.warn("Failed to load comments", e); }
    }
    setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (post) => {
    const url = window.location.origin + '/post/' + post.id;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard! 📋");
    });
  };

  const toggleBookmark = (id) => {
    if (onBookmark) onBookmark(id);
  };

  const filteredPosts = posts.filter(p => {
    if (filter === 'plants') return p.isPlant;
    if (filter === 'challenge') return p.tags.includes('challenge');
    return true;
  });

  return (
    <div className="feed-section">
      <div className="feed-tabs">
        {['all', 'plants', 'challenge', 'tips'].map(f => (
          <button
            key={f}
            className={'tab-pill ' + (filter === f ? 'active' : '')}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filter === 'challenge' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="challenge-banner"
          style={{
            background: 'linear-gradient(135deg, var(--c-accent-primary) 0%, #2D5A27 100%)',
            color: 'white',
            padding: '24px',
            borderRadius: '20px',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(45, 90, 39, 0.25)'
          }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Award size={20} color="#FFD700" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Challenge</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12 }}>#GreenThumbChallenge 🌿</h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem', lineHeight: 1.5, maxWidth: '80%' }}>
              Show off your plants and win <strong>500 points</strong>! The Growlify Team is looking for the most vibrant setups.
            </p>
          </div>
          <Leaf style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.15, transform: 'rotate(-15deg)' }} size={160} />
        </motion.div>
      )}

      <AnimatePresence>
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            className="post-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="post-header">
              <div className="post-author-info">
                <img src={post.user.avatar} className="author-avatar" alt="avatar" />
                <div>
                  <div className="author-name">{post.user.name}</div>
                  <div className="post-time">{post.time}</div>
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                {userInfo && (post.userId === userInfo._id || post.username === userInfo.name) && (
                  <>
                    <button className="action-btn" onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}>
                      <MoreHorizontal size={20} />
                    </button>
                    {openMenuId === post.id && (
                      <div className="post-menu-dropdown">
                        <button onClick={() => handleDelete(post.id || post._id)} className="menu-item delete">
                          Delete Post
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <img src={post.image} className="post-media" alt="Post content" loading="lazy" />

            <div className="post-content-wrap">
              <div className="action-bar">
                <div className="action-group">
                  <button className="action-btn" onClick={() => handleLike(post._id || post.id)}>
                    <Heart
                      size={26}
                      fill={post.isLiked ? "#D64045" : "none"}
                      color={post.isLiked ? "#D64045" : "currentColor"}
                      style={{ transition: 'all 0.2s', transform: post.isLiked ? 'scale(1.1)' : 'scale(1)' }}
                    />
                  </button>
                  <button className="action-btn" onClick={() => toggleComments(post.id)}>
                    <MessageCircle size={26} />
                  </button>
                  <button className="action-btn" onClick={() => handleShare(post)}>
                    <Share2 size={26} />
                  </button>
                </div>
                <button className="action-btn" onClick={() => toggleBookmark(post._id || post.id)}>
                  <Bookmark
                    size={26}
                    fill={post.isSaved ? "currentColor" : "none"}
                  />
                </button>
              </div>

              <div className="like-count">
                {post.likes} likes
              </div>

              <div className="caption-area">
                <span className="caption-author">{post.user.handle}</span>
                {post.caption}
              </div>

              {post.tags && (
                <div className="tags-area">
                  {post.tags.map(t => (
                    <span key={t} className="plant-tag">#{t}</span>
                  ))}
                </div>
              )}

              <AnimatePresence>
                {expandedComments[post.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden', marginTop: 12, paddingTop: 12, borderTop: '1px solid #eee' }}
                  >
                    <div className="comments-list" style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: 12 }}>
                      {Array.isArray(post.comments) && post.comments.length > 0 ? (
                        post.comments.map((c, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <div style={{ fontSize: '0.9rem', color: '#555' }}>
                              <strong>{c.username || c.user}</strong> {c.content || c.text}
                            </div>
                            {userInfo && (String(c.userId) === String(userInfo._id) || c.username === userInfo.name) && (
                              <button
                                onClick={() => c._id && handleDeleteComment(post._id || post.id, c._id)}
                                style={{ border: 'none', background: 'none', color: '#ff6b6b', cursor: 'pointer', padding: 2 }}
                                title="Delete comment"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: 8 }}>No comments yet. Be the first!</div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="comment-inline-input"
                        onKeyDown={async (e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            const val = e.target.value;
                            e.target.value = '';
                            const targetId = post._id || post.id;
                            const isDummy = post.id && post.id.startsWith('p') && !post._id;

                            try {
                              const res = await axios.post(API_BASE + '/community/posts/' + targetId + '/comment', {
                                content: val
                              }, getAuthHeaders());
                              if (res.status === 201 && res.data.success) {
                                // Fetch updated comments
                                const commentsRes = await axios.get(API_BASE + '/community/posts/' + targetId + '/comments', getAuthHeaders());
                                if (commentsRes.data.success) {
                                  onCommentAdded(targetId, commentsRes.data.comments);
                                }
                              }
                            } catch (err) {
                              console.error("Failed to add comment to backend", err);
                              if (isDummy) {
                                // For dummy posts, just update local state so user sees it
                                const newComment = { username: 'You', content: val, createdAt: new Date() };
                                const existingComments = Array.isArray(post.comments) ? post.comments : [];
                                const updatedComments = [...existingComments, newComment];
                                onCommentAdded(targetId, updatedComments);
                                alert("Note: This is a demo post, your comment is only visible locally. Create a real post to persist comments! 🌿");
                              } else {
                                const msg = err.response?.data?.message || err.message || "Unknown error";
                                alert("Failed to add comment: " + msg);
                              }
                            }
                          }
                        }}
                      />
                    </div >
                  </motion.div >
                )}
              </AnimatePresence >
            </div >
          </motion.div >
        ))}
      </AnimatePresence >
    </div >
  );
};

const Sidebar = ({ userPoints, onOpenRewards }) => {

  return (
    <div className="sticky-sidebar">
      <div className="sidebar-card">
        <div className="sidebar-title">Your Garden Stats</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="stat-box">
            <div className="stat-val">14</div>
            <div className="stat-label">Day Streak</div>
          </div>
          <div className="stat-box">
            <div className="stat-val">{userPoints}</div>
            <div className="stat-label">Points</div>
          </div>
        </div>
        <button
          className="tab-pill active"
          style={{ width: '100%', marginTop: 20, border: 'none' }}
          onClick={onOpenRewards}
        >
          Redeem Rewards
        </button>
      </div>

      <div className="sidebar-card">
        <div className="sidebar-title">Top Gardeners</div>
        <div className="leaderboard-list">
          {['akash', 'green_queen', 'soil_master'].map((u, i) => (
            <div key={u} className="leader-item">
              <div className="leader-rank">{i + 1}</div>
              <div style={{ flex: 1, fontWeight: 600 }}>{u}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--c-accent-secondary)' }}>{1200 - (i * 200)} pts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PersonalActivity = ({ onOpenShorts }) => {
  const [activeTab, setActiveTab] = useState('liked'); // 'liked', 'saved', 'commented', 'shorts'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      try {
        let endpoint = '';
        switch (activeTab) {
          case 'liked': endpoint = '/community/activity/liked'; break;
          case 'saved': endpoint = '/community/activity/saved'; break;
          case 'commented': endpoint = '/community/activity/commented'; break;
          case 'shorts': endpoint = '/community/activity/shorts-viewed'; break;
          default: break;
        }

        if (!endpoint) return;

        const res = await axios.get(API_BASE + endpoint, getAuthHeaders());
        if (res.data && res.data.success) {
          if (activeTab === 'shorts') {
            setItems(res.data.shorts);
          } else {
            setItems(res.data.posts);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch activity:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [activeTab]);

  return (
    <div className="personal-activity">
      <div className="activity-tabs">
        {['liked', 'saved', 'commented', 'shorts'].map(tab => (
          <button
            key={tab}
            className={`activity-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Loading...</div>
      ) : items.length === 0 ? (
        <div className="activity-empty">
          <div className="activity-empty-icon">🍃</div>
          <p>No activity yet in this section.</p>
        </div>
      ) : (
        <div className="activity-grid">
          {items.map(item => (
            <div
              key={item._id}
              className="activity-post-card"
              onClick={() => {
                if (activeTab === 'shorts') {
                  onOpenShorts(item._id); // Open shorts viewer
                } else {
                  // For posts, maybe visually expand? For now just static or maybe scroll to feed?
                  // Ideally we would open a post modal or navigate to it.
                  // Current implementation of Feed doesn't support jumping to post easily without full feed render.
                  // We'll just show it statically for now.
                }
              }}
            >
              {activeTab === 'shorts' ? (
                <div style={{ position: 'relative', height: 250 }}>
                  <img src={item.thumbnail || item.videoUrl} className="activity-post-image" style={{ height: '100%' }} alt="Short" />
                  <div style={{ position: 'absolute', bottom: 8, left: 8, color: 'white', fontWeight: 600, fontSize: '0.8rem' }}>
                    <Play size={12} fill="white" /> {item.viewsCount}
                  </div>
                </div>
              ) : (
                <>
                  {item.images && item.images.length > 0 && (
                    <img src={item.images[0]} className="activity-post-image" alt="Post" />
                  )}
                  <div className="activity-post-content">
                    <div className="activity-post-text">{item.content}</div>
                    <div className="activity-post-meta">
                      <span>{activeTab === 'liked' ? 'Liked' : activeTab === 'saved' ? 'Saved' : 'Commented'} {timeAgo(new Date(item.createdAt || Date.now()))}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function Community() {
  const [activeView, setActiveView] = useState('feed'); // 'feed' | 'activity'
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]); // Start empty, fetch from backend
  const [shorts, setShorts] = useState([]); // Real shorts data
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [userPoints, setUserPoints] = useState(1250);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [redemptionSuccess, setRedemptionSuccess] = useState(false);

  // Shorts Viewer State
  const [selectedReelId, setSelectedReelId] = useState(null);

  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [loginNotification, setLoginNotification] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('userInfo');
    if (userStr) {
      try {
        setUserInfo(JSON.parse(userStr));
      } catch (e) { console.error(e); }
    }
  }, []);

  const handleLike = async (id) => {
    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p._id === id || p.id === id) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));

    try {
      await axios.post(API_BASE + '/community/posts/' + id + '/like', {}, getAuthHeaders());
    } catch (e) {
      console.warn("Like failed", e);
      // Revert on error
      setPosts(prev => prev.map(p => {
        if (p._id === id || p.id === id) {
          const isLiked = !p.isLiked;
          return { ...p, isLiked, likes: isLiked ? p.likes + 1 : p.likes - 1 };
        }
        return p;
      }));
    }
  };

  const handleBookmark = async (id) => {
    const previousPosts = [...posts];
    setPosts(prev => prev.map(p =>
      (p._id === id || p.id === id) ? { ...p, isSaved: !p.isSaved } : p
    ));
    try {
      await axios.post(API_BASE + '/community/posts/' + id + '/save', {}, getAuthHeaders());
    } catch (e) {
      console.warn("Save failed", e);
      setPosts(previousPosts);
    }
  };

  useEffect(() => {
    // Add interceptor to handle 401 (Unauthorized) responses
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          // Token is invalid/expired (e.g., DB was reset)
          console.warn("Session expired or invalid token. Logging out...");
          localStorage.removeItem('userInfo');
          localStorage.removeItem('token');
          // Show centered notification instead of auto-redirect
          setLoginNotification("Please login to continue using community features 🌿");
        }
        return Promise.reject(error);
      }
    );

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_BASE + '/community/posts?limit=20', {
          timeout: 5000,
          ...getAuthHeaders()
        });
        let displayPosts = [...DUMMY_POSTS]; // Always start with dummies for fallback

        if (res.data && res.data.success && res.data.posts) {
          // Normalize: map backend posts to match UI structure
          const fetchedPosts = res.data.posts.map(p => ({
            id: p._id,
            _id: p._id,
            user: {
              name: p.username,
              avatar: p.userAvatar || 'https://i.pravatar.cc/150?u=' + p.username,
              handle: '@' + p.username.toLowerCase().replace(/\s/g, '_')
            },
            image: p.images && p.images[0] ? p.images[0] : 'https://picsum.photos/800',
            caption: p.content,
            likes: p.likesCount || 0,
            comments: [], // Will be loaded when user expands
            isPlant: true,
            time: timeAgo(new Date(p.createdAt)),
            tags: ['community'],
            isLiked: p.isLiked,
            isSaved: p.isSaved
          }));
          displayPosts = [...fetchedPosts, ...DUMMY_POSTS];
        }
        setPosts(displayPosts);
      } catch (err) {
        console.warn('Failed to fetch posts:', err);
        setPosts(DUMMY_POSTS);
      } finally {
        setLoading(false);
      }
    };

    // Fetch Shorts
    const fetchShorts = async () => {
      try {
        const res = await axios.get(API_BASE + '/community/shorts', {
          timeout: 5000,
          ...getAuthHeaders()
        });
        if (res.data && res.data.success && res.data.shorts && res.data.shorts.length > 0) {
          const fetchedShorts = res.data.shorts.map(s => ({
            id: s._id,
            user: s.username,
            avatar: s.userAvatar || 'https://i.pravatar.cc/150?u=' + s.username,
            video: s.videoUrl,
            poster: s.thumbnail || s.videoUrl,
            caption: s.caption,
            likes: s.likesCount || 0,
            isPlant: true
          }));
          setShorts([...fetchedShorts, ...DUMMY_REELS]);
        } else {
          setShorts(DUMMY_REELS);
        }
      } catch (err) {
        console.warn('Failed to fetch shorts:', err);
        setShorts(DUMMY_REELS);
      }
    };

    fetchPosts();
    fetchShorts();
    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const notifInterval = setInterval(fetchNotifications, 30000);
    return () => {
      axios.interceptors.response.eject(interceptor);
      clearInterval(notifInterval);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(API_BASE + '/community/notifications', getAuthHeaders());
      if (res.data && res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.warn('Failed to fetch notifications:', err);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(API_BASE + `/community/notifications/${notificationId}/read`, {}, getAuthHeaders());
      setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put(API_BASE + '/community/notifications/read-all', {}, getAuthHeaders());
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.warn('Failed to mark all as read:', err);
    }
  };

  const handleNewPost = async (postData) => {
    // Optimistically add to UI
    setPosts([postData, ...posts]);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    try {
      const res = await axios.post(API_BASE + '/community/posts', {
        content: postData.caption,
        images: postData.image ? [postData.image] : []
      }, getAuthHeaders());
      // Replace the temporary post with the one from server
      if (res.data && res.data.success) {
        const serverPost = res.data.post;
        const normalizedPost = {
          id: serverPost._id,
          _id: serverPost._id,
          user: {
            name: serverPost.username,
            avatar: serverPost.userAvatar || 'https://i.pravatar.cc/150?u=me',
            handle: '@' + serverPost.username.toLowerCase().replace(/\s/g, '_')
          },
          image: serverPost.images[0] || postData.image,
          caption: serverPost.content,
          likes: 0,
          comments: [],
          isPlant: true,
          time: 'Just now',
          tags: ['community']
        };
        setPosts(prev => [normalizedPost, ...prev.filter(p => p.id !== postData.id)]);
      }
      setUserPoints(prev => prev + 50);
    } catch (err) {
      console.error("Failed to save post", err);
      alert('Failed to create post. Please try again.');
      // Remove optimistic post on error
      setPosts(prev => prev.filter(p => p.id !== postData.id));
    }
  };

  const handleRedeem = async (reward) => {
    // Optimistic UI update
    setUserPoints(prev => prev - reward.points);
    setRedemptionSuccess(true);
    setShowConfetti(true);

    try {
      const userInfoStr = localStorage.getItem('userInfo');
      let token = null;
      if (userInfoStr) {
        try {
          token = JSON.parse(userInfoStr).token;
        } catch (e) {
          console.error("Error parsing user info", e);
        }
      }

      if (token) {
        await axios.post(API_BASE + '/rewards/redeem',
          {
            rewardName: reward.name,
            pointsCost: reward.points
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        console.log("Redemption email request sent successfully.");
      } else {
        console.warn("No auth token found. Skipping email notification.");
      }
    } catch (err) {
      console.error("Failed to send reward email:", err);
      // We don't roll back the UI points here to keep the experience smooth for the user
      // unless it's a critical financial transaction, but for this gamification it's okay.
    }

    setTimeout(() => {
      setShowConfetti(false);
      setRedemptionSuccess(false);
      setIsRewardsOpen(false);
      setSelectedReward(null);
    }, 2500);
  };

  return (
    <div className="community-wrapper">
      {/* Shorts Viewer Overlay */}
      <AnimatePresence>
        {selectedReelId && (
          <ShortsViewer
            initialReelId={selectedReelId}
            shorts={shorts}
            onClose={() => setSelectedReelId(null)}
          />
        )}
      </AnimatePresence>

      {showConfetti && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
          <Confetti recycle={false} numberOfPieces={300} gravity={0.3} width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}

      {/* Login Notification Modal */}
      <AnimatePresence>
        {loginNotification && (
          <div
            className="modal-overlay"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 10002,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                background: 'white',
                color: '#333',
                padding: '32px',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(211, 47, 47, 0.1)',
                zIndex: 10003,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                textAlign: 'center',
                width: '90%',
                maxWidth: '400px',
                border: '1px solid rgba(255, 205, 210, 0.5)'
              }}
            >
              <div style={{
                background: '#FFEBEE',
                padding: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(211, 47, 47, 0.15)'
              }}>
                <Leaf size={40} color="#D32F2F" strokeWidth={2.5} />
              </div>

              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 800, color: '#2c3e50' }}>
                  Login Required
                </h3>
                <p style={{ margin: 0, fontSize: '1.05rem', color: '#666', lineHeight: 1.5 }}>
                  {loginNotification}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px' }}>
                <button
                  onClick={() => setLoginNotification(null)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    color: '#666',
                    border: '2px solid #eee',
                    padding: '12px 20px',
                    borderRadius: '16px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#f5f5f5';
                    e.currentTarget.style.color = '#333';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#666';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => window.location.href = '/auth'}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '16px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(211, 47, 47, 0.3)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(211, 47, 47, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(211, 47, 47, 0.3)';
                  }}
                >
                  Login Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <NotificationDropdown
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      <div className="community-container">

        <HeroSection onOpenNotifications={() => setIsNotificationsOpen(true)} notificationCount={unreadCount} />

        <ReelsRail shorts={shorts} onOpenShorts={setSelectedReelId} />

        <div className="create-post-container">
          <div className="create-post-trigger" onClick={() => setIsModalOpen(true)}>
            <img src="https://i.pravatar.cc/150?u=me" className="trigger-avatar" alt="Me" />
            <div className="trigger-input">Share something with the community...</div>
            <Plus size={24} color="var(--c-accent-primary)" />
          </div>
        </div>

        <div className="main-grid">
          <div className="feed-column">
            <div className="feed-tabs">
              <button
                className={`tab-pill ${activeView === 'feed' ? 'active' : ''}`}
                onClick={() => setActiveView('feed')}
              >
                Community Feed
              </button>
              <button
                className={`tab-pill ${activeView === 'activity' ? 'active' : ''}`}
                onClick={() => setActiveView('activity')}
              >
                My Activity
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--c-text-tertiary)' }}>
                Loading community...
              </div>
            ) : activeView === 'feed' ? (
              <Feed
                posts={posts}
                onPostDeleted={(deletedId) => {
                  setPosts(prev => prev.filter(p => (p._id !== deletedId && p.id !== deletedId)));
                }}
                onCommentAdded={(postId, newComments) => {
                  setPosts(prev => prev.map(p =>
                    (p._id === postId || p.id === postId) ? { ...p, comments: newComments } : p
                  ));
                }}
                userInfo={userInfo}
                onLike={handleLike}
                onBookmark={handleBookmark}
              />
            ) : (
              <PersonalActivity onOpenShorts={setSelectedReelId} />
            )}
          </div>

          <div className="sidebar-column">
            <Sidebar userPoints={userPoints} onOpenRewards={() => setIsRewardsOpen(true)} />
          </div>
        </div>
      </div>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPost={handleNewPost} />

      {isRewardsOpen && !selectedReward && (
        <div className="modal-overlay" onClick={() => setIsRewardsOpen(false)}>
          <motion.div className="modal-content" onClick={e => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="modal-header">
              Available Rewards
              <button onClick={() => setIsRewardsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '20px 24px' }}>
              <div className="reward-list-container">
                {REWARDS_DATA.map(reward => (
                  <div key={reward.id} className="reward-item" onClick={() => setSelectedReward(reward)}>
                    <span style={{ fontSize: '2rem' }}>{reward.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{reward.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--c-accent-primary)', fontWeight: 600 }}>{reward.points} Points</div>
                    </div>
                    <ChevronRight size={20} color="var(--c-accent-secondary)" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <RedeemModal isOpen={!!selectedReward} onClose={() => setSelectedReward(null)} reward={selectedReward} userPoints={userPoints} onRedeem={handleRedeem} />

      {redemptionSuccess && (
        <div className="toast-success">Success! Reward redeemed. Check your email. 🌿</div>
      )}
    </div>
  );
}
