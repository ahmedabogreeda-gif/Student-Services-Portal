const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
    receiptNumber: { type: String, unique: true, required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    receiptImage: { filename: String, path: String, size: Number },
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    verifiedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: '' },
    bankName: { type: String, default: 'الراجحي' },
    transactionDate: { type: Date, default: Date.now }
}, { timestamps: true });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.pre('save', async function(next) {
    if (!this.receiptNumber) { const count = await mongoose.model('Payment').countDocuments(); this.receiptNumber = `R-${(count + 301).toString()}`; }
    next();
});
module.exports = mongoose.model('Payment', paymentSchema);
