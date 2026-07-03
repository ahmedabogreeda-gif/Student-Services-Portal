const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['homework', 'research', 'exam', 'project'], required: true },
    typeName: { type: String, required: true },
    subject: { type: String, required: true },
    details: { type: String, required: true, maxlength: 2000 },
    deadline: { type: Date, required: true },
    files: [{ filename: String, originalName: String, path: String, size: Number, uploadedAt: { type: Date, default: Date.now } }],
    status: { type: String, enum: ['new', 'paid', 'in_progress', 'completed', 'cancelled', 'rejected'], default: 'new' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'verified', 'refunded'], default: 'pending' },
    amount: { type: Number, required: true, min: 0 },
    deliveredFiles: [{ filename: String, originalName: String, path: String, uploadedAt: { type: Date, default: Date.now } }],
    adminNotes: { type: String, default: '' },
    rating: { score: { type: Number, min: 1, max: 5 }, comment: String, createdAt: Date }
}, { timestamps: true });
orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.pre('save', async function(next) {
    if (!this.orderNumber) { const count = await mongoose.model('Order').countDocuments(); this.orderNumber = `#${(count + 1001).toString()}`; }
    next();
});
module.exports = mongoose.model('Order', orderSchema);
