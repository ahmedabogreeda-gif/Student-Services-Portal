const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        if (!token) return res.status(401).json({ success: false, message: 'غير مصرح! يرجى تسجيل الدخول' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) return res.status(401).json({ success: false, message: 'المستخدم غير موجود' });
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'غير مصرح! التوكن غير صالح' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') { next(); }
    else { return res.status(403).json({ success: false, message: 'غير مسموح! هذه الصفحة للأدمن فقط' }); }
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

module.exports = { protect, adminOnly, generateToken };
