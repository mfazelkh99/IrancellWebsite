"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

// --- تعریف نوع داده‌ها ---
interface UserData {
    id: number;
    fullName: string;
    phone: string;
}

interface ServiceDetail {
    id: string;
    title: string;
    shortDesc: string;
    description: string;
    useCases: string[];
    icon: React.ReactNode;
}

export default function ServicesPage() {
    const router = useRouter();

    const [user, setUser] = useState<UserData | null>(null);
    const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
    const [targetPhone, setTargetPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    // استیت‌های فرم احراز هویت درون مودال
    const [showAuthForm, setShowAuthForm] = useState(false);
    const [authTab, setAuthTab] = useState<"login" | "register">("login");
    const [authPhone, setAuthPhone] = useState("");
    const [authPassword, setAuthPassword] = useState("");
    const [authFullName, setAuthFullName] = useState("");
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // --- محتوای متنی خدمات (توضیحات و کاربردها) ---
    const servicesList: ServiceDetail[] = [
        {
            id: "revoke",
            title: "سلب امتیاز",
            shortDesc: "لغو کامل مالکیت خط",
            description: "با استفاده از این خدمت، مالکیت شما بر روی سیم‌کارت به طور کامل لغو شده و شماره به شبکه ایرانسل بازمی‌گردد.",
            useCases: [
                "زمانی که دیگر نیازی به خط ندارید و می‌خواهید از سوءاستفاده‌های احتمالی جلوگیری کنید.",
                "رسیدن به سقف مجاز خطوط ثبت‌نامی و نیاز به آزاد کردن ظرفیت برای خرید خط جدید."
            ],
            icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
        },
        {
            id: "unblock",
            title: "رفع مسدودیت خط",
            shortDesc: "فعال‌سازی مجدد سیم‌کارت مسدود",
            description: "خطوطی که به دلایل مختلف از طرف اپراتور مسدود شده‌اند، از طریق این خدمت بررسی و در صورت امکان رفع مسدودی می‌شوند.",
            useCases: [
                "مسدود شدن خط به دلیل بدهی یا قبض پرداخت نشده.",
                "مسدودی به دلیل نقص در مدارک هویتی ثبت شده.",
                "مسدودی‌های ناشی از عدم استفاده طولانی‌مدت."
            ],
            icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
        },
        {
            id: "transfer",
            title: "تغییر مالکیت",
            shortDesc: "انتقال خط به شخص دیگر",
            description: "این خدمت برای انتقال رسمی و قانونی مالکیت سیم‌کارت ایرانسل از شما به یک شخص دیگر (یا بالعکس) استفاده می‌شود.",
            useCases: [
                "خرید یا فروش سیم‌کارت کارکرده.",
                "واگذاری خط شخصی به یکی از اعضای خانواده یا دوستان.",
                "انتقال خط شرکتی به نام شخص."
            ],
            icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
        },
        {
            id: "print",
            title: "پرینت حساب",
            shortDesc: "دریافت ریزکارکرد و مکالمات",
            description: "امکان دریافت گزارش کامل از ریز مکالمات، پیامک‌های ارسالی، مصرف اینترنت و تاریخچه شارژهای حساب شما.",
            useCases: [
                "نیاز به پیگیری تماس‌ها و پیامک‌ها (با دستور قضایی یا حضور مالک).",
                "بررسی دقیق هزینه‌ها و دلیل کسر شارژ.",
                "دریافت رسید رسمی برای ارائه به شرکت‌ها."
            ],
            icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        },
        {
            id: "inquiry",
            title: "استعلام خط",
            shortDesc: "بررسی وضعیت سیم‌کارت‌ها",
            description: "با این خدمت می‌توانید از تعداد دقیق خطوطی که به نام شما در شبکه ایرانسل ثبت شده است مطلع شوید و وضعیت آن‌ها را بررسی کنید.",
            useCases: [
                "جلوگیری از سوءاستفاده هویتی و آگاهی از خطوط ثبت شده به نام شما.",
                "استعلام وضعیت فعال، مسدود یا سلب امتیاز بودن یک شماره خاص."
            ],
            icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        },
        {
            id: "deceased",
            title: "خدمات متوفی",
            shortDesc: "تعیین تکلیف خطوط اشخاص فوت‌شده",
            description: "وراث قانونی می‌توانند با استفاده از این خدمت، وضعیت سیم‌کارت‌های شخص متوفی را تعیین تکلیف کنند.",
            useCases: [
                "انتقال مالکیت خط متوفی به نام یکی از وراث قانونی.",
                "سلب امتیاز و مسدودسازی دائمی خط شخص فوت شده.",
                "دریافت پرینت مکالمات (با ارائه نامه قضایی)."
            ],
            icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
        },
        {
            id: "replacement",
            title: "تعویض سیمکارت",
            shortDesc: "ارتقا یا دریافت سیم‌کارت جدید",
            description: "صدور سیم‌کارت جدید با همان شماره قبلی برای جایگزینی سیم‌کارت‌های قدیمی، سوخته یا مفقود شده.",
            useCases: [
                "ارتقای سیم‌کارت قدیمی به سیم‌کارت نسل جدید (4G/5G).",
                "گم شدن یا به سرقت رفتن گوشی و نیاز به سوزاندن خط و دریافت سیم‌کارت جدید.",
                "آسیب فیزیکی و سوختن سیم‌کارت فعلی."
            ],
            icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4a2 2 0 012-2h6a2 2 0 012 2v12m-9 0a2 2 0 00-2 2v2a2 2 0 002 2h6a2 2 0 002-2v-2a2 2 0 00-2-2m-9 0h9" /></svg>
        },
        {
            id: "restore",
            title: "بازگرداندن خط سلب شده",
            shortDesc: "بازیابی خطوط از دست رفته",
            description: "خطوطی که به دلیل عدم استفاده طولانی‌مدت (بیش از ۹۰ روز) تخلیه و سلب امتیاز شده‌اند، در صورت عدم واگذاری به شخص دیگر، قابل بازیابی هستند.",
            useCases: [
                "فراموشی در شارژ یا استفاده از خط و قطع شدن یکطرفه و دوطرفه.",
                "تلاش برای پس گرفتن شماره قدیمی پیش از واگذاری آن به بازار."
            ],
            icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        },
        {
            id: "identity",
            title: "اصلاح اطلاعات هویتی",
            shortDesc: "ویرایش مشخصات مالک",
            description: "بروزرسانی یا اصلاح اطلاعات هویتی ثبت شده شما در سامانه جامع ایرانسل.",
            useCases: [
                "تغییر رسمی نام یا نام خانوادگی در ثبت احوال.",
                "رفع مغایرت در کد ملی یا سریال شناسنامه.",
                "ثبت اطلاعات کارت ملی هوشمند جدید."
            ],
            icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
        }
    ];

    // هندلر باز کردن پاپ‌آپ
    const openModal = (service: ServiceDetail) => {
        setSelectedService(service);
        setSuccessMsg("");
        setShowAuthForm(false);
        setAuthError("");
        setTargetPhone(user ? user.phone : "");
    };

    // تابع ارسال واقعی درخواست به سرور
    const submitOrderToServer = async (tokenToUse: string) => {
        setIsSubmitting(true);
        try {
            await axios.post(
                "http://localhost:5000/api/orders",
                {
                    type: "SERVICES",
                    targetNumber: targetPhone || authPhone,
                    details: `درخواست خدمات: ${selectedService?.title}`
                },
                { headers: { Authorization: `Bearer ${tokenToUse}` } }
            );

            setSuccessMsg("درخواست شما با موفقیت ثبت شد. همکاران ما به زودی با شما تماس خواهند گرفت.");
            setShowAuthForm(false);

            setTimeout(() => {
                setSelectedService(null);
            }, 3000);
        } catch (error) {
            alert("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // هندلر کلیک روی دکمه ثبت درخواست در حالت عادی
    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setAuthPhone(targetPhone);
            setShowAuthForm(true);
            return;
        }

        const token = localStorage.getItem("token");
        if (token) submitOrderToServer(token);
    };

    // هندلر فرم ورود/ثبت‌نام درون مودال
    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError("");

        try {
            const endpoint = authTab === "login" ? "/login" : "/register";
            const payload = authTab === "login"
                ? { phone: authPhone, password: authPassword }
                : { fullName: authFullName, phone: authPhone, password: authPassword };

            const response = await axios.post(`http://localhost:5000/api/auth${endpoint}`, payload);

            const { token, user: newUser } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(newUser));
            setUser(newUser);

            await submitOrderToServer(token);

        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                setAuthError(error.response.data.message);
            } else {
                setAuthError("ارتباط با سرور برقرار نشد.");
            }
        } finally {
            setAuthLoading(false);
        }
    };

    return (
        <div className="w-full flex-1 py-10 px-4 md:px-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">

                <div className="text-center mb-12">
                    <h1 className="text-2xl md:text-3xl font-black text-[#002B5E] mb-3">خدمات یکپارچه ایرانسل</h1>
                    <p className="text-sm md:text-base text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed">
                        خدمت مورد نظر خود را انتخاب کنید. پس از ثبت شماره، همکاران ما در مرکز ارتباط جهت انجام سریع و غیرحضوری مراحل با شما تماس می‌گیرند.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {servicesList.map((service) => (
                        <div
                            key={service.id}
                            onClick={() => openModal(service)}
                            className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-[#FFCC00] hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
                        >
                            <div className="w-14 h-14 bg-gray-50 group-hover:bg-[#FFCC00]/10 text-[#002B5E] group-hover:text-[#FFCC00] rounded-2xl flex items-center justify-center mb-5 transition-colors">
                                {service.icon}
                            </div>
                            <h3 className="text-lg font-extrabold text-[#002B5E] mb-2">{service.title}</h3>
                            <p className="text-sm text-gray-500 font-bold leading-relaxed flex-1">
                                {service.shortDesc}
                            </p>

                            <div className="mt-6 flex items-center text-xs font-black text-[#FFCC00] group-hover:text-[#002B5E] transition-colors">
                                <span>ثبت درخواست</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">

                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#FFCC00]/20 text-[#002B5E] rounded-xl flex items-center justify-center">
                                    {selectedService.icon}
                                </div>
                                <h2 className="text-lg font-black text-[#002B5E]">{selectedService.title}</h2>
                            </div>
                            <button
                                onClick={() => setSelectedService(null)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 bg-white rounded-full shadow-sm transition-colors cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {!showAuthForm && (
                                <>
                                    <p className="text-sm text-gray-700 font-bold leading-relaxed mb-6">
                                        {selectedService.description}
                                    </p>
                                    <div className="mb-8">
                                        <h4 className="text-xs font-black text-gray-400 mb-3 uppercase tracking-wider">موارد استفاده:</h4>
                                        <ul className="space-y-2">
                                            {selectedService.useCases.map((useCase, index) => (
                                                <li key={index} className="flex items-start text-sm text-gray-600 font-bold leading-relaxed">
                                                    <span className="text-[#FFCC00] mr-0 ml-2 mt-1">
                                                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                    </span>
                                                    {useCase}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}

                            {successMsg && (
                                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold rounded-2xl flex items-center gap-3">
                                    <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>{successMsg}</span>
                                </div>
                            )}

                            {!successMsg && !showAuthForm && (
                                <form onSubmit={handleInitialSubmit} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mt-4">
                                    <label className="block text-xs font-black text-gray-700 mb-2">شماره موبایل جهت بررسی و پیگیری</label>
                                    <input
                                        type="tel"
                                        dir="ltr"
                                        value={targetPhone}
                                        onChange={(e) => setTargetPhone(e.target.value)}
                                        placeholder="09** *** ****"
                                        required
                                        maxLength={11}
                                        className="w-full h-12 px-4 mb-4 rounded-xl bg-white border-2 border-gray-200 focus:border-[#FFCC00] outline-none text-left text-base font-extrabold text-[#002B5E] tracking-widest transition-all"
                                    />

                                    <div className="flex items-start gap-2 mb-5">
                                        <svg className="w-5 h-5 text-[#FFCC00] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
                                            با انتخاب این خدمت و ثبت شماره، اطلاعات کاربری شما به همراه این شماره برای ما ارسال می‌شود. همکاران ما در اسرع وقت جهت تکمیل فرآیند با شما تماس خواهند گرفت.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full h-12 text-[#002B5E] font-extrabold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 ${isSubmitting ? "bg-[#f2c200]/70 cursor-not-allowed" : "bg-[#FFCC00] hover:bg-[#f2c200] cursor-pointer"
                                            }`}
                                    >
                                        {isSubmitting ? "در حال ثبت درخواست..." : "ثبت درخواست و تماس کارشناس"}
                                    </button>
                                </form>
                            )}

                            {!successMsg && showAuthForm && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-[#002B5E] text-white p-4 rounded-2xl mb-4 flex items-center justify-between shadow-md">
                                        <div>
                                            <h4 className="text-sm font-black mb-1">نیاز به ورود به حساب</h4>
                                            <p className="text-xs text-blue-200 font-bold">برای ثبت درخواست لطفاً وارد شوید</p>
                                        </div>
                                        <button
                                            onClick={() => setShowAuthForm(false)}
                                            className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                        >
                                            بازگشت
                                        </button>
                                    </div>

                                    <div className="flex p-1 bg-gray-100 rounded-xl mb-4">
                                        <button
                                            onClick={() => { setAuthTab("login"); setAuthError(""); }}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${authTab === "login" ? "bg-white text-[#002B5E] shadow-sm" : "text-gray-500"}`}
                                        >
                                            ورود
                                        </button>
                                        <button
                                            onClick={() => { setAuthTab("register"); setAuthError(""); }}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${authTab === "register" ? "bg-white text-[#002B5E] shadow-sm" : "text-gray-500"}`}
                                        >
                                            ثبت‌نام جدید
                                        </button>
                                    </div>

                                    {authError && (
                                        <div className="mb-4 p-2 bg-red-50 text-red-600 text-[11px] font-bold rounded-lg text-center border border-red-100">
                                            {authError}
                                        </div>
                                    )}

                                    <form onSubmit={handleAuthSubmit} className="space-y-3">
                                        {authTab === "register" && (
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-bold text-gray-700">نام و نام خانوادگی</label>
                                                <input
                                                    type="text"
                                                    value={authFullName}
                                                    onChange={(e) => setAuthFullName(e.target.value)}
                                                    required={authTab === "register"}
                                                    className="w-full h-10 px-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#FFCC00] outline-none text-xs font-bold"
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-gray-700">شماره موبایل</label>
                                            <input
                                                type="tel"
                                                dir="ltr"
                                                value={authPhone}
                                                onChange={(e) => setAuthPhone(e.target.value)}
                                                required
                                                maxLength={11}
                                                className="w-full h-10 px-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#FFCC00] outline-none text-left text-sm font-extrabold tracking-wider"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-gray-700">رمز عبور</label>
                                            <input
                                                type="password"
                                                dir="ltr"
                                                value={authPassword}
                                                onChange={(e) => setAuthPassword(e.target.value)}
                                                required
                                                className="w-full h-10 px-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#FFCC00] outline-none text-left text-sm font-extrabold tracking-wider"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={authLoading || isSubmitting}
                                            className="w-full h-12 mt-2 bg-[#FFCC00] hover:bg-[#f2c200] text-[#002B5E] font-black text-sm rounded-xl shadow-sm transition-all cursor-pointer"
                                        >
                                            {authLoading || isSubmitting ? "در حال پردازش..." : (authTab === "login" ? "ورود و ثبت درخواست" : "ثبت‌نام و ارسال درخواست")}
                                        </button>
                                    </form>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}