const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    content: { type: String, required: true, maxlength: 1000 },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
    attachments: [{ filename: String, path: String, type: String }]
}, { timestamps: true });
messageSchema.index({ sender: 1, receiver: 1 });
module.exports = mongoose.model('Message', messageSchema);
