"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// --- تعریف نوع داده‌ها ---
interface User {
    fullName: string;
    phone: string;
}

interface Note {
    text: string;
    createdAt: string;
    staff: {
        fullName: string;
    };
}

interface Order {
    id: number;
    type: string;
    targetNumber: string | null;
    status: string;
    details: string | null;
    followUpDate: string | null;
    createdAt: string;
    updatedAt: string;
    user: User;
    notes: Note[];
}

type TabType = "new" | "in-progress" | "today" | "completed" | "all";

export default function StaffDashboard() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<TabType>("new");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    // استیت‌های مربوط به مودال پردازش
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [noteText, setNoteText] = useState("");
    const [newStatus, setNewStatus] = useState("IN_PROGRESS");
    const [followUpDate, setFollowUpDate] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const API_URL = "http://localhost:5000/api/staff"; // آدرس API بک‌اند

    // تابع برای دریافت سفارشات از سرور بر اساس تب فعال
    const fetchOrders = async (tab: TabType) => {
        setIsLoading(true);
        setErrorMsg("");
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/auth");
                return;
            }

            const response = await axios.get(`${API_URL}/orders?tab=${tab}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrders(response.data);
        } catch (error: any) {
            if (error.response?.status === 401) {
                router.push("/auth");
            } else {
                setErrorMsg("خطا در دریافت اطلاعات از سرور.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // هر بار که تب عوض شد، اطلاعات را دوباره بگیر
    useEffect(() => {
        fetchOrders(activeTab);
    }, [activeTab]);

    // هندلر باز کردن مودال
    const openProcessModal = (order: Order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setNoteText("");
        // اگر از قبل تاریخی داشت، آن را در فرمت YYYY-MM-DDT00:00 تنظیم کن (برای سادگی نمایش)
        setFollowUpDate(order.followUpDate ? new Date(order.followUpDate).toISOString().slice(0, 16) : "");
    };

    // هندلر ثبت فرم مودال
    const handleProcessSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) return;
        setIsProcessing(true);

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${API_URL}/orders/${selectedOrder.id}/process`,
                {
                    status: newStatus,
                    noteText: noteText,
                    followUpDate: followUpDate || null
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // بستن مودال و رفرش لیست
            setSelectedOrder(null);
            fetchOrders(activeTab);
        } catch (error) {
            alert("خطا در ثبت اطلاعات.");
        } finally {
            setIsProcessing(false);
        }
    };

    // تابع کمکی برای ترجمه نوع درخواست به فارسی
    const translateType = (type: string) => {
        const types: { [key: string]: string } = {
            "MODEM": "خرید مودم",
            "SIMCARD": "خرید سیم‌کارت",
            "RECHARGE": "شارژ و بسته",
            "CORPORATE": "خدمات سازمانی"
        };
        return types[type] || type;
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">

            {/* سایدبار (منوی تب‌ها) */}
            <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-l border-gray-200 shrink-0 shadow-sm flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
                <div className="p-6 hidden md:block border-b border-gray-100 text-center">
                    <div className="w-12 h-12 bg-[#FFCC00]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#002B5E]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </div>
                    <h2 className="text-sm font-black text-[#002B5E]">پنل مدیریت همکاران</h2>
                </div>

                <nav className="flex md:flex-col w-full">
                    <button
                        onClick={() => setActiveTab("new")}
                        className={`flex-1 md:flex-none flex items-center gap-3 px-6 py-4 text-xs font-bold transition-all border-b-2 md:border-b-0 md:border-r-4 ${activeTab === "new" ? "text-[#002B5E] bg-[#FFCC00]/10 border-[#FFCC00]" : "text-gray-500 border-transparent hover:bg-gray-50"}`}
                    >
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${activeTab !== "new" && "hidden"}`}></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        درخواست‌های جدید
                    </button>

                    <button
                        onClick={() => setActiveTab("in-progress")}
                        className={`flex-1 md:flex-none flex items-center gap-3 px-6 py-4 text-xs font-bold transition-all border-b-2 md:border-b-0 md:border-r-4 ${activeTab === "in-progress" ? "text-[#002B5E] bg-[#FFCC00]/10 border-[#FFCC00]" : "text-gray-500 border-transparent hover:bg-gray-50"}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        در حال پیگیری
                    </button>

                    <button
                        onClick={() => setActiveTab("today")}
                        className={`flex-1 md:flex-none flex items-center gap-3 px-6 py-4 text-xs font-bold transition-all border-b-2 md:border-b-0 md:border-r-4 ${activeTab === "today" ? "text-[#002B5E] bg-[#FFCC00]/10 border-[#FFCC00]" : "text-gray-500 border-transparent hover:bg-gray-50"}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        پیگیری‌های امروز
                    </button>

                    <button
                        onClick={() => setActiveTab("completed")}
                        className={`flex-1 md:flex-none flex items-center gap-3 px-6 py-4 text-xs font-bold transition-all border-b-2 md:border-b-0 md:border-r-4 ${activeTab === "completed" ? "text-[#002B5E] bg-[#FFCC00]/10 border-[#FFCC00]" : "text-gray-500 border-transparent hover:bg-gray-50"}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                        انجام شده / لغو
                    </button>

                    <button
                        onClick={() => setActiveTab("all")}
                        className={`flex-1 md:flex-none flex items-center gap-3 px-6 py-4 text-xs font-bold transition-all border-b-2 md:border-b-0 md:border-r-4 ${activeTab === "all" ? "text-[#002B5E] bg-[#FFCC00]/10 border-[#FFCC00]" : "text-gray-500 border-transparent hover:bg-gray-50"}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-transparent border border-gray-400"></span>
                        همه درخواست‌ها
                    </button>
                </nav>
            </aside>

            {/* محتوای اصلی (لیست درخواست‌ها) */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">

                {/* هدر محتوا */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-[#002B5E] mb-1">
                            {activeTab === "new" && "درخواست‌های جدید"}
                            {activeTab === "in-progress" && "درخواست‌های در حال پیگیری"}
                            {activeTab === "today" && "پیگیری‌های برنامه‌ریزی‌شده امروز"}
                            {activeTab === "completed" && "درخواست‌های مختومه"}
                            {activeTab === "all" && "آرشیو کل درخواست‌ها"}
                        </h1>
                        <p className="text-xs text-gray-500 font-bold">نمایش سریع اطلاعات و ثبت یادداشت کارشناس</p>
                    </div>
                </div>

                {/* ارور هندلینگ */}
                {errorMsg && (
                    <div className="bg-red-50 p-4 rounded-xl text-red-600 text-xs font-bold mb-6">
                        {errorMsg}
                    </div>
                )}

                {/* لیست کارت‌ها */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <svg className="animate-spin h-8 w-8 text-[#002B5E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center shadow-sm">
                        <p className="text-gray-400 font-bold text-sm">هیچ درخواستی در این بخش وجود ندارد.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black rounded-lg mb-2">
                                            {translateType(order.type)}
                                        </span>
                                        <h3 className="text-base font-black text-[#002B5E]">{order.user.fullName}</h3>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-gray-400 font-bold mb-1">شماره مشتری</p>
                                        <p className="text-sm font-black text-[#002B5E]" dir="ltr">{order.user.phone}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl mb-6 flex-1">
                                    {order.targetNumber && (
                                        <div className="mb-2">
                                            <span className="text-[11px] text-gray-500 font-bold ml-2">شماره هدف:</span>
                                            <span className="text-xs font-black text-gray-800" dir="ltr">{order.targetNumber}</span>
                                        </div>
                                    )}
                                    {order.details && (
                                        <div>
                                            <span className="text-[11px] text-gray-500 font-bold ml-2">جزئیات:</span>
                                            <span className="text-[11px] font-bold text-gray-700 leading-relaxed">{order.details}</span>
                                        </div>
                                    )}
                                </div>

                                {order.notes && order.notes.length > 0 && (
                                    <div className="mb-4 pl-3 border-l-2 border-[#FFCC00]">
                                        <p className="text-[10px] text-gray-400 font-bold mb-1">آخرین یادداشت توسط: {order.notes[0].staff.fullName}</p>
                                        <p className="text-xs font-bold text-gray-700 leading-relaxed line-clamp-2">{order.notes[0].text}</p>
                                    </div>
                                )}

                                <button
                                    onClick={() => openProcessModal(order)}
                                    className="w-full mt-auto py-3 bg-[#002B5E] hover:bg-[#001a38] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                                >
                                    بررسی و ثبت پیگیری
                                </button>
                            </div>
                        ))}
                    </div>
                )}

            </main>

            {/* مودال بررسی و ثبت یادداشت */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-base font-black text-[#002B5E]">ثبت پیگیری برای {selectedOrder.user.fullName}</h2>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleProcessSubmit} className="p-6">

                            <div className="mb-4">
                                <label className="block text-xs font-black text-gray-700 mb-2">تغییر وضعیت درخواست</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 outline-none focus:border-[#FFCC00]"
                                >
                                    <option value="PENDING">جدید (در انتظار)</option>
                                    <option value="IN_PROGRESS">در حال پیگیری</option>
                                    <option value="COMPLETED">انجام شد</option>
                                    <option value="REJECTED">لغو / رد شد</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs font-black text-gray-700 mb-2">یادداشت کارشناس (اختیاری)</label>
                                <textarea
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="مثال: با مشتری تماس گرفته شد، قرار شد فردا برای دریافت سیم‌کارت مراجعه کنند..."
                                    className="w-full h-24 p-4 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 outline-none focus:border-[#FFCC00] resize-none"
                                ></textarea>
                            </div>

                            <div className="mb-8">
                                <label className="block text-xs font-black text-gray-700 mb-2">تاریخ پیگیری بعدی (اختیاری)</label>
                                <input
                                    type="datetime-local"
                                    value={followUpDate}
                                    onChange={(e) => setFollowUpDate(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 outline-none focus:border-[#FFCC00]"
                                    dir="ltr"
                                />
                                <p className="text-[10px] text-gray-400 mt-1 font-bold">در صورت تعیین تاریخ، این درخواست در روز مشخص‌شده در تب "پیگیری‌های امروز" نمایش داده می‌شود.</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="flex-1 bg-[#FFCC00] hover:bg-[#f2c200] text-[#002B5E] h-12 rounded-xl text-sm font-black transition-colors"
                                >
                                    {isProcessing ? "در حال ثبت..." : "ذخیره تغییرات"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedOrder(null)}
                                    className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 h-12 rounded-xl text-sm font-bold transition-colors"
                                >
                                    انصراف
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}