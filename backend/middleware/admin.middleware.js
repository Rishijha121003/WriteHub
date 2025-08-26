/**
 * Yeh middleware check karta hai ki logged-in user ka role 'admin' hai ya nahi.
 * Yeh hamesha authMiddleware ke baad use hota hai.
 * Agar user admin hai, toh request ko aage badhne deta hai.
 * Agar nahi, toh error bhej deta hai.
 */
const adminMiddleware = (req, res, next) => {
    // authMiddleware pehle hi req.user ko set kar chuka hota hai
    if (req.user && req.user.role === 'admin') {
        next(); // Agar user admin hai, toh aage badhne do
    } else {
        // Agar user admin nahi hai
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

module.exports = adminMiddleware;
