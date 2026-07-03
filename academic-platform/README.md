# 🎓 منصة أكاديمية — Academic Platform

منصة متكاملة لاستلام الواجبات والأبحاث والاختبارات مع نظام دفع وتحقق من الإيصالات.

## 📁 هيكل المشروع

```
academic-platform/
├── client/          ← الواجهة الأمامية (Frontend)
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── student-dashboard.html
│   ├── admin-dashboard.html
│   ├── css/style.css
│   └── js/app.js
│
└── server/          ← الخلفية (Backend)
    ├── server.js
    ├── package.json
    ├── .env
    ├── config/
    │   └── db.js
    ├── models/
    │   ├── User.js
    │   ├── Order.js
    │   ├── Payment.js
    │   └── Message.js
    ├── middleware/
    │   ├── auth.js
    │   └── upload.js
    └── routes/
        ├── auth.js
        ├── orders.js
        ├── payments.js
        ├── messages.js
        └── admin.js
```

## 🚀 خطوات التشغيل

### 1. تثبيت المتطلبات

**تثبيت Node.js:**
- حمل من: https://nodejs.org
- اختر LTS version

**تثبيت MongoDB:**
- حمل من: https://www.mongodb.com/try/download/community
- أو استخدم MongoDB Atlas (مجاني على السحابة)

### 2. تشغيل الخادم (Backend)

```bash
cd server
npm install
npm start
```

الخادم يعمل على: `http://localhost:5000`

### 3. تشغيل الواجهة (Frontend)

افتح ملف `client/index.html` مباشرة في المتصفح.

أو استخدم Live Server في VS Code.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | إنشاء حساب |
| POST | `/api/auth/login` | تسجيل الدخول |
| GET | `/api/auth/me` | بيانات المستخدم |
| POST | `/api/orders` | إنشاء طلب |
| GET | `/api/orders` | طلباتي |
| POST | `/api/payments` | رفع إيصال |
| GET | `/api/payments/pending` | إيصالات بانتظار التحقق |
| PUT | `/api/payments/:id/verify` | تأكيد الإيصال |
| PUT | `/api/payments/:id/reject` | رفض الإيصال |
| POST | `/api/messages` | إرسال رسالة |
| GET | `/api/admin/stats` | إحصائيات الأدمن |
| GET | `/api/admin/orders` | جميع الطلبات |

## 🎨 المميزات

- ✅ تسجيل دخول وإنشاء حساب
- ✅ صفحة شخصية لكل طالب
- ✅ رفع طلبات (واجب/بحث/اختبار/مشروع)
- ✅ نظام دفع بتحويل بنكي
- ✅ التحقق من الإيصالات (قبول/رفض)
- ✅ محادثات فورية (Socket.io)
- ✅ لوحة تحكم الأدمن الكاملة
- ✅ تقارير وإحصائيات
- ✅ تصميم متجاوب (Responsive)

## 📧 التواصل

للاستفسارات: support@academic.com
