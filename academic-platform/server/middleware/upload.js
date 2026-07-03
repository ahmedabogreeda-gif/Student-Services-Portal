const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUploadDirs = () => {
    const dirs = ['uploads/receipts', 'uploads/orders', 'uploads/delivered', 'uploads/avatars'];
    dirs.forEach(dir => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); });
};
createUploadDirs();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = 'uploads/';
        if (file.fieldname === 'receipt') uploadPath += 'receipts/';
        else if (file.fieldname === 'orderFiles') uploadPath += 'orders/';
        else if (file.fieldname === 'deliveredFile') uploadPath += 'delivered/';
        else if (file.fieldname === 'avatar') uploadPath += 'avatars/';
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = {
        'receipt': /jpeg|jpg|png|pdf/,
        'orderFiles': /jpeg|jpg|png|pdf|doc|docx|ppt|pptx/,
        'deliveredFile': /jpeg|jpg|png|pdf|doc|docx|ppt|pptx|zip|rar/,
        'avatar': /jpeg|jpg|png/
    };
    const allowed = allowedTypes[file.fieldname] || /jpeg|jpg|png|pdf/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('نوع الملف غير مسموح به!'));
};

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ success: false, message: 'حجم الملف كبير جداً! الحد الأقصى 10 ميجا' });
        return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
};

module.exports = { upload, handleUploadError };
