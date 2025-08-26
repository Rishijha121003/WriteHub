const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP Route
router.post('/register', async (req, res) => {
    try {
        const userExists = await User.findOne({ username: req.body.username });
        if (userExists) return res.status(400).json({ message: 'Username already exists.' });

        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) return res.status(400).json({ message: 'Email is already registered.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User registered successfully!', userId: savedUser._id });
    } catch (err) {
        console.error('Register Error:', err);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

// LOGIN Route
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

        // Token aur User object, dono mein role add karna
        const tokenPayload = { id: user._id, username: user.username, role: user.role };
        const token = jwt.sign(tokenPayload, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({
            message: 'Logged in successfully!',
            token: token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role // <-- YEH LINE SABSE ZAROORI HAI
            }
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

module.exports = router;