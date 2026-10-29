const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');

// مسیرهای ثبت‌نام و ورود
router.post('/register', register);
router.post('/login', login);

module.exports = router;