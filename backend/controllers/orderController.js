const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createOrder = async (req, res) => {
    try {
        const { type, targetNumber, details } = req.body;
        const userId = req.user.userId; // این آیدی از توکن کاربر لاگین‌شده می‌آید

        // ثبت درخواست جدید در دیتابیس
        const newOrder = await prisma.order.create({
            data: {
                userId,
                type, // مثال: MODEM, CORPORATE, SERVICES
                targetNumber,
                details,
                status: 'PENDING' // وضعیت پیش‌فرض: جدید
            }
        });

        res.status(201).json({ message: "درخواست شما با موفقیت ثبت شد.", order: newOrder });
    } catch (error) {
        console.error("Order Error:", error);
        res.status(500).json({ message: "خطا در ثبت درخواست", error: error.message });
    }
};