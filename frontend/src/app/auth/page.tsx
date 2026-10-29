"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AuthPage() {
    const router = useRouter();

    // استیت‌های فرم
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const API_URL = "http://localhost:5000/api/auth";

    // --- تغییر جدید ۱: اگر کاربر از قبل لاگین است، او را به صفحه اصلی بفرست ---
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            router.push("/");
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            if (activeTab === "login") {
                const response = await axios.post(`${API_URL}/login`, {
                    phone,
                    password,
                });

                const { token, user, message } = response.data;

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                setSuccessMsg(message);

                // --- تغییر جدید ۲: هدایت کاربر به صفحه اصلی بعد از لاگین ---
                setTimeout(() => {
                    router.push("/");
                }, 1000);

            } else {
                const response = await axios.post(`${API_URL}/register`, {
                    fullName,
                    phone,
                    password,
                });

                const { token, user, message } = response.data;

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                setSuccessMsg(message);

                // --- تغییر جدید ۲: هدایت کاربر به صفحه اصلی بعد از ثبت‌نام ---
                setTimeout(() => {
                    router.push("/");
                }, 1000);
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMsg(error.response.data.message);
            } else {
                setErrorMsg("ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab: "login" | "register") => {
        setActiveTab(tab);
        setErrorMsg("");
        setSuccessMsg("");
        setPassword("");
    };

    return (
        <div className="w-full flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
            <div className="bg-white w-full max-w-md rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-6 md:p-8 overflow-hidden">

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#FFCC00]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-[#002B5E]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-extrabold text-[#002B5E]">
                        مرکز ارتباط با ایرانسل
                    </h1>
                    <p className="text-xs text-gray-500 mt-2">
                        جهت استفاده از خدمات، وارد حساب کاربری خود شوید
                    </p>
                </div>

                <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
                    <button
                        onClick={() => handleTabChange("login")}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${activeTab === "login"
                                ? "bg-white text-[#002B5E] shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        ورود
                    </button>
                    <button
                        onClick={() => handleTabChange("register")}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${activeTab === "register"
                                ? "bg-white text-[#002B5E] shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        ثبت‌نام جدید
                    </button>
                </div>

                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl text-center">
                        {errorMsg}
                    </div>
                )}
                {successMsg && (
                    <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold rounded-xl text-center">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {activeTab === "register" && (
                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-xs font-bold text-gray-700 pr-1">نام و نام خانوادگی</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="مثال: علی محمدی"
                                required={activeTab === "register"}
                                className="w-full h-12 px-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-[#FFCC00] focus:bg-white outline-none text-sm text-gray-800 transition-all"
                            />
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 pr-1">شماره موبایل</label>
                        <input
                            type="tel"
                            dir="ltr"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="09** *** ****"
                            required
                            maxLength={11}
                            className="w-full h-12 px-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-[#FFCC00] focus:bg-white outline-none text-left text-base font-extrabold text-[#002B5E] tracking-widest placeholder:text-gray-300 transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center pr-1">
                            <label className="text-xs font-bold text-gray-700">رمز عبور</label>
                            {activeTab === "login" && (
                                <button type="button" className="text-[10px] text-[#002B5E] hover:underline cursor-pointer">
                                    رمز را فراموش کرده‌اید؟
                                </button>
                            )}
                        </div>
                        <input
                            type="password"
                            dir="ltr"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            required
                            className="w-full h-12 px-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-[#FFCC00] focus:bg-white outline-none text-left text-base font-bold text-gray-800 tracking-widest placeholder:text-gray-300 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full h-14 mt-6 text-[#002B5E] font-extrabold text-base rounded-2xl shadow-md transition-all cursor-pointer flex justify-center items-center gap-2 ${loading ? "bg-[#f2c200]/70 cursor-not-allowed" : "bg-[#FFCC00] hover:bg-[#f2c200] hover:shadow-lg"
                            }`}
                    >
                        {loading && (
                            <svg className="animate-spin h-5 w-5 text-[#002B5E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        <span>{activeTab === "login" ? "ورود به حساب کاربری" : "تکمیل ثبت‌نام"}</span>
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <Link href="/" className="text-xs font-bold text-gray-400 hover:text-[#002B5E] transition-colors">
                        بازگشت به صفحه اصلی
                    </Link>
                </div>

            </div>
        </div>
    );
}