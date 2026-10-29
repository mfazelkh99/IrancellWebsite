require('dotenv').config();
const express = require('express');
const cors = require('cors');

// وارد کردن فایل مسیرها
const authRoutes = require('./routes/authRoutes');

const app = express();

// تنظیمات امنیتی و پردازش داده‌ها (Middlewares)
// از آنجا که فرانت‌اند روی پورت ۳۰۰۰ و بک‌اند روی پورت ۵۰۰۰ است، CORS باید فعال باشد
app.use(cors());
app.use(express.json());

// تعریف مسیرهای اصلی API
app.use('/api/auth', authRoutes);
const staffRoutes = require('./routes/staffRoutes');
app.use('/api/staff', staffRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// مسیر تست سلامت سرور
app.get('/', (req, res) => {
    res.send('سرور بک‌اند مرکز ارتباط با ایرانسل (کد ۶۵۰۱۶) روشن است 🚀');
});

// اجرای سرور
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});