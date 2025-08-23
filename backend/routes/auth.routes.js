const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// === SIGNUP (REGISTER) ===
router.post('/register', async (req, res) => {
    try {
        // 1. Check karein ki user ya email pehle se exist toh nahi karta
        const userExists = await User.findOne({ username: req.body.username });
        if (userExists) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // 2. Password ko Hash karein
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // 3. Naya user create karein (Email ke saath)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email, // <-- YEH ZAROORI BADLAV HAI
            password: hashedPassword // Hashed password save karein
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User registered successfully!', userId: savedUser._id });

    } catch (err) {
        console.error('Register Error:', err); // <-- console.error ko sahi jagah daala hai
        res.status(500).json({ message: 'Something went wrong.', error: err });
    }
});

// === LOGIN ===
router.post('/login', async (req, res) => {
    try {
        // 1. User ko dhoondhein
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        // 2. Password ko compare karein
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        // 3. Agar password match hota hai, toh JWT create karein aur send karein
        const tokenPayload = { id: user._id, username: user.username };
        const token = jwt.sign(tokenPayload, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({
            message: 'Logged in successfully!',
            token: token,
            user: {
                id: user._id,
                username: user.username
            }
        });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Something went wrong.', error: err });
    }
});


module.exports = router;