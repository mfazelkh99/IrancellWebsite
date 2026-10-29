const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// دریافت لیست درخواست‌ها بر اساس تب (فیلتر هوشمند)
exports.getDashboardOrders = async (req, res) => {
    try {
        const { tab } = req.query;
        let whereClause = {};

        // محاسبه ابتدا و انتهای تاریخ امروز برای تب "پیگیری‌های امروز"
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        switch (tab) {
            case 'new':
                whereClause = { status: 'PENDING' };
                break;
            case 'in-progress':
                whereClause = { status: 'IN_PROGRESS' };
                break;
            case 'today':
                whereClause = {
                    status: 'IN_PROGRESS',
                    // پیگیری‌هایی که تاریخشان تا پایان امروز است (شامل گذشته‌های فراموش‌شده)
                    followUpDate: { lte: todayEnd }
                };
                break;
            case 'completed':
                whereClause = { status: { in: ['COMPLETED', 'REJECTED'] } };
                break;
            default:
                whereClause = {}; // تب همه درخواست‌ها
        }

        const orders = await prisma.order.findMany({
            where: whereClause,
            include: {
                user: { select: { fullName: true, phone: true } },
                notes: {
                    orderBy: { createdAt: 'desc' },
                    take: 1, // فقط آخرین یادداشت را برای پیش‌نمایش می‌گیریم
                    include: { staff: { select: { fullName: true } } }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "خطا در دریافت اطلاعات", error: error.message });
    }
};

// تغییر وضعیت، ثبت یادداشت و تعیین تاریخ پیگیری بعدی
exports.processOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, noteText, followUpDate } = req.body;
        const staffId = req.user.userId; // دریافت آیدی کارمند از توکن

        // بروزرسانی سفارش
        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: {
                status: status,
                followUpDate: followUpDate ? new Date(followUpDate) : null,
            }
        });

        // ثبت یادداشت کارمند در دیتابیس CRM
        if (noteText) {
            await prisma.crmNote.create({
                data: {
                    orderId: parseInt(orderId),
                    staffId: staffId,
                    text: noteText
                }
            });
        }

        res.status(200).json({ message: "درخواست با موفقیت به‌روزرسانی شد.", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "خطا در پردازش درخواست", error: error.message });
    }
};