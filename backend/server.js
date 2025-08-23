const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Route files ko import karna
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("✅ Server is running and connected to MongoDB!");
});
// Middleware
app.use(cors());

// ###################################################################
// ### YEH LINE SABSE ZAROORI HAI                                  ###
// ### Iske bina, server JSON nahi samajh paayega aur wahi CastError aayega ###
app.use(express.json());
// ###################################################################


// --- MongoDB Connection ---
const dbURI = 'mongodb://127.0.0.1:27017/WriteHubDB';
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch((err) => console.error('MongoDB connection error:', err));


// --- Use Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);


// Server ko start karna (sirf ek baar)
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});