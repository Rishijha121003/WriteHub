const router = require('express').Router();
const Post = require('../models/post.model');

// GET all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

// CREATE a new post
router.post('/', async (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: 'Error creating post' });
    }
});

// GET all posts by a specific author
router.get('/author/:authorName', async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.authorName }).sort({ createdAt: -1 });
        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this author' });
        }
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching posts by author' });
    }
});

// GET a single post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching post' });
    }
});

// UPDATE a post by ID
router.put('/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true }
        );
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: 'Error updating post' });
    }
});

// DELETE a post by ID
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting post' });
    }
});

module.exports = router;