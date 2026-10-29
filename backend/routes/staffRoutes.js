const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getDashboardOrders, processOrder } = require('../controllers/staffController');

// بررسی می‌کنیم کاربر حتماً لاگین باشد
router.use(authMiddleware);

// دریافت لیست سفارشات
router.get('/orders', getDashboardOrders);

// پردازش یک سفارش خاص (تغییر وضعیت و ثبت نوت)
router.post('/orders/:orderId/process', processOrder);

module.exports = router;