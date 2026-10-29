const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "دسترسی غیرمجاز. توکن ارسال نشده است." });

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
        req.user = verified; // شامل userId, phone, role
        next();
    } catch (error) {
        res.status(400).json({ message: "توکن نامعتبر است." });
    }
};