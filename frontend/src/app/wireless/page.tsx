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

interface WirelessProduct {
    id: string;
    name: string;
    model: string;
    price: string;
    features: string[];
    isAvailable: boolean;
}

export default function WirelessStorePage() {
    const router = useRouter();

    const [user, setUser] = useState<UserData | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<WirelessProduct | null>(null);
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

    // --- دیتای تستی محصولات بی‌سیم سازمانی (PTOC) ---
    const products: WirelessProduct[] = [
        {
            id: "ptoc-pnc380",
            name: "بی‌سیم شبکه موبایل",
            model: "مدل PNC380",
            price: "۸,۵۰۰,۰۰۰ تومان",
            features: ["پشتیبانی از 4G/LTE و Wi-Fi", "باتری قدرتمند 4000mAh", "مقاوم در برابر آب و گردوغبار (IP67)", "دارای دوربین برای تماس تصویری"],
            isAvailable: true,
        },
        {
            id: "ptoc-te390",
            name: "بی‌سیم هوشمند سازمانی",
            model: "مدل TE390",
            price: "۶,۲۰۰,۰۰۰ تومان",
            features: ["سیستم‌عامل اندروید اختصاصی", "صفحه نمایش لمسی", "موقعیت‌یاب GPS دقیق", "طراحی ارگونومیک و سبک"],
            isAvailable: true,
        },
        {
            id: "ptoc-tm700",
            name: "بی‌سیم خودرویی / ثابت",
            model: "مدل TM-700",
            price: "۱۲,۴۰۰,۰۰۰ تومان",
            features: ["نصب آسان در انواع خودرو", "بلندگوی قدرتمند ۵ واتی", "آنتن خارجی تقویت‌شده", "مناسب برای ناوگان حمل‌ونقل"],
            isAvailable: true,
        }
    ];

    // باز کردن مودال برای همه (بدون ریدایرکت)
    const handleBuyClick = (product: WirelessProduct) => {
        setSelectedProduct(product);
        setSuccessMsg("");
        setShowAuthForm(false);
        setAuthError("");
        setTargetPhone(user ? user.phone : "");
    };

    // تابع ارسال واقعی درخواست خرید بی‌سیم
    const submitOrderToServer = async (tokenToUse: string) => {
        setIsSubmitting(true);
        try {
            await axios.post(
                "http://localhost:5000/api/orders",
                {
                    type: "CORPORATE",
                    targetNumber: targetPhone || authPhone,
                    details: `درخواست خرید بی‌سیم سازمانی مدل: ${selectedProduct?.model}`
                },
                { headers: { Authorization: `Bearer ${tokenToUse}` } }
            );

            setSuccessMsg(`درخواست خرید ${selectedProduct?.model} با موفقیت ثبت شد. کارشناسان فروش B2B به زودی با شما تماس می‌گیرند.`);
            setShowAuthForm(false);

            setTimeout(() => {
                setSelectedProduct(null);
            }, 3500);

        } catch (error) {
            alert("خطا در ثبت درخواست. لطفاً اتصال اینترنت خود را بررسی کنید.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // هندلر دکمه اولیه (بررسی وضعیت لاگین)
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

    // هندلر فرم ورود/ثبت‌نام مینیاتوری
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

            // پس از لاگین، درخواست مستقیماً ثبت می‌شود
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

                {/* نوار راهبری و دکمه بازگشت */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/corporate" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#002B5E] transition-colors bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                        </svg>
                        <span>بازگشت به خدمات سازمانی</span>
                    </Link>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-2xl md:text-3xl font-black text-[#002B5E] mb-3">فروشگاه بی‌سیم‌های سازمانی (PTOC)</h1>
                    <p className="text-sm md:text-base text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed">
                        ارتباطات لحظه‌ای، امن و بدون محدودیت بُرد بر بستر شبکه قدرتمند ایرانسل. مدل مورد نظر خود را انتخاب کنید تا تیم فروش سازمانی با شما تماس بگیرد.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#FFCC00] transition-all flex flex-col">
                            <div className="h-48 bg-gray-50 flex items-center justify-center p-6 border-b border-gray-50 relative">
                                <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-lg">
                                    موجود
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 text-[#002B5E]/20">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                                </svg>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-lg font-black text-[#002B5E] mb-1">{product.name}</h3>
                                    <p className="text-xs font-bold text-gray-400">{product.model}</p>
                                </div>
                                <ul className="space-y-2 mb-6 flex-1">
                                    {product.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start text-xs font-bold text-gray-600">
                                            <span className="text-[#FFCC00] mr-0 ml-1.5 mt-0.5">
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold mb-0.5">قیمت مصرف‌کننده</p>
                                        <p className="text-base font-black text-[#002B5E]">{product.price}</p>
                                    </div>
                                    <button
                                        onClick={() => handleBuyClick(product)}
                                        className="bg-[#FFCC00] hover:bg-[#f2c200] text-[#002B5E] text-xs font-black px-5 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                                    >
                                        خرید سازمانی
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* مودال ثبت درخواست */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-base font-black text-[#002B5E]">ثبت درخواست خرید بی‌سیم</h2>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 bg-white rounded-full shadow-sm transition-colors cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-6 bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 mb-1">محصول انتخابی:</p>
                                    <p className="text-sm font-black text-[#002B5E]">{selectedProduct.name} ({selectedProduct.model})</p>
                                </div>
                            </div>

                            {/* پیام موفقیت */}
                            {successMsg && (
                                <div className="mb-2 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold rounded-2xl flex items-center gap-3">
                                    <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span className="leading-relaxed">{successMsg}</span>
                                </div>
                            )}

                            {/* فرم اولیه دریافت شماره */}
                            {!successMsg && !showAuthForm && (
                                <form onSubmit={handleInitialSubmit}>
                                    <label className="block text-xs font-black text-gray-700 mb-2">شماره تماس جهت هماهنگی</label>
                                    <input
                                        type="tel"
                                        dir="ltr"
                                        value={targetPhone}
                                        onChange={(e) => setTargetPhone(e.target.value)}
                                        placeholder="09** *** ****"
                                        required
                                        maxLength={11}
                                        className="w-full h-12 px-4 mb-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-[#FFCC00] outline-none text-left text-base font-extrabold text-[#002B5E] tracking-widest transition-all"
                                    />

                                    <div className="flex items-start gap-2 mb-6">
                                        <svg className="w-5 h-5 text-[#FFCC00] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
                                            همکاران ما در مرکز ارتباط جهت انجام سریع و غیرحضوری مراحل با شما تماس می‌گیرند.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full h-12 text-[#002B5E] font-extrabold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 ${isSubmitting ? "bg-[#f2c200]/70 cursor-not-allowed" : "bg-[#FFCC00] hover:bg-[#f2c200] cursor-pointer"}`}
                                    >
                                        {isSubmitting ? "در حال ثبت درخواست..." : "ثبت درخواست خرید"}
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