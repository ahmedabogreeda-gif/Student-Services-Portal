const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
    try {
        const { receiverId, orderId, content } = req.body;
        const message = await Message.create({ sender: req.user.id, receiver: receiverId, order: orderId || null, content });
        req.app.get('io').to(receiverId).emit('newMessage', message);
        res.status(201).json({ success: true, message });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.get('/:userId', protect, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [{ sender: req.user.id, receiver: req.params.userId }, { sender: req.params.userId, receiver: req.user.id }]
        }).populate('sender', 'firstName lastName role').populate('receiver', 'firstName lastName role').sort({ createdAt: 1 });
        await Message.updateMany({ sender: req.params.userId, receiver: req.user.id, isRead: false }, { isRead: true, readAt: new Date() });
        res.json({ success: true, messages });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.get('/unread/count', protect, async (req, res) => {
    try {
        const count = await Message.countDocuments({ receiver: req.user.id, isRead: false });
        res.json({ success: true, unreadCount: count });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

module.exports = router;
