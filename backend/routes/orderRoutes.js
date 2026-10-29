const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createOrder } = require('../controllers/orderController');

// کاربر برای ثبت سفارش باید حتماً لاگین باشد (توکن داشته باشد)
router.use(authMiddleware);

// مسیر ثبت سفارش جدید
router.post('/', createOrder);

module.exports = router;