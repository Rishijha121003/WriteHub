const router = require('express').Router();
const User = require('../models/user.model');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

// GET all users (Sirf Admin hi dekh sakta hai)
router.get('/', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users.' });
    }
});

// DELETE a user by ID (Sirf Admin hi delete kar sakta hai)
router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id);
        if (!userToDelete) return res.status(404).json({ message: 'User not found.' });
        if (userToDelete.role === 'admin') return res.status(400).json({ message: 'Cannot delete an admin account.' });

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: `User '${userToDelete.username}' deleted successfully.` });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: 'Error deleting user.' });
    }
});

module.exports = router;