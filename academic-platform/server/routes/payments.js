const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.post('/', protect, upload.single('receipt'), async (req, res) => {
    try {
        const { orderId, amount } = req.body;
        const payment = await Payment.create({
            order: orderId, user: req.user.id, amount,
            receiptImage: req.file ? { filename: req.file.filename, path: req.file.path, size: req.file.size } : null
        });
        await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid', status: 'paid' });
        res.status(201).json({ success: true, message: 'تم رفع الإيصال بنجاح، بانتظار التحقق', payment });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.get('/my-receipts', protect, async (req, res) => {
    try {
        const receipts = await Payment.find({ user: req.user.id }).populate('order', 'orderNumber type subject').sort({ createdAt: -1 });
        res.json({ success: true, receipts });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.get('/pending', protect, adminOnly, async (req, res) => {
    try {
        const receipts = await Payment.find({ status: 'pending' }).populate('user', 'firstName lastName email phone').populate('order', 'orderNumber amount').sort({ createdAt: -1 });
        res.json({ success: true, count: receipts.length, receipts });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.put('/:id/verify', protect, adminOnly, async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, { status: 'verified', verifiedBy: req.user.id, verifiedAt: new Date() }, { new: true });
        await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'verified', status: 'in_progress' });
        res.json({ success: true, message: 'تم التحقق من الإيصال', payment });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.put('/:id/reject', protect, adminOnly, async (req, res) => {
    try {
        const { reason } = req.body;
        const payment = await Payment.findByIdAndUpdate(req.params.id, { status: 'rejected', rejectionReason: reason }, { new: true });
        await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'pending', status: 'new' });
        res.json({ success: true, message: 'تم رفض الإيصال', payment });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

module.exports = router;
