const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Route files ko import karna
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const userRoutes = require('./routes/user.routes'); // <-- Yeh line zaroori hai

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
const dbURI = 'mongodb://127.0.0.1:27017/WriteHubDB';
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch((err) => console.error('MongoDB connection error:', err));

// --- Use Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes); // <-- Yeh line zaroori hai

// Server ko start karna
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});