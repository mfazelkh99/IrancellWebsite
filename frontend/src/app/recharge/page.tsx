"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// تعریف نوع تب‌های چهارگانه
type ServiceTab = "charge" | "bill" | "mobile_internet" | "td_internet";

// آیکون تیک سبز دایره‌ای برای ویژگی‌ها
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

// مبالغ پیشنهادی برای خرید شارژ سریع
const chargeAmounts = [
  "۱۰,۰۰۰",
  "۲۰,۰۰۰",
  "۵۰,۰۰۰",
  "۱۰۰,۰۰۰",
  "۲۰۰,۰۰۰",
  "مبلغ دلخواه (هماهنگی تلفنی)",
];

// انواع بسته‌های پیشنهادی برای راهنمایی بهتر کارشناس
const packageDurations = [
  "مشاوره بهترین بسته اقتصادی (پیشنهادی)",
  "بسته یک ماهه",
  "بسته سه ماهه",
  "بسته شش ماهه",
  "بسته یک ساله",
];

export default function RechargeAndPackagesPage() {
  // استیت تب فعال (پیش‌فرض روی بسته اینترنت ثابت یا شارژ قابل تغییر است)
  const [activeTab, setActiveTab] = useState<ServiceTab>("charge");

  // استیت‌های فرم
  const [targetNumber, setTargetNumber] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [selectedChargeAmount, setSelectedChargeAmount] = useState(chargeAmounts[2]); // پیش‌فرض ۵۰,۰۰۰
  const [selectedPackageDuration, setSelectedPackageDuration] = useState(packageDurations[0]);
  const [extraNote, setExtraNote] = useState("");
  const [error, setError] = useState("");

  // استیت مدیریت پاپ‌آپ (Modal)
  const [submittedRequest, setSubmittedRequest] = useState<{
    serviceTitle: string;
    targetNumber: string;
    nationalCode?: string;
    details: string;
  } | null>(null);

  // شبیه‌سازی وضعیت لاگین کاربر (به همراه اطلاعات کاربر لاگین شده)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);

  // اطلاعات شبیه‌سازی‌شده کاربر ثبت‌نامی که درخواست را می‌دهد
  const loggedInUser = {
    fullName: "علی محمدی",
    phone: "09131234567",
  };

  // اطلاعات و متون اختصاصی هر تب
  const tabConfig = {
    charge: {
      id: "charge",
      label: "خرید شارژ",
      title: "خرید شارژ مستقیم و فوق‌العاده ایرانسل",
      description:
        "شماره موبایلی که می‌خواهید برای آن شارژ خریداری شود را وارد کرده و مبلغ شارژ را انتخاب کنید. همکاران ما پس از تماس، خط شما را به صورت مستقیم شارژ می‌کنند.",
      placeholder: "0935 *** ****",
      inputLabel: "شماره موبایل جهت شارژ",
      buttonText: "ثبت درخواست خرید شارژ",
    },
    bill: {
      id: "bill",
      label: "پرداخت قبض",
      title: "استعلام و پرداخت قبض سیم‌کارت دائمی و مودم",
      description:
        "شماره سیم‌کارت دائمی یا شماره مودم خود را که قصد پرداخت قبض میان‌دوره یا پایان‌دوره آن را دارید وارد نمایید تا کارشناسان ما مبلغ دقیق را استعلام گرفته و برایتان پرداخت کنند.",
      placeholder: "0935 *** **** / 0941 *** ****",
      inputLabel: "شماره خط جهت پرداخت قبض",
      buttonText: "استعلام مبلغ و پرداخت قبض",
    },
    mobile_internet: {
      id: "mobile_internet",
      label: "بسته اینترنت همراه",
      title: "فعال‌سازی بسته‌های ویژه و اقتصادی اینترنت همراه",
      description:
        "شماره سیم‌کارت ایرانسل خود را وارد کنید. کارشناسان مرکز ارتباط با ایرانسل، به‌صرفه‌ترین و جدیدترین بسته‌های اینترنت و مکالمه (شامل بسته‌های تخفیف‌دار نمایندگی) را برایتان فعال می‌کنند.",
      placeholder: "0935 *** ****",
      inputLabel: "شماره موبایل جهت فعال‌سازی بسته",
      buttonText: "بررسی و خرید بسته اینترنت همراه",
    },
    td_internet: {
      id: "td_internet",
      label: "بسته اینترنت ثابت (مودم)",
      title: "بسته‌های خاص و اقتصادی ویژه سیم‌کارت مودم (TD-LTE)",
      description:
        "توجه: سیم‌کارت‌های مخصوص مودم (TD-LTE با پیش‌شماره ۰۹۴۱) دارای بسته‌های فوق‌العاده اقتصادی و پرحجمی هستند که در اپلیکیشن ایرانسل‌من نمایش داده نمی‌شوند و صرفاً توسط نمایندگان رسمی قابل فعال‌سازی هستند!",
      placeholder: "0941 *** ****",
      inputLabel: "شماره سیم‌کارت مودم (TD-LTE)",
      buttonText: "درخواست بسته ویژه مودم (نمایندگی)",
    },
  };

  // تغییر تب و پاک کردن خطاهای قبلی
  const handleTabChange = (tab: ServiceTab) => {
    setActiveTab(tab);
    setError("");
  };

  // مدیریت ارسال فرم
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedNum = targetNumber.replace(/\s+/g, "");
    const cleanedNatCode = nationalCode.replace(/\s+/g, "");

    // در تب‌های اینترنت، اگر کاربر شماره مودم/خط را حفظ نباشد می‌تواند کد ملی بدهد
    if (activeTab === "td_internet" || activeTab === "mobile_internet") {
      if (cleanedNum.length < 10 && cleanedNatCode.length < 10) {
        setError("لطفاً «شماره سیم‌کارت» و یا در صورتی که شماره را حفظ نیستید «کد ملی مالک» را به صورت صحیح وارد کنید.");
        return;
      }
    } else {
      if (cleanedNum.length < 10) {
        setError("لطفاً شماره ۱۱ رقمی مورد نظر را به صورت کامل وارد کنید.");
        return;
      }
    }

    setError("");

    // آماده‌سازی جزئیات درخواست برای نمایش در پاپ‌آپ و ارسال به پنل ادمین
    let detailsText = "";
    if (activeTab === "charge") {
      detailsText = `مبلغ شارژ: ${selectedChargeAmount} تومان`;
    } else if (activeTab === "bill") {
      detailsText = extraNote ? `توضیحات: ${extraNote}` : "استعلام و تسویه کامل قبض";
    } else {
      detailsText = `بسته درخواستی: ${selectedPackageDuration}`;
    }

    setSubmittedRequest({
      serviceTitle: tabConfig[activeTab].label,
      targetNumber: targetNumber || "ثبت نشده (استعلام با کد ملی)",
      nationalCode: nationalCode || undefined,
      details: detailsText,
    });
    setIsFinalized(false);
  };

  return (
    <div className="w-full flex-1 py-8 md:py-12 px-4">
      {/* کانتینر اصلی هم‌تراز با صفحه اصلی (۸۰ درصد در دسکتاپ) */}
      <div className="w-full md:w-[90%] lg:w-[80%] mx-auto space-y-8">
        
        {/* هدر صفحه و دکمه بازگشت */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-[#FFCC00] rounded-full shrink-0"></div>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-[#002B5E]">
                  خدمات قبض، شارژ و بسته‌های اقتصادی
                </h1>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  نوع خدمت مورد نظر خود را از تب‌های زیر انتخاب کرده و شماره خود را وارد نمایید.
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

          {/* بج‌های اعتماد در موبایل و تبلت */}
          <div className="flex flex-wrap items-center gap-2.5 lg:hidden pr-5">
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-bold">
              <CheckBadgeIcon />
              <span>فعال‌سازی بسته‌های خاص نمایندگی</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-bold">
              <CheckBadgeIcon />
              <span>پشتیبانی و مشاوره تلفنی رایگان</span>
            </div>
          </div>
        </div>

        {/* نوار ۴ تب انتخابی (Segmented Control) */}
        <div className="bg-white p-2 rounded-[1.75rem] shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-gray-200 grid grid-cols-2 lg:grid-cols-4 gap-2">
          {(
            [
              { id: "charge", label: "شارژ", badge: null },
              { id: "bill", label: "قبض", badge: null },
              { id: "mobile_internet", label: "بسته اینترنت همراه", badge: "اقتصادی" },
              { id: "td_internet", label: "بسته اینترنت ثابت", badge: "ویژه مودم" },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`relative py-3.5 px-3 rounded-2xl font-extrabold text-xs md:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-[#002B5E] text-[#FFCC00] shadow-md scale-[1.01]"
                    : "bg-gray-50/70 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-[#FFCC00] text-[#002B5E]"
                        : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* کارت اصلی فرم (متغیر بر اساس تب انتخاب شده) */}
        <section className="bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_0_25px_rgba(0,0,0,0.08)] border border-gray-200 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* ستون راست: فرم پویا و توضیحات */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* تیتر و توضیحات راهنما */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg md:text-xl font-extrabold text-[#002B5E]">
                    {tabConfig[activeTab].title}
                  </h2>
                </div>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {tabConfig[activeTab].description}
                </p>

                {/* بنر اطلاع‌رسانی اختصاصی برای سیم‌کارت‌های TD-LTE (مودم) */}
                {activeTab === "td_internet" && (
                  <div className="bg-[#FFCC00]/15 border border-[#FFCC00] rounded-2xl p-4 flex items-start gap-3 mt-2">
                    <span className="text-xl shrink-0">💡</span>
                    <div className="text-xs text-[#002B5E] leading-relaxed space-y-1">
                      <p className="font-extrabold">مزیت خرید بسته مودم از مرکز ارتباط با ایرانسل (کد ۶۵۰۱۶):</p>
                      <p className="text-gray-700">
                        ما به عنوان نماینده رسمی، به لیست <strong>بسته‌های مخفی، بلندمدت و بسیار اقتصادی TD-LTE</strong> دسترسی داریم که کاربر عادی امکان فعال‌سازی آن‌ها را ندارد. کافیست شماره سیم‌کارت داخل مودم یا کد ملی صاحب مودم را وارد کنید تا بهترین بسته را برایتان فعال کنیم.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* فرم دریافت اطلاعات */}
              <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                
                {/* فیلدهای ورودی شماره و کد ملی (برای بسته‌های اینترنت کد ملی هم نمایش داده می‌شود) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={activeTab === "charge" || activeTab === "bill" ? "sm:col-span-2" : ""}>
                    <label className="block text-xs font-bold text-gray-700 mb-2 pr-1">
                      {tabConfig[activeTab].inputLabel}:
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={targetNumber}
                      onChange={(e) => setTargetNumber(e.target.value)}
                      placeholder={tabConfig[activeTab].placeholder}
                      maxLength={14}
                      className="w-full h-13 px-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-[#FFCC00] focus:bg-white outline-none text-left text-base md:text-lg font-extrabold text-[#002B5E] tracking-wider placeholder:text-gray-300 transition-all"
                    />
                  </div>

                  {/* فیلد کمکی کد ملی ویژه بخش اینترنت همراه و ثابت (در صورتی که شماره مودم/خط را حفظ نباشند) */}
                  {(activeTab === "td_internet" || activeTab === "mobile_internet") && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2 pr-1">
                        کد ملی مالک <span className="text-gray-400 font-normal">(اگر شماره خط/مودم را حفظ نیستید)</span>:
                      </label>
                      <input
                        type="tel"
                        dir="ltr"
                        value={nationalCode}
                        onChange={(e) => setNationalCode(e.target.value)}
                        placeholder="کد ملی ۱۰ رقمی"
                        maxLength={10}
                        className="w-full h-13 px-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-[#FFCC00] focus:bg-white outline-none text-left text-base md:text-lg font-extrabold text-[#002B5E] tracking-wider placeholder:text-gray-300 transition-all"
                      />
                    </div>
                  )}
                </div>

                {/* بخش اختصاصی تب شارژ: انتخاب سریع مبلغ شارژ */}
                {activeTab === "charge" && (
                  <div className="space-y-2.5">
                    <label className="block text-xs font-bold text-gray-700 pr-1">
                      مبلغ شارژ مورد نظر را انتخاب کنید (تومان):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {chargeAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setSelectedChargeAmount(amount)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            selectedChargeAmount === amount
                              ? "bg-[#FFCC00]/20 border-[#FFCC00] text-[#002B5E] shadow-2xs"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {amount.includes("دلخواه") ? amount : `${amount} تومان`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* بخش اختصاصی تب‌های اینترنت: انتخاب بازه زمانی بسته */}
                {(activeTab === "mobile_internet" || activeTab === "td_internet") && (
                  <div className="space-y-2.5">
                    <label className="block text-xs font-bold text-gray-700 pr-1">
                      نوع یا مدت زمان بسته مدنظر (جهت راهنمایی کارشناس):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {packageDurations.map((duration) => (
                        <button
                          key={duration}
                          type="button"
                          onClick={() => setSelectedPackageDuration(duration)}
                          className={`py-2 px-3.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            selectedPackageDuration === duration
                              ? "bg-[#FFCC00]/25 border-[#FFCC00] text-[#002B5E]"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {duration}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* بخش اختصاصی تب قبض: توضیحات اختیاری */}
                {activeTab === "bill" && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 pr-1">
                      توضیحات تکمیلی (اختیاری):
                    </label>
                    <input
                      type="text"
                      value={extraNote}
                      onChange={(e) => setExtraNote(e.target.value)}
                      placeholder="مثلاً: پرداخت قبض پایان دوره و وصل خط یکطرفه شده..."
                      className="w-full h-12 px-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FFCC00] focus:bg-white outline-none text-xs md:text-sm text-gray-700 transition-all"
                    />
                  </div>
                )}

                {error && <p className="text-red-500 text-xs font-semibold pr-1">{error}</p>}

                {/* دکمه ثبت درخواست */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto min-w-[260px] h-14 px-8 bg-[#FFCC00] hover:bg-[#f2c200] text-[#002B5E] font-extrabold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{tabConfig[activeTab].buttonText}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                  </button>
                </div>

              </form>
            </div>

            {/* اسپیسر در دسکتاپ */}
            <div className="hidden lg:flex lg:col-span-1"></div>

            {/* ستون چپ: آیکون سه‌بعدی خدمات شارژ و قبض و تیک‌های سبز در حالت لپ‌تاپ */}
            <div className="hidden lg:flex lg:col-span-3 flex-col items-start justify-center pr-6 border-r border-gray-100">
              <Image
                src="/images/home_icons/sharg.png"
                alt="خدمات قبض، شارژ و بسته‌های اقتصادی ایرانسل"
                width={180}
                height={180}
                className="w-32 h-32 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
              />
              <div className="mt-5 flex flex-col gap-2.5 w-full">
                <div className="flex items-center gap-2 text-emerald-900 px-2 py-1.5 rounded-xl text-xs font-bold">
                  <CheckBadgeIcon />
                  <span>بسته‌های خاص و مخفی مودم (TD-LTE)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-900 px-2 py-1.5 rounded-xl text-xs font-bold">
                  <CheckBadgeIcon />
                  <span>فعال‌سازی آنی توسط کارشناسان مرکز</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-900 px-2 py-1.5 rounded-xl text-xs font-bold">
                  <CheckBadgeIcon />
                  <span>امکان استعلام خط با کد ملی</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* بخش راهنمای پایین صفحه: چرا از طریق نمایندگی اقدام کنیم؟ */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white rounded-[1.75rem] p-5 shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-gray-200 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFCC00]/20 text-[#002B5E] flex items-center justify-center font-black shrink-0">
              ۱
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#002B5E] mb-1">بسته‌های انحصاری مودم (TD-LTE)</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                بسته‌های ویژه مودم‌های ایرانسل با حجم بالا و قیمت اقتصادی، فقط از طریق پنل نمایندگان رسمی قابل ثبت و فعال‌سازی هستند.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[1.75rem] p-5 shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-gray-200 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFCC00]/20 text-[#002B5E] flex items-center justify-center font-black shrink-0">
              ۲
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#002B5E] mb-1">بدون نیاز به حفظ بودن شماره مودم</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                اگر شماره سیم‌کارت داخل مودم خود را فراموش کرده‌اید، کافیست کد ملی صاحب خط را وارد کنید تا همکاران ما خط را پیدا و شارژ کنند.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[1.75rem] p-5 shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-gray-200 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFCC00]/20 text-[#002B5E] flex items-center justify-center font-black shrink-0">
              ۳
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#002B5E] mb-1">رفع مسدودی و وصل سریع خط</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                با ثبت شماره برای پرداخت قبض، بدهی خط شما به صورت آنی از پنل مرکز ارتباط تسویه شده و قطع یک‌طرفه یا دوطرفه خط برطرف می‌گردد.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* پنجره پاپ‌آپ (Modal) برای بررسی لاگین و ارسال اطلاعات کامل به پنل ادمین */}
      {submittedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-6 md:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            
            {!isFinalized ? (
              <div className="space-y-5 text-center">
                <div className="w-14 h-14 bg-[#FFCC00]/20 text-[#002B5E] rounded-2xl flex items-center justify-center mx-auto font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
                  </svg>
                </div>

                <h3 className="text-lg font-extrabold text-[#002B5E]">
                  تایید و ارسال درخواست {submittedRequest.serviceTitle}
                </h3>

                {/* خلاصه اطلاعات فرم که برای پرسنل ارسال می‌شود */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2.5 text-xs md:text-sm text-right">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">نوع درخواست:</span>
                    <span className="font-extrabold text-[#002B5E] bg-[#FFCC00]/25 px-2.5 py-0.5 rounded-lg">
                      {submittedRequest.serviceTitle}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">شماره هدف (جهت انجام خدمت):</span>
                    <span dir="ltr" className="font-black text-gray-800">{submittedRequest.targetNumber}</span>
                  </div>
                  {submittedRequest.nationalCode && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">کد ملی مالک:</span>
                      <span dir="ltr" className="font-bold text-gray-800">{submittedRequest.nationalCode}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-1 border-t border-gray-200/60">
                    <span className="text-gray-500">جزئیات:</span>
                    <span className="font-bold text-gray-700">{submittedRequest.details}</span>
                  </div>

                  {/* نمایش اطلاعات کاربر لاگین شده که قرار است برای ادمین ارسال شود */}
                  {isLoggedIn && (
                    <div className="pt-2 mt-2 border-t border-gray-200 space-y-1.5 bg-emerald-50/60 p-2.5 rounded-xl">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-emerald-800">نام درخواست‌دهنده:</span>
                        <span className="font-bold text-emerald-950">{loggedInUser.fullName}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-emerald-800">شماره تماس شما (جهت هماهنگی):</span>
                        <span dir="ltr" className="font-bold text-emerald-950">{loggedInUser.phone}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* بررسی وضعیت لاگین کاربر */}
                {!isLoggedIn ? (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      برای اینکه کارشناسان ما بتوانند جهت هماهنگی و انجام این خدمت با شما تماس بگیرند، لطفاً وارد حساب کاربری خود شوید.
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
                        (تست توسعه: فرض کن کاربر «علی محمدی» لاگین است)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      آیا اطلاعات فوق را جهت ارسال به پنل کارشناسان مرکز ارتباط با ایرانسل تایید می‌کنید؟
                    </p>
                    <button
                      onClick={() => setIsFinalized(true)}
                      className="w-full py-3.5 bg-[#FFCC00] hover:bg-[#f2c200] text-[#002B5E] font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      تایید نهایی و ارسال درخواست
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setSubmittedRequest(null)}
                  className="text-xs text-gray-400 hover:text-gray-600 font-semibold cursor-pointer"
                >
                  انصراف و ویرایش اطلاعات
                </button>
              </div>
            ) : (
              /* پیام ثبت موفق درخواست */
              <div className="space-y-5 text-center py-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-9 h-9">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold text-gray-800">
                  درخواست شما برای کارشناسان ارسال شد!
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  درخواست <strong>{submittedRequest.serviceTitle}</strong> برای شماره <span dir="ltr" className="font-bold text-gray-800">{submittedRequest.targetNumber}</span> ثبت گردید. همکاران ما در مرکز ۶۵۰۱۶ به زودی با شماره <span dir="ltr" className="font-bold text-gray-800">{loggedInUser.phone}</span> تماس خواهند گرفت.
                </p>
                <button
                  onClick={() => {
                    setSubmittedRequest(null);
                    setTargetNumber("");
                    setNationalCode("");
                  }}
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