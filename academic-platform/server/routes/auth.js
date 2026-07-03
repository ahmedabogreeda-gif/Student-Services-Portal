const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, generateToken } = require('../middleware/auth');

router.post('/register', [
    body('firstName').trim().notEmpty().withMessage('الاسم الأول مطلوب'),
    body('lastName').trim().notEmpty().withMessage('الاسم الأخير مطلوب'),
    body('email').isEmail().withMessage('بريد إلكتروني غير صالح'),
    body('phone').matches(/^05\d{8}$/).withMessage('رقم جوال غير صالح'),
    body('password').isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'خطأ في البيانات', errors: errors.array() });
        const { firstName, lastName, email, phone, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: 'البريد الإلكتروني مستخدم بالفعل' });
        const user = await User.create({ firstName, lastName, email, phone, password });
        const token = generateToken(user._id);
        res.status(201).json({ success: true, message: 'تم إنشاء الحساب بنجاح', token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, role: user.role } });
    } catch (error) { res.status(500).json({ success: false, message: 'خطأ في الخادم', error: error.message }); }
});

router.post('/login', [
    body('email').isEmail().withMessage('بريد إلكتروني غير صالح'),
    body('password').notEmpty().withMessage('كلمة المرور مطلوبة')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'خطأ في البيانات', errors: errors.array() });
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(401).json({ success: false, message: 'بريد إلكتروني أو كلمة مرور غير صحيحة' });
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'بريد إلكتروني أو كلمة مرور غير صحيحة' });
        if (!user.isActive) return res.status(401).json({ success: false, message: 'الحساب معطل، تواصل مع الدعم' });
        const token = generateToken(user._id);
        res.json({ success: true, message: 'تم تسجيل الدخول بنجاح', token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, role: user.role, stats: user.stats } });
    } catch (error) { res.status(500).json({ success: false, message: 'خطأ في الخادم', error: error.message }); }
});

router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ success: true, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, stats: user.stats, createdAt: user.createdAt } });
    } catch (error) { res.status(500).json({ success: false, message: 'خطأ في الخادم' }); }
});

router.put('/profile', protect, async (req, res) => {
    try {
        const { firstName, lastName, phone } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { firstName, lastName, phone }, { new: true, runValidators: true });
        res.json({ success: true, message: 'تم تحديث الملف الشخصي', user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone } });
    } catch (error) { res.status(500).json({ success: false, message: 'خطأ في الخادم' }); }
});

module.exports = router;
