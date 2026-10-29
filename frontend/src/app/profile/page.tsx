"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserData {
    id: number;
    fullName: string;
    phone: string;
    role: string;
}

export default function ProfilePage() {
    const router = useRouter();

    const [user, setUser] = useState<UserData | null>(null);
    const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "messages">("dashboard");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            router.push("/auth");
        } else {
            setUser(JSON.parse(storedUser));
            setIsLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-[#002B5E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className="w-full flex-1 py-8 md:py-12 px-4 bg-gray-50/50">
            <div className="w-full md:w-[90%] lg:w-[80%] mx-auto">

                {/* هدر بخش پروفایل */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#FFCC00] rounded-full flex items-center justify-center shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#002B5E]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-extrabold text-[#002B5E]">
                                سلام، {user?.fullName}!
                            </h1>
                            <p className="text-sm text-gray-500 font-bold mt-1" dir="ltr">
                                {user?.phone}
                            </p>
                        </div>
                    </div>

                    {/* دکمه‌های اکشن: بازگشت به سایت و خروج */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-sm font-bold text-[#002B5E] bg-white border border-gray-200 hover:border-[#FFCC00] px-5 py-2.5 rounded-xl transition-all cursor-pointer w-fit shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                            </svg>
                            <span>بازگشت به سایت</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-xl transition-colors cursor-pointer w-fit"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                            </svg>
                            <span>خروج</span>
                        </button>
                    </div>
                </div>

                {/* ساختار دو ستونه: منو و محتوا */}
                <div className="flex flex-col lg:flex-row gap-8">

                    <div className="w-full lg:w-64 shrink-0">
                        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible">

                            <button
                                onClick={() => setActiveTab("dashboard")}
                                className={`flex items-center gap-3 px-6 py-4 text-sm font-bold whitespace-nowrap transition-all cursor-pointer border-b lg:border-b-0 lg:border-l-4 ${activeTab === "dashboard" ? "bg-gray-50 text-[#002B5E] border-[#FFCC00]" : "text-gray-500 hover:bg-gray-50 border-transparent"}`}
                            >
                                <span>داشبورد</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("orders")}
                                className={`flex items-center gap-3 px-6 py-4 text-sm font-bold whitespace-nowrap transition-all cursor-pointer border-b lg:border-b-0 lg:border-l-4 ${activeTab === "orders" ? "bg-gray-50 text-[#002B5E] border-[#FFCC00]" : "text-gray-500 hover:bg-gray-50 border-transparent"}`}
                            >
                                <span>سفارش‌های من</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("messages")}
                                className={`flex items-center gap-3 px-6 py-4 text-sm font-bold whitespace-nowrap transition-all cursor-pointer border-b lg:border-b-0 lg:border-l-4 ${activeTab === "messages" ? "bg-gray-50 text-[#002B5E] border-[#FFCC00]" : "text-gray-500 hover:bg-gray-50 border-transparent"}`}
                            >
                                <span>پیام‌ها و پشتیبانی</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1">
                        {activeTab === "dashboard" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-lg font-extrabold text-gray-800 mb-6">خلاصه وضعیت حساب</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold mb-1">سفارش‌های فعال</p>
                                            <p className="text-2xl font-black text-[#002B5E]">۰</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold mb-1">پیام‌های جدید</p>
                                            <p className="text-2xl font-black text-[#002B5E]">۰</p>
                                        </div>
                                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#FFCC00]/10 border border-[#FFCC00]/30 rounded-2xl p-6">
                                    <h3 className="text-sm font-extrabold text-[#002B5E] mb-2">ثبت سریع درخواست جدید</h3>
                                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                                        برای خرید سیم‌کارت، مودم یا فعال‌سازی بسته‌های اقتصادی ویژه نمایندگی، می‌توانید مستقیماً از طریق بخش خدمات اقدام کنید.
                                    </p>
                                    <div className="flex gap-3">
                                        <Link href="/modem" className="bg-white text-[#002B5E] border border-gray-200 hover:border-[#FFCC00] text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm">
                                            خرید مودم
                                        </Link>
                                        <Link href="/recharge" className="bg-white text-[#002B5E] border border-gray-200 hover:border-[#FFCC00] text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm">
                                            شارژ و بسته
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-bold text-gray-700 mb-1">هنوز سفارشی ثبت نکرده‌اید</h3>
                                <p className="text-xs text-gray-500">لیست درخواست‌های خرید و پیگیری‌های شما در اینجا نمایش داده می‌شود.</p>
                            </div>
                        )}

                        {activeTab === "messages" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-bold text-gray-700 mb-1">صندوق پیام‌های شما خالی است</h3>
                                <p className="text-xs text-gray-500">ارتباطات شما با کارشناسان مرکز ارتباط در این بخش قرار می‌گیرد.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}