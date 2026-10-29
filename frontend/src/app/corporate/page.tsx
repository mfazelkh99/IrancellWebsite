"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// --- تعریف نوع داده‌ها ---
interface UserData {
    id: number;
    fullName: string;
    phone: string;
}

interface CorporateService {
    id: string;
    title: string;
    shortDesc: string;
    description: string;
    useCases: string[];
    icon: React.ReactNode;
    isProductList?: boolean;
    link?: string;
}

export default function CorporatePage() {
    const router = useRouter();

    // استیت‌های اصلی
    const [user, setUser] = useState<UserData | null>(null);
    const [selectedService, setSelectedService] = useState<CorporateService | null>(null);
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

    // --- محتوای متنی خدمات سازمانی ---
    const corporateServices: CorporateService[] = [
        {
            id: "walkie-talkie",
            title: "خرید بی‌سیم سازمانی",
            shortDesc: "ارتباطات سریع و امن تیمی (PTOC)",
            description: "راهکار ارتباطی بی‌سیم بر بستر شبکه قدرتمند موبایل ایرانسل (PTOC) که جایگزین بی‌سیم‌های سنتی با برد محدود است. این سرویس امکان ارتباط لحظه‌ای و رمزنگاری‌شده را برای تیم‌های شما فراهم می‌کند.",
            useCases: [
                "ارتباط لحظه‌ای تیم‌های حراست، نگهبانی و امنیت سازمان.",
                "هماهنگی ناوگان حمل‌ونقل و پرسنل لجستیک در سراسر کشور.",
                "ارتباط پایدار پرسنل میدانی، معادن و کارخانجات بزرگ."
            ],
            icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553H9.618a1 1 0 01-.894-.553l-.448-.894A1 1 0 007.382 3H6a2 2 0 00-2 2v14a2 2 0 002 2zM12 11v4m-3-2h6" /></svg>,
            isProductList: true,
            link: "/wireless"
        },
        {
            id: "corporate-sim",
            title: "خرید سیم‌کارت سازمانی",
            shortDesc: "سیم‌کارت‌های ویژه پرسنل و شرکت‌ها",
            description: "تهیه سیم‌کارت‌های دائمی و اعتباری به نام شرکت با تعرفه‌های ویژه سازمانی. این خدمت جهت یکپارچه‌سازی ارتباطات کارکنان و مدیریت متمرکز هزینه‌ها طراحی شده است.",
            useCases: [
                "تجهیز تیم فروش و پشتیبانی به خطوط رسمی شرکت.",
                "بهره‌مندی از بسته‌های اینترنت و مکالمه سازمانی و اقتصادی.",
                "ایجاد شبکه ارتباطی اختصاصی و مدیریت متمرکز صورت‌حساب‌ها."
            ],
            icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        },
        {
            id: "sim-replacement",
            title: "تعویض سیم‌کارت حقوقی",
            shortDesc: "صدور مجدد سیم‌کارت شرکتی",
            description: "تعویض سیم‌کارت‌های سازمانی سوخته، مفقود شده یا ارتقای آن‌ها به نسل جدید (4G/5G) با حفظ شماره و مالکیت شرکت در سریع‌ترین زمان ممکن.",
            useCases: [
                "مفقود شدن یا به سرقت رفتن گوشی و خط سازمانی پرسنل.",
                "خرابی فیزیکی سیم‌کارت یا سوختن آن.",
                "ارتقای سیم‌کارت‌های قدیمی سازمان به سیم‌کارت‌های پرسرعت نسل جدید."
            ],
            icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4a2 2 0 012-2h6a2 2 0 012 2v12m-9 0a2 2 0 00-2 2v2a2 2 0 002 2h6a2 2 0 002-2v-2a2 2 0 00-2-2m-9 0h9" /></svg>
        },
        {
            id: "ownership-transfer",
            title: "تغییر مالکیت سازمانی",
            shortDesc: "انتقال حقیقی به حقوقی و بالعکس",
            description: "انتقال قانونی و رسمی مالکیت خطوط از شخص حقیقی به نام شرکت (حقوقی) و یا واگذاری خطوط بین دو شرکت حقوقی با رعایت تمامی ضوابط.",
            useCases: [
                "ثبت خطوط شخصی که توسط مدیران استفاده می‌شود به نام شرکت.",
                "تغییرات ساختاری، ادغام شرکت‌ها و نیاز به انتقال خطوط.",
                "واگذاری شماره‌های رند شرکتی به شرکای تجاری یا خریداران."
            ],
            icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
        }
    ];

    // باز کردن مودال (اکنون برای همه باز می‌شود)
    const handleCardClick = (service: CorporateService) => {
        if (service.isProductList && service.link) {
            router.push(service.link);
            return;
        }

        setSelectedService(service);
        setSuccessMsg("");
        setShowAuthForm(false);
        setAuthError("");
        setTargetPhone(user ? user.phone : ""); // اگر لاگین بود، شماره‌اش پیش‌فرض قرار می‌گیرد
    };

    // تابع ارسال واقعی درخواست (مستقل نوشته شده تا بعد از لاگین هم بتوان آن را فراخوانی کرد)
    const submitOrderToServer = async (tokenToUse: string) => {
        setIsSubmitting(true);
        try {
            await axios.post(
                "http://localhost:5000/api/orders",
                {
                    type: "CORPORATE",
                    targetNumber: targetPhone || authPhone, // اگر لاگین نبود، شماره فرم اتنتیکیشن ارسال شود
                    details: `درخواست خدمات سازمانی: ${selectedService?.title}`
                },
                { headers: { Authorization: `Bearer ${tokenToUse}` } }
            );

            setSuccessMsg("درخواست شما با موفقیت ثبت شد. همکاران ما به زودی با شما تماس خواهند گرفت.");
            setShowAuthForm(false);

            setTimeout(() => {
                setSelectedService(null);
            }, 3000);
        } catch (error) {
            alert("خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // هندلر کلیک روی دکمه ثبت درخواست در حالت عادی
    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // اگر لاگین نکرده بود، فرم احراز هویت را در مودال نشان بده
        if (!user) {
            setAuthPhone(targetPhone); // شماره‌ای که وارد کرده را برای فرم لاگین کپی کن
            setShowAuthForm(true);
            return;
        }

        // اگر لاگین بود، مستقیم ارسال کن
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

            // ذخیره اطلاعات کاربر جدید
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(newUser));
            setUser(newUser);

            // پس از لاگین موفق، درخواست را به صورت خودکار ثبت کن
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
                    <div className="w-16 h-16 bg-[#FFCC00]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-[#002B5E]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                        </svg>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-[#002B5E] mb-3">محصولات سازمانی و شرکتی</h1>
                    <p className="text-sm md:text-base text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed">
                        راهکارهای ارتباطی ویژه کسب‌وکارها، شرکت‌ها و سازمان‌ها. خدمت مورد نظر خود را انتخاب کرده تا کارشناسان B2B ما در اسرع وقت پاسخگوی شما باشند.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
                    {corporateServices.map((service) => (
                        <div
                            key={service.id}
                            onClick={() => handleCardClick(service)}
                            className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-[#FFCC00] hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
                        >
                            <div className="w-14 h-14 bg-gray-50 group-hover:bg-[#FFCC00]/10 text-[#002B5E] group-hover:text-[#FFCC00] rounded-2xl flex items-center justify-center mb-5 transition-colors">
                                {service.icon}
                            </div>

                            <h3 className="text-lg font-extrabold text-[#002B5E] mb-2">
                                {service.title}
                            </h3>

                            <p className="text-sm text-gray-500 font-bold leading-relaxed flex-1">
                                {service.shortDesc}
                            </p>

                            <div className="mt-6 flex items-center text-xs font-black text-[#FFCC00] group-hover:text-[#002B5E] transition-colors">
                                <span>{service.isProductList ? "مشاهده و خرید مدل‌ها" : "ثبت درخواست"}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* پنجره مودال (پاپ‌آپ) جزئیات و ثبت درخواست */}
            {selectedService && !selectedService.isProductList && (
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

                            {/* پیام موفقیت */}
                            {successMsg && (
                                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold rounded-2xl flex items-center gap-3">
                                    <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>{successMsg}</span>
                                </div>
                            )}

                            {/* فرم اولیه دریافت شماره */}
                            {!successMsg && !showAuthForm && (
                                <form onSubmit={handleInitialSubmit} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mt-4">
                                    <label className="block text-xs font-black text-gray-700 mb-2">شماره تماس جهت هماهنگی</label>
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
                                            همکاران ما در مرکز ارتباط جهت انجام سریع و غیرحضوری مراحل با شما تماس می‌گیرند.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full h-12 text-[#002B5E] font-extrabold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 ${isSubmitting ? "bg-[#f2c200]/70 cursor-not-allowed" : "bg-[#FFCC00] hover:bg-[#f2c200] cursor-pointer"
                                            }`}
                                    >
                                        {isSubmitting ? "در حال ثبت درخواست..." : "ثبت درخواست"}
                                    </button>
                                </form>
                            )}

                            {/* فرم ورود / ثبت‌نام مینیاتوری در همان پاپ‌آپ */}
                            {!successMsg && showAuthForm && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-[#002B5E] text-white p-4 rounded-2xl mb-4 flex items-center justify-between shadow-md">
                                        <div>
                                            <h4 className="text-sm font-black mb-1">نیاز به ورود به حساب</h4>
                                            <p className="text-xs text-blue-200 font-bold">برای ثبت درخواست لطفاً وارد شوید</p>
                                        </div>
                                        <button
                                            onClick={() => setShowAuthForm(false)}
                                            className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            بازگشت
                                        </button>
                                    </div>

                                    <div className="flex p-1 bg-gray-100 rounded-xl mb-4">
                                        <button
                                            onClick={() => { setAuthTab("login"); setAuthError(""); }}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${authTab === "login" ? "bg-white text-[#002B5E] shadow-sm" : "text-gray-500"}`}
                                        >
                                            ورود
                                        </button>
                                        <button
                                            onClick={() => { setAuthTab("register"); setAuthError(""); }}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${authTab === "register" ? "bg-white text-[#002B5E] shadow-sm" : "text-gray-500"}`}
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
                                            className="w-full h-12 mt-2 bg-[#FFCC00] hover:bg-[#f2c200] text-[#002B5E] font-black text-sm rounded-xl shadow-sm transition-all"
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