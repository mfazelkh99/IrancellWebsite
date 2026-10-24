"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type ModemCategory = "pocket" | "desktop";

interface ModemItem {
    id: number;
    category: ModemCategory;
    name: string;
    model: string;
    network: string;
    price: string;
    badge?: string;
    isHot?: boolean;
    isEco?: boolean;
    shortSpecs: {
        speed: string;
        secondSpec: string; // برای جیبی ظرفیت باتری، برای رومیزی پورت‌ها/کاربران
    };
    fullSpecs: {
        label: string;
        value: string;
    }[];
    description: string;
}

// لیست مودم‌های رسمی بازار ایرانسل (جیبی و رومیزی)
const modemsData: ModemItem[] = [
    // --- مودم‌های جیبی ---
    {
        id: 1,
        category: "pocket",
        name: "مودم جیبی 4G/4.5G ایرانسل",
        model: "FD-M60",
        network: "4.5G",
        price: "۳,۸۵۰,۰۰۰",
        badge: "پرفروش‌ترین جیبی",
        isHot: true,
        shortSpecs: {
            speed: "سرعت تا ۳۰۰ مگابیت بر ثانیه",
            secondSpec: "باتری ۳۰۰۰ میلی‌آمپر (۸ ساعت کارکرد)",
        },
        fullSpecs: [
            { label: "شبکه‌های قابل پشتیبانی", value: "3G / 4G / 4.5G (LTE Cat6)" },
            { label: "حداکثر سرعت دانلود", value: "تا ۳۰۰ مگابیت بر ثانیه" },
            { label: "ظرفیت باتری", value: "۳۰۰۰ میلی‌آمپر ساعت (نگهداری شارژ تا ۸ ساعت)" },
            { label: "تعداد کاربران همزمان", value: "اتصال تا ۳۲ کاربر از طریق Wi-Fi" },
            { label: "اقلام همراه", value: "سیم‌کارت هدیه ایرانسل + کابل شارژ Type-C" },
        ],
        description:
            "مودم همراه FD-M60 یکی از قوی‌ترین مودم‌های جیبی ایرانسل با پشتیبانی از فناوری 4.5G (تجمیع فرکانس) است که برای استفاده در سفر، خودرو و جابجایی‌های روزمره گزینه‌ای ایده‌آل محسوب می‌شود.",
    },
    {
        id: 2,
        category: "pocket",
        name: "مودم جیبی 4G ایرانسل",
        model: "LH96",
        network: "4G",
        price: "۲,۸۰۰,۰۰۰",
        badge: "اقتصادی و محبوب",
        isEco: true,
        shortSpecs: {
            speed: "سرعت تا ۱۵۰ مگابیت بر ثانیه",
            secondSpec: "باتری ۲۵۰۰ میلی‌آمپر + نمایشگر رنگی",
        },
        fullSpecs: [
            { label: "شبکه‌های قابل پشتیبانی", value: "3G / 4G (LTE Cat4)" },
            { label: "نمایشگر", value: "صفحه نمایش رنگی جهت نمایش آنتن، باتری و حجم مصرفی" },
            { label: "ظرفیت باتری", value: "۲۵۰۰ میلی‌آمپر ساعت" },
            { label: "تعداد کاربران همزمان", value: "تا ۱۶ کاربر همزمان" },
            { label: "سایر ویژگی‌ها", value: "پشتیبانی از کارت حافظه MicroSD" },
        ],
        description:
            "مودم جیبی LH96 با داشتن صفحه نمایش کاربردی و ابعاد بسیار خوش‌دست، انتخابی اقتصادی و مطمئن برای دانشجویان، تریدرها و استفاده شخصی در بیرون از منزل است.",
    },
    {
        id: 3,
        category: "pocket",
        name: "مودم همراه 4G ایرانسل",
        model: "E5576-320",
        network: "4G",
        price: "۳,۲۰۰,۰۰۰",
        badge: "کیفیت ساخت بالا",
        shortSpecs: {
            speed: "سرعت تا ۱۵۰ مگابیت بر ثانیه",
            secondSpec: "طراحی فوق باریک و سبک (وزن ۷۲ گرم)",
        },
        fullSpecs: [
            { label: "شبکه‌های قابل پشتیبانی", value: "3G / 4G LTE" },
            { label: "حداکثر سرعت دانلود", value: "۱۵۰ مگابیت بر ثانیه" },
            { label: "ظرفیت باتری", value: "۱۵۰۰ میلی‌آمپر (تا ۶ ساعت کارکرد مداوم)" },
            { label: "تعداد کاربران همزمان", value: "تا ۱۶ دستگاه همزمان" },
            { label: "مدیریت آسان", value: "پشتیبانی از اپلیکیشن مدیریت هوشمند روی موبایل" },
        ],
        description:
            "مودمی بسیار سبک و کم‌حجم با پایداری اتصال عالی که به راحتی در جیب قرار می‌گیرد و اینترنت پرسرعت همراه را در هر نقطه‌ای در اختیار شما می‌گذارد.",
    },

    // --- مودم‌های رومیزی (ثابت) ---
    {
        id: 4,
        category: "desktop",
        name: "مودم رومیزی 4.5G ایرانسل (TD-LTE/FD)",
        model: "TF-i60 H1",
        network: "4.5G / TD-LTE",
        price: "۵,۴۰۰,۰۰۰",
        badge: "پرفروش‌ترین مودم خانگی",
        isHot: true,
        shortSpecs: {
            speed: "سرعت تا ۳۰۰ مگابیت (دوگانه سوز FD و TD)",
            secondSpec: "۴ پورت شبکه LAN + وای‌فای دو بانده",
        },
        fullSpecs: [
            { label: "نوع شبکه", value: "پشتیبانی همزمان از سیم‌کارت‌های TD-LTE و سیم‌کارت معمولی 4.5G" },
            { label: "حداکثر سرعت دانلود", value: "۳۰۰ مگابیت بر ثانیه (Cat6)" },
            { label: "پورت‌های شبکه", value: "۴ پورت LAN گیگابیتی + ۱ پورت تلفن (RJ11)" },
            { label: "باند فرکانسی وای‌فای", value: "دو بانده (2.4GHz و 5GHz) با پوشش‌دهی وسیع" },
            { label: "تعداد کاربران همزمان", value: "تا ۶۴ کاربر همزمان" },
        ],
        description:
            "مودم افسانه‌ای TF-i60 یکی از بهترین مودم‌های رومیزی بازار ایران است که هم از سیم‌کارت‌های اینترنت ثابت (TD-LTE) با بسته‌های اقتصادی و هم از سیم‌کارت‌های موبایل پشتیبانی می‌کند.",
    },
    {
        id: 5,
        category: "desktop",
        name: "مودم رومیزی 4G ایرانسل",
        model: "FD-i40 E1",
        network: "4G / TD-LTE",
        price: "۳,۴۵۰,۰۰۰",
        badge: "اقتصادی و به‌صرفه",
        isEco: true,
        shortSpecs: {
            speed: "سرعت تا ۱۵۰ مگابیت بر ثانیه",
            secondSpec: "دارای پورت LAN + آنتن‌دهی قدرتمند داخلی",
        },
        fullSpecs: [
            { label: "شبکه‌های قابل پشتیبانی", value: "4G LTE / TD-LTE" },
            { label: "حداکثر سرعت", value: "۱۵۰ مگابیت بر ثانیه دانلود / ۵۰ مگابیت آپلود" },
            { label: "تعداد کاربران", value: "اتصال همزمان تا ۳۲ دستگاه" },
            { label: "پورت شبکه (LAN)", value: "دارد (مناسب اتصال به کامپیوتر، کارتخوان و دوربین مداربسته)" },
            { label: "اقلام همراه", value: "سیم‌کارت هدیه + آداپتور برق + کابل شبکه" },
        ],
        description:
            "گزینه‌ای بسیار خوش‌قیمت و بادوام برای مصارف خانگی، فروشگاه‌ها، اتصال به دستگاه‌های کارتخوان، دوربین‌های مداربسته و استفاده از بسته‌های به‌صرفه اینترنت ثابت.",
    },
    {
        id: 6,
        category: "desktop",
        name: "مودم رومیزی فوق‌پرسرعت 5G ایرانسل",
        model: "H155-380",
        network: "5G / 4.5G",
        price: "۱۴,۹۰۰,۰۰۰",
        badge: "نسل جدید 5G + Wi-Fi 6",
        isHot: true,
        shortSpecs: {
            speed: "سرعت فوق‌العاده تا ۳.۶ گیگابیت بر ثانیه",
            secondSpec: "مجهز به Wi-Fi 6 + اتصال تا ۱۲۸ کاربر",
        },
        fullSpecs: [
            { label: "فناوری شبکه", value: "نسل پنجم 5G و 4.5G / TD-LTE" },
            { label: "تکنولوژی وای‌فای", value: "Wi-Fi 6 دو بانده (AX3000) با پینگ فوق‌العاده پایین" },
            { label: "تعداد کاربران همزمان", value: "پشتیبانی از ۱۲۸ دستگاه به صورت همزمان" },
            { label: "پورت‌ها", value: "دارای پورت‌های شبکه گیگابیتی WAN/LAN" },
            { label: "کاربرد ویژه", value: "مناسب گیمینگ حرفه‌ای، شرکت‌ها، استریم و دانلودهای حجیم" },
        ],
        description:
            "جدیدترین و قدرتمندترین مودم 5G ایرانسل با پشتیبانی از فناوری Wi-Fi 6 که سرعتی فراتر از فیبر نوری را بدون نیاز به سیم‌کشی مخابراتی برای خانه و محل کار شما فراهم می‌کند.",
    },
];

// آیکون‌های کمکی
const CheckBadgeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 shrink-0">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
);

const SpeedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-[#002B5E] shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const SpecIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-[#002B5E] shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5ZM3.75 18h15A2.25 2.25 0 0 0 21 15.75v-6a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 1.5 9.75v6A2.25 2.25 0 0 0 3.75 18Z" />
    </svg>
);

export default function ModemPage() {
    // استیت تب فعال (مودم‌های جیبی یا رومیزی)
    const [activeCategory, setActiveCategory] = useState<ModemCategory>("pocket");

    // استیت برای نمایش پاپ‌آپ جزئیات کامل مودم
    const [detailModem, setDetailModem] = useState<ModemItem | null>(null);

    // استیت برای نمایش پاپ‌آپ درخواست خرید
    const [buyModem, setBuyModem] = useState<ModemItem | null>(null);

    // شبیه‌سازی وضعیت لاگین کاربر
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const loggedInUser = {
        fullName: "علی محمدی",
        phone: "09131234567",
    };

    // فیلتر کردن مودم‌ها بر اساس تب انتخابی
    const filteredModems = modemsData.filter((m) => m.category === activeCategory);

    return (
        <div className="w-full flex-1 py-8 md:py-12 px-4">
            {/* کانتینر اصلی هم‌تراز با سایر صفحات (۸۰ درصد در دسکتاپ) */}
            <div className="w-full md:w-[90%] lg:w-[80%] mx-auto space-y-8">

                {/* هدر صفحه و دکمه بازگشت */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-8 bg-[#FFCC00] rounded-full shrink-0"></div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-extrabold text-[#002B5E]">
                                    خرید مودم‌های ایرانسل
                                </h1>
                                <p className="text-xs md:text-sm text-gray-500 mt-1">
                                    مودم‌های همراه (جیبی) و خانگی (رومیزی) با سیم‌کارت و بسته اینترنت هدیه
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/"
                            className="flex items-center gap-2 text-xs md:text-sm font-bold text-[#002B5E] bg-white px-4 py-2.5 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-gray-200 hover:border-[#FFCC00] transition-all shrink-0"
                        >
                            <span>بازگشت</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </Link>
                    </div>

                    {/* بج‌های اعتماد (ارسال و پرداخت در محل) */}
                    <div className="flex flex-wrap items-center gap-2.5 pr-5">
                        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-bold">
                            <CheckBadgeIcon />
                            <span>امکان پرداخت در محل (ویژه یزد)</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-bold">
                            <CheckBadgeIcon />
                            <span>ارسال سریع به سراسر کشور</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-bold">
                            <CheckBadgeIcon />
                            <span>تحویل به همراه سیم‌کارت فعال‌شده</span>
                        </div>
                    </div>
                </div>

                {/* تب‌های کپسولی بالای صفحه (مشابه طرح موبایل ارسالی) */}
                <div className="bg-white p-2 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.06)] border border-gray-200 max-w-xl mx-auto grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveCategory("pocket")}
                        className={`py-3.5 px-4 rounded-full font-extrabold text-xs sm:text-sm md:text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${activeCategory === "pocket"
                                ? "bg-[#FFCC00] text-[#002B5E] shadow-md"
                                : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/70"
                            }`}
                    >
                        {/* آیکون مودم جیبی */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                        </svg>
                        <span>مودم‌های جیبی</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveCategory("desktop")}
                        className={`py-3.5 px-4 rounded-full font-extrabold text-xs sm:text-sm md:text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${activeCategory === "desktop"
                                ? "bg-[#FFCC00] text-[#002B5E] shadow-md"
                                : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/70"
                            }`}
                    >
                        {/* آیکون مودم رومیزی */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
                        </svg>
                        <span>مودم‌های رومیزی</span>
                    </button>
                </div>

                {/* لیست کارت‌های مودم (تک ستونه در موبایل، ۲ ستونه در تبلت، ۳ ستونه در لپ‌تاپ) */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredModems.map((modem) => (
                        <div
                            key={modem.id}
                            className="bg-white rounded-[2rem] p-5 md:p-6 shadow-[0_0_25px_rgba(0,0,0,0.07)] hover:shadow-[0_0_35px_rgba(0,0,0,0.13)] border border-gray-200 hover:border-[#FFCC00] transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div>
                                {/* ردیف بالای کارت: تگ شبکه و بج وضعیت */}
                                <div className="flex items-center justify-between gap-2 mb-4">
                                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#002B5E]/10 text-[#002B5E]">
                                        شبکه {modem.network}
                                    </span>
                                    {modem.badge && (
                                        <span
                                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${modem.isHot
                                                    ? "bg-red-50 text-red-600 border border-red-200"
                                                    : modem.isEco
                                                        ? "bg-emerald-50 border border-emerald-200/80 text-emerald-900"
                                                        : "bg-[#FFCC00]/25 text-[#002B5E]"
                                                }`}
                                        >
                                            {modem.isHot ? `🔥 ${modem.badge}` : modem.badge}
                                        </span>
                                    )}
                                </div>

                                {/* بخش میانی کارت: مشخصات و تصویر مودم (دقیقاً مشابه طرح موبایل) */}
                                <div className="flex items-center justify-between gap-4 my-2">
                                    {/* سمت راست: عنوان، مدل و دو ویژگی کلیدی */}
                                    <div className="space-y-2 flex-1">
                                        <h2 className="text-base md:text-lg font-extrabold text-gray-800 leading-snug">
                                            {modem.name}
                                        </h2>
                                        <p className="text-xs font-bold text-gray-500">
                                            مدل <span dir="ltr" className="text-[#002B5E] font-extrabold">{modem.model}</span>
                                        </p>

                                        <div className="pt-2 space-y-1.5 text-xs text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <SpeedIcon />
                                                <span>{modem.shortSpecs.speed}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <SpecIcon />
                                                <span>{modem.shortSpecs.secondSpec}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* سمت چپ: تصویر مودم */}
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-2xl p-2 flex items-center justify-center shrink-0 border border-gray-100 group-hover:scale-105 transition-transform duration-300">
                                        <Image
                                            src="/images/home_icons/modem.png"
                                            alt={`${modem.name} مدل ${modem.model}`}
                                            width={120}
                                            height={120}
                                            className="w-full h-full object-contain drop-shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* بخش پایینی کارت: کادر قیمت، دو دکمه اقدام و متن راهنما */}
                            <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
                                {/* باکس قیمت مشابه طرح */}
                                <div className="inline-block border border-gray-300 rounded-xl px-4 py-1.5 bg-gray-50/60">
                                    <span className="text-base md:text-lg font-black text-gray-800">
                                        {modem.price} <span className="text-xs font-bold text-gray-600">تومان</span>
                                    </span>
                                </div>

                                {/* دو دکمه کنار هم (درخواست خرید زرد + مشاهده جزئیات تیره) */}
                                <div className="flex items-center gap-2.5 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setBuyModem(modem);
                                            setIsSubmitted(false);
                                        }}
                                        className="flex-1 py-3 px-3 bg-[#FFCC00] hover:bg-[#f2c200] text-[#002B5E] text-xs font-extrabold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer text-center"
                                    >
                                        درخواست خرید (تماس پرسنل)
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setDetailModem(modem)}
                                        className="py-3 px-4 bg-slate-600 hover:bg-[#002B5E] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                                    >
                                        مشاهده جزئیات
                                    </button>
                                </div>

                                {/* متن راهنمای زیر دکمه‌ها مطابق تصویر */}
                                <p className="text-[11px] text-gray-500 text-center pt-1">
                                    * پس از ثبت، کارشناسان ما جهت هماهنگی و ارسال با شما تماس می‌گیرند. *
                                </p>
                            </div>
                        </div>
                    ))}
                </section>

            </div>

            {/* پاپ‌آپ اول: مشاهده جزئیات کامل مودم */}
            {detailModem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] max-w-lg w-full p-6 md:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                            <div>
                                <span className="text-xs font-bold text-[#002B5E] bg-[#FFCC00]/30 px-2.5 py-0.5 rounded-full">
                                    مدل {detailModem.model}
                                </span>
                                <h3 className="text-lg md:text-xl font-extrabold text-[#002B5E] mt-2">
                                    {detailModem.name}
                                </h3>
                            </div>
                            <button
                                onClick={() => setDetailModem(null)}
                                className="p-2 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="my-5 space-y-4">
                            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                                {detailModem.description}
                            </p>

                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2.5">
                                <h4 className="text-xs font-extrabold text-[#002B5E] mb-2">مشخصات فنی دستگاه:</h4>
                                {detailModem.fullSpecs.map((spec, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row sm:justify-between text-xs border-b border-gray-200/60 last:border-0 pb-2 last:pb-0 gap-1">
                                        <span className="text-gray-500 font-semibold">{spec.label}:</span>
                                        <span className="text-gray-800 font-bold">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 gap-4">
                            <div>
                                <span className="text-[11px] text-gray-400 block">قیمت دستگاه:</span>
                                <span className="text-lg font-black text-[#002B5E]">
                                    {detailModem.price} <span className="text-xs font-normal">تومان</span>
                                </span>
                            </div>

                            <button
                                onClick={() => {
                                    const selected = detailModem;
                                    setDetailModem(null);
                                    setBuyModem(selected);
                                    setIsSubmitted(false);
                                }}
                                className="px-6 py-3 bg-[#FFCC00] hover:bg-[#f2c200] text-[#002B5E] text-xs md:text-sm font-extrabold rounded-xl shadow-md cursor-pointer"
                            >
                                ثبت درخواست خرید این مودم
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* پاپ‌آپ دوم: ثبت درخواست خرید مودم و بررسی لاگین */}
            {buyModem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] max-w-md w-full p-6 md:p-8 shadow-2xl border border-gray-100">
                        {!isSubmitted ? (
                            <div className="space-y-5 text-center">
                                <div className="w-14 h-14 bg-[#FFCC00]/20 text-[#002B5E] rounded-2xl flex items-center justify-center mx-auto font-bold">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                </div>

                                <h3 className="text-lg font-extrabold text-[#002B5E]">
                                    ثبت سفارش خرید مودم (پرداخت در محل / تلفنی)
                                </h3>

                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-xs md:text-sm text-right">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">محصول انتخابی:</span>
                                        <span className="font-bold text-gray-800">{buyModem.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">مدل دستگاه:</span>
                                        <span dir="ltr" className="font-black text-[#002B5E]">{buyModem.model}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">قیمت:</span>
                                        <span className="font-extrabold text-gray-800">{buyModem.price} تومان</span>
                                    </div>

                                    {isLoggedIn && (
                                        <div className="pt-2 mt-2 border-t border-gray-200 space-y-1 bg-emerald-50/60 p-2.5 rounded-xl">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-emerald-800">خریدار:</span>
                                                <span className="font-bold text-emerald-950">{loggedInUser.fullName}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-emerald-800">شماره تماس هماهنگی:</span>
                                                <span dir="ltr" className="font-bold text-emerald-950">{loggedInUser.phone}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {!isLoggedIn ? (
                                    <div className="space-y-4">
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                            برای ثبت سفارش و تماس همکاران ما جهت ارسال مودم، لطفاً ابتدا وارد حساب کاربری خود شوید.
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            <Link
                                                href="/profile"
                                                className="w-full py-3.5 bg-[#FFCC00] hover:bg-[#f2c200] text-[#002B5E] font-extrabold rounded-xl shadow-sm transition-all"
                                            >
                                                ورود / ثبت‌نام سریع
                                            </Link>
                                            <button
                                                onClick={() => setIsLoggedIn(true)}
                                                className="text-[11px] text-blue-600 underline cursor-pointer py-1"
                                            >
                                                (تست توسعه: فرض کن کاربر لاگین است)
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                            هیچ هزینه‌ای در سایت دریافت نمی‌شود. پس از تایید، کارشناسان مرکز ۶۵۰۱۶ جهت هماهنگی آدرس و نحوه تحویل با شما تماس می‌گیرند.
                                        </p>
                                        <button
                                            onClick={() => setIsSubmitted(true)}
                                            className="w-full py-3.5 bg-[#FFCC00] hover:bg-[#f2c200] text-[#002B5E] font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                                        >
                                            تایید و ثبت سفارش مودم
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={() => setBuyModem(null)}
                                    className="text-xs text-gray-400 hover:text-gray-600 font-semibold cursor-pointer"
                                >
                                    انصراف و بازگشت
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-5 text-center py-4">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-9 h-9">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-extrabold text-gray-800">
                                    درخواست خرید مودم با موفقیت ثبت شد!
                                </h3>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    سفارش شما برای <strong>{buyModem.name} (مدل {buyModem.model})</strong> در پنل کارشناسان مرکز ارتباط با ایرانسل ثبت گردید. همکاران ما به زودی جهت هماهنگی ارسال و فعال‌سازی سیم‌کارت با شما تماس می‌گیرند.
                                </p>
                                <button
                                    onClick={() => setBuyModem(null)}
                                    className="w-full py-3 bg-[#002B5E] text-white font-bold rounded-xl text-sm cursor-pointer"
                                >
                                    متوجه شدم
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}