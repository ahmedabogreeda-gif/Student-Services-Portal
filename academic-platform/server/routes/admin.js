const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/stats', protect, adminOnly, async (req, res) => {
    try {
        const stats = {
            totalStudents: await User.countDocuments({ role: 'student' }),
            totalOrders: await Order.countDocuments(),
            newOrders: await Order.countDocuments({ status: 'new' }),
            pendingReceipts: await Payment.countDocuments({ status: 'pending' }),
            completedOrders: await Order.countDocuments({ status: 'completed' }),
            totalRevenue: await Payment.aggregate([{ $match: { status: 'verified' } }, { $group: { _id: null, total: { $sum: '$amount' } } }])
        };
        res.json({ success: true, stats });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.get('/orders', protect, adminOnly, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = {}; if (status) query.status = status;
        const orders = await Order.find(query).populate('user', 'firstName lastName email phone').sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
        const total = await Order.countDocuments(query);
        res.json({ success: true, count: orders.length, total, pages: Math.ceil(total / limit), currentPage: page, orders });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.put('/orders/:id', protect, adminOnly, upload.single('deliveredFile'), async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        const updateData = { status, adminNotes };
        if (req.file) updateData.$push = { deliveredFiles: { filename: req.file.filename, originalName: req.file.originalname, path: req.file.path, size: req.file.size } };
        const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
        req.app.get('io').to(order.user.toString()).emit('orderUpdate', { orderId: order._id, status: order.status, message: `تم تحديث حالة طلبك #${order.orderNumber}` });
        res.json({ success: true, message: 'تم تحديث الطلب', order });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.get('/students', protect, adminOnly, async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
        res.json({ success: true, count: students.length, students });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

module.exports = router;
