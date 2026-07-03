const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.post('/', protect, upload.array('orderFiles', 5), async (req, res) => {
    try {
        const { type, typeName, subject, details, deadline, amount } = req.body;
        const orderData = { user: req.user.id, type, typeName, subject, details, deadline: new Date(deadline), amount: Number(amount) };
        if (req.files && req.files.length > 0) {
            orderData.files = req.files.map(file => ({ filename: file.filename, originalName: file.originalname, path: file.path, size: file.size }));
        }
        const order = await Order.create(orderData);
        await User.findByIdAndUpdate(req.user.id, { $inc: { 'stats.totalOrders': 1 } });
        res.status(201).json({ success: true, message: 'تم إنشاء الطلب بنجاح', order });
    } catch (error) { res.status(500).json({ success: false, message: 'خطأ في إنشاء الطلب', error: error.message }); }
});

router.get('/', protect, async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = { user: req.user.id };
        if (status) query.status = status;
        const orders = await Order.find(query).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
        const total = await Order.countDocuments(query);
        res.json({ success: true, count: orders.length, total, pages: Math.ceil(total / limit), currentPage: page, orders });
    } catch (error) { res.status(500).json({ success: false, message: 'خطأ في جلب الطلبات' }); }
});

router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email phone');
        if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'غير مصرح بالوصول' });
        res.json({ success: true, order });
    } catch (error) { res.status(500).json({ success: false, message: 'خطأ في جلب الطلب' }); }
});

router.put('/:id/rate', protect, async (req, res) => {
    try {
        const { score, comment } = req.body;
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id, status: 'completed' },
            { rating: { score, comment, createdAt: new Date() } }, { new: true }
        );
        if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود أو لم يتم تنفيذه بعد' });
        res.json({ success: true, message: 'تم إضافة التقييم بنجاح', order });
    } catch (error) { res.status(500).json({ success: false, message: 'خطأ في إضافة التقييم' }); }
});

module.exports = router;
