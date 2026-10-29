const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// API ثبت‌نام (Register)
exports.register = async (req, res) => {
    try {
        const { fullName, phone, password } = req.body;

        // ۱. بررسی ورودی‌ها
        if (!phone || !password || !fullName) {
            return res.status(400).json({ message: "لطفاً تمام فیلدها را پر کنید." });
        }

        // ۲. بررسی تکراری نبودن شماره موبایل
        const existingUser = await prisma.user.findUnique({ where: { phone } });
        if (existingUser) {
            return res.status(400).json({ message: "این شماره موبایل قبلاً در سیستم ثبت شده است." });
        }

        // ۳. هش کردن رمز عبور (برای امنیت در دیتابیس)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // ۴. ایجاد کاربر جدید در دیتابیس
        const newUser = await prisma.user.create({
            data: {
                fullName,
                phone,
                password: hashedPassword,
                // نقش کاربر به صورت پیش‌فرض USER است (طبق اسکیما)
            },
        });

        // ۵. تولید توکن لاگین بلافاصله بعد از ثبت‌نام
        const token = jwt.sign(
            { userId: newUser.id, phone: newUser.phone, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '7d' } // توکن تا ۷ روز معتبر است
        );

        res.status(201).json({
            message: "ثبت‌نام با موفقیت انجام شد.",
            token,
            user: {
                id: newUser.id,
                fullName: newUser.fullName,
                phone: newUser.phone,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "خطای سرور در ثبت‌نام", error: error.message });
    }
};

// API ورود (Login)
exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // ۱. بررسی ورودی‌ها
        if (!phone || !password) {
            return res.status(400).json({ message: "لطفاً شماره موبایل و رمز عبور را وارد کنید." });
        }

        // ۲. جستجوی کاربر در دیتابیس
        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) {
            return res.status(404).json({ message: "کاربری با این شماره موبایل یافت نشد." });
        }

        // ۳. مقایسه رمز عبور وارد شده با رمز هش‌شده در دیتابیس
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "رمز عبور اشتباه است." });
        }

        // ۴. تولید توکن برای کاربر لاگین‌شده
        const token = jwt.sign(
            { userId: user.id, phone: user.phone, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: "ورود موفقیت‌آمیز بود.",
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "خطای سرور در ورود", error: error.message });
    }
};