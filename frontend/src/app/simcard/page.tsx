"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

// آیکون تیک سبز دایره‌ای
const CheckBadgeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 shrink-0"
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </svg>
);

// دیتای نمونه برای شماره‌های رند و پرمتقاضی
const popularNumbers = [
  { id: 1, number: "0935 111 2233", type: "دائمی", tag: "رند پله‌ای", price: "۱۲,۵۰۰,۰۰۰", isHot: true, isEco: false },
  { id: 2, number: "0902 500 4000", type: "دائمی", tag: "رند هزاری", price: "۱۸,۰۰۰,۰۰۰", isHot: true, isEco: false },
  { id: 3, number: "0936 123 4567", type: "اعتباری", tag: "پرمتقاضی", price: "۴,۲۰۰,۰۰۰", isHot: false, isEco: false },
  { id: 4, number: "0930 999 8877", type: "دائمی", tag: "رند جفتی", price: "۹,۸۰۰,۰۰۰", isHot: true, isEco: false },
  { id: 5, number: "0933 512 1000", type: "اعتباری", tag: "اقتصادی", price: "۱,۵۰۰,۰۰۰", isHot: false, isEco: true },
  { id: 6, number: "0998 100 2030", type: "آپتل", tag: "پیش‌شماره جدید", price: "۲,۱۰۰,۰۰۰", isHot: false, isEco: false },
];

export default function SimCardPage() {
  const [customNumber, setCustomNumber] = useState("");
  const [error, setError] = useState("");

  // استیت‌های اصلی کاربر و مودال
  const [user, setUser] = useState<{ fullName: string; phone: string } | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<{ number: string; type?: string; price?: string } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // استیت‌های فرم احراز هویت درون‌مودالی
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

  // هندلر کلیک جستجوی شماره دلخواه
  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = customNumber.replace(/\s+/g, "");
    if (cleaned.length < 4) {
      setError("لطفاً حداقل ۴ رقم یا شماره ۱۱ رقمی مدنظر خود را وارد کنید.");
      return;
    }
    setError("");
    setSelectedRequest({
      number: customNumber,
      price: "نیاز به استعلام موجودی",
    });
    setIsSubmitted(false);
    setShowAuthForm(false);
  };

  // هندلر کلیک شماره‌های پیشنهادی
  const handleSelectPopular = (item: typeof popularNumbers[0]) => {
    setSelectedRequest({
      number: item.number,
      type: item.type,
      price: `${item.price} تومان`,
    });
    setIsSubmitted(false);
    setShowAuthForm(false);
  };

  // تابع ارسال واقعی سفارش به سرور
  const submitOrderToServer = async (tokenToUse: string, currentUser?: { fullName: string; phone: string }) => {
    setIsSubmitting(true);
    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        {
          type: "SIMCARD",
          targetNumber: selectedRequest?.number,
          details: `درخواست استعلام/خرید سیم‌کارت | قیمت: ${selectedRequest?.price} ${selectedRequest?.type ? '| نوع: ' + selectedRequest.type : ''}`
        },
        { headers: { Authorization: `Bearer ${tokenToUse}` } }
      );

      setIsSubmitted(true);
      setShowAuthForm(false);
    } catch (error) {
      alert("خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // هندلر تایید در پاپ‌آپ
  const handleConfirmRequest = () => {
    if (!user) {
      setShowAuthForm(true);
      return;
    }
    const token = localStorage.getItem("token");
    if (token) submitOrderToServer(token, user);
  };

  // هندلر فرم ورود/ثبت‌نام مینیاتوری در پاپ‌آپ
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

      await submitOrderToServer(token, newUser);

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
    <div className="w-full flex-1 py-8 md:py-12 px-4">
      <div className="w-full md:w-[90%] lg:w-[80%] mx-auto space-y-10">

        <div className="flex flex-col gap-4">
          <div className="flex items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-[#FFCC00] rounded-full shrink-0"></div>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-[#002B5E]">
                  خرید و استعلام سیم‌کارت
                </h1>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  شماره رویایی خود را جستجو کنید یا از شماره‌های ویژه زیر انتخاب نمایید.
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

          <div className="flex flex-wrap items-center gap-2.5 lg:hidden pr-5">
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs">
              <CheckBadgeIcon />
              <span>ارسال به سراسر کشور</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs">
              <CheckBadgeIcon />
              <span>امکان پرداخت در محل (ویژه یزد)</span>
            </div>
          </div>
        </div>

        <section className="bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_0_25px_rgba(0,0,0,0.08)] border border-gray-200 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-6">
                  شماره مدنظر خود را وارد کنید
                </h2>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                  می‌توانید شماره کامل ۱۱ رقمی (مثلاً <span dir="ltr" className="font-semibold text-gray-700">0900 123 4567</span>) یا بخشی از شماره و کد دلخواهتان (مثلاً <span dir="ltr" className="font-semibold text-gray-700">1380</span>) را وارد کنید تا از لیست موجودی و بهترین قیمت مطلع شوید.
                </p>
              </div>

              <form onSubmit={handleCustomSearch} className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      dir="ltr"
                      value={customNumber}
                      onChange={(e) => setCustomNumber(e.target.value)}
                      maxLength={14}
                      className="w-full h-14 px-5 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-[#FFCC00] focus:bg-white outline-none text-left text-lg md:text-xl font-extrabold text-[#002B5E] tracking-wider placeholder:text-gray-300 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none hidden sm:inline">
                      شماره دلخواه
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="h-14 px-8 bg-[#FFCC00] hover:bg-[#f2c200] text-[#002B5E] font-extrabold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <span>بررسی موجودی</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </button>
                </div>
                {error && <p className="text-red-500 text-xs font-semibold pr-2">{error}</p>}
              </form>
            </div>

            <div className="hidden lg:flex lg:col-span-1"></div>
            <div className="hidden lg:flex lg:col-span-3 flex-col items-start justify-center pr-6 border-r border-gray-100">
              <Image
                src="/images/home_icons/sim-card.png"
                alt="خرید سیم‌کارت ایرانسل"
                width={180}
                height={180}
                className="w-32 h-32 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
              />
              <div className="mt-5 flex flex-col gap-2 w-full max-w-[230px]">
                <div className="flex items-center gap-2 text-emerald-900 px-3.5 py-2 rounded-xl text-xs font-bold">
                  <CheckBadgeIcon />
                  <span>ارسال به سراسر کشور</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-900 px-3.5 py-2 rounded-xl text-xs font-bold">
                  <CheckBadgeIcon />
                  <span>امکان پرداخت در محل (ویژه یزد)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFCC00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFCC00]"></span>
            </span>
            <h2 className="text-lg md:text-xl font-extrabold text-[#002B5E]">
              شماره‌های محبوب و پرمتقاضی
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {popularNumbers.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[1.75rem] p-5 shadow-[0_0_20px_rgba(0,0,0,0.06)] hover:shadow-[0_0_30px_rgba(0,0,0,0.12)] border border-gray-200 hover:border-[#FFCC00] transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    سیم‌کارت {item.type}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${item.isHot
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : item.isEco
                          ? "bg-emerald-50 text-green-700 border border-emerald-200/80 text-emerald-900"
                          : "bg-[#FFCC00]/20 text-[#002B5E]"
                      }`}
                  >
                    {item.isHot ? `🔥 ${item.tag}` : item.tag}
                  </span>
                </div>

                <div className="my-2 py-3 bg-gray-50 rounded-2xl text-center border border-gray-100 group-hover:bg-[#FFCC00]/10 transition-colors">
                  <span
                    dir="ltr"
                    className="text-xl md:text-2xl font-black text-[#002B5E] tracking-widest inline-block"
                  >
                    {item.number}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-gray-400 block">قیمت مصوب:</span>
                    <span className="text-base font-extrabold text-gray-800">
                      {item.price} <span className="text-xs font-normal text-gray-500">تومان</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleSelectPopular(item)}
                    className="px-4 py-2.5 bg-[#002B5E] hover:bg-[#FFCC00] text-white hover:text-[#002B5E] text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                  >
                    درخواست خرید
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* پنجره پاپ‌آپ (Modal) یکپارچه */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-6 md:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">

            {/* حالت ۱: مشاهده اطلاعات قبل از تایید */}
            {!isSubmitted && !showAuthForm && (
              <div className="space-y-5 text-center">
                <div className="w-14 h-14 bg-[#FFCC00]/20 text-[#002B5E] rounded-2xl flex items-center justify-center mx-auto font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                </div>

                <h3 className="text-lg font-extrabold text-[#002B5E]">
                  ثبت درخواست بررسی و خرید سیم‌کارت
                </h3>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">شماره مدنظر:</span>
                    <span dir="ltr" className="font-black text-[#002B5E] text-base">{selectedRequest.number}</span>
                  </div>
                  {selectedRequest.type && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">نوع سیم‌کارت:</span>
                      <span className="font-bold text-gray-800">{selectedRequest.type}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">قیمت:</span>
                    <span className="font-bold text-gray-800">{selectedRequest.price}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    با تایید این فرم، شماره انتخابی جهت استعلام به پنل کارشناسان ارسال خواهد شد.
                  </p>
                  <button
                    onClick={handleConfirmRequest}
                    disabled={isSubmitting}
                    className={`w-full py-3.5 text-[#002B5E] font-extrabold rounded-xl shadow-md transition-all cursor-pointer ${isSubmitting ? "bg-[#f2c200]/70" : "bg-[#FFCC00] hover:bg-[#f2c200]"}`}
                  >
                    {isSubmitting ? "در حال ارسال..." : "تایید و ارسال درخواست برای کارشناس"}
                  </button>
                </div>

                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-xs text-gray-400 hover:text-gray-600 font-semibold cursor-pointer"
                >
                  انصراف و بازگشت
                </button>
              </div>
            )}

            {/* حالت ۲: فرم لاگین درون‌مودالی */}
            {!isSubmitted && showAuthForm && (
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

            {/* حالت ۳: نمایش پیام موفقیت */}
            {isSubmitted && (
              <div className="space-y-5 text-center py-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-9 h-9">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold text-gray-800">
                  درخواست شما با موفقیت ثبت شد!
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  همکاران ما در پنل ادمین موجودی شماره <span dir="ltr" className="font-bold text-gray-800">{selectedRequest.number}</span> را بررسی کرده و در اسرع وقت با شما تماس خواهند گرفت.
                </p>
                <button
                  onClick={() => setSelectedRequest(null)}
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