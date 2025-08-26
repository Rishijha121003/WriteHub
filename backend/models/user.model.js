const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Role sirf in do values mein se ek ho sakta hai
        default: 'user'         // Naya user hamesha 'user' hi banega
    },
}, { timestamps: true });

// Yeh line aapki file mein shayad missing thi
const User = mongoose.model('User', userSchema);

module.exports = User;
