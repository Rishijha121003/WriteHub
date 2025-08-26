const jwt = require('jsonwebtoken');

/**
 * Yeh middleware check karta hai ki request ke saath valid JWT token hai ya nahi.
 * Agar token valid hai, toh yeh user ki information ko req.user mein daal deta hai.
 * Agar token nahi hai ya invalid hai, toh yeh error bhej deta hai.
 */
const authMiddleware = (req, res, next) => {
    // Header se token nikalna (format: "Bearer <TOKEN>")
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token format is incorrect.' });
    }

    try {
        // Token ko verify karna
        const decoded = jwt.verify(token, 'your_jwt_secret');

        // Verified user ki information ko request object mein daalna
        // taaki aage ke routes iska use kar sakein
        req.user = decoded;

        next(); // Sab theek hai, ab agle function (main route logic) par jaao
    } catch (err) {
        // Agar token expire ho gaya hai ya galat hai
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;