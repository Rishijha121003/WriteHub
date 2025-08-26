const router = require('express').Router();
const Post = require('../models/post.model');
const authMiddleware = require('../middleware/auth.middleware');

// ==========================================================
// === PUBLIC ROUTES (Inmein login zaroori nahi hai) ===
// ==========================================================

// GET all posts (Pagination ke saath)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; // All Posts page par 10 dikhayenge
        const skip = (page - 1) * limit;

        const totalPosts = await Post.countDocuments();
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            posts: posts,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page
        });
    } catch (err) {
        console.error("Error fetching paginated posts:", err);
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

// GET all posts by a specific author
router.get('/author/:authorName', async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.authorName }).sort({ createdAt: -1 });
        if (!posts) { // !posts || posts.length === 0 se behtar hai
            return res.status(404).json({ message: 'No posts found for this author' });
        }
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching posts by author' });
    }
});

// GET top 5 popular posts
router.get('/stats/popular', async (req, res) => {
    try {
        const popularPosts = await Post.find().sort({ views: -1 }).limit(5);
        res.json(popularPosts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching popular posts' });
    }
});

// GET total post count for Admin dashboard
router.get('/stats/count', async (req, res) => {
    try {
        const count = await Post.countDocuments();
        res.json({ totalPosts: count });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching post count' });
    }
});

// GET a single post by ID (and increment view count)
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching post' });
    }
});


// ==========================================================
// === PROTECTED ROUTES (Inmein login zaroori hai) ===
// ==========================================================

// CREATE a new post
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            author: req.user.username
        });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        console.error("Create Post Error:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error while creating post' });
    }
});

// UPDATE a post by ID
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.author.toLowerCase() !== req.user.username.toLowerCase() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. You do not have permission.' });
        }

        const { title, content } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: 'Error updating post' });
    }
});

// DELETE a post by ID
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.author.toLowerCase() !== req.user.username.toLowerCase() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. You do not have permission.' });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error("Delete Post Error:", err);
        res.status(500).json({ message: 'Error deleting post' });
    }
});

module.exports = router;