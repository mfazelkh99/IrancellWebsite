import Link from 'next/link';
import Image from 'next/image';

// آیکون‌های شبکه‌های اجتماعی
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const EitaaIcon = () => (
    <Image
        src="/images/social_icons/eitaa.svg"
        alt="ایتا"
        width={24}
        height={24}
        className="w-6 h-6 object-contain brightness-0 invert"
    />
);

const BaleIcon = () => (
    <Image
        src="/images/social_icons/bale.png"
        alt="بله"
        width={24}
        height={24}
        className="w-6 h-6 object-contain brightness-0 invert"
    />
);
const RubikaIcon = () => (
    <Image
        src="/images/social_icons/minimal-gray@3x.png"
        alt="روبیکا"
        width={24}
        height={24}
        className="w-6 h-6 object-contain rounded-md"
    />
);

export default function Footer() {
    return (
        <footer className="w-full bg-[#002B5E] text-white py-6 mt-auto">
            <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-6">

                {/* اطلاعات تماس و آدرس */}
                <div className="text-center space-y-2 text-sm md:text-base font-light">
                    <p>
                        <span className="font-bold text-[#FFCC00] ml-1">آدرس:</span>
                        یزد - میدان امام علی(ع) - خیابان ذوالفقار - بعد از فاز 2 مجتمع امام علی(ع) - مرکز ارتباط با ایرانسل
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:gap-6">
                        <p>
                            <span className="font-bold text-[#FFCC00] ml-1">تلفن ثابت:</span>
                            <a href="tel:03537208897" className="hover:text-[#FFCC00] transition-colors inline-block" dir="ltr">۰۳۵ - ۳۷۲۰۸۸۹۷</a>
                        </p>
                        <p>
                            <span className="font-bold text-[#FFCC00] ml-1">موبایل:</span>
                            <a href="tel:09335121009" className="hover:text-[#FFCC00] transition-colors inline-block" dir="ltr">۰۹۳۳۵۱۲۱۰۰۹</a>
                        </p>
                    </div>
                </div>

                {/* شبکه‌های اجتماعی */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/20 w-full max-w-md justify-center">
                    <a href="https://www.instagram.com/yazd.irancell?rpxt=MWJxNGF0eGVwY210Zw==" target="_blank" title="اینستاگرام" className="hover:text-[#FFCC00] hover:-translate-y-1 transition-all flex flex-col items-center gap-1">
                        <InstagramIcon /> <span className="text-[10px]">اینستاگرام</span>
                    </a>
                    <a href="https://eitaa.com/yazdirancell65016" target="_blank" title="ایتا" className="hover:text-[#FFCC00] hover:-translate-y-1 transition-all flex flex-col items-center gap-1">
                        <EitaaIcon /> <span className="text-[10px]">ایتا</span>
                    </a>
                    <a href="https://rubika.ir/yazdirancell65016" target="_blank" title="روبیکا" className="hover:text-[#FFCC00] hover:-translate-y-1 transition-all flex flex-col items-center gap-1">
                        <RubikaIcon /> <span className="text-[10px]">روبیکا</span>
                    </a>
                    <a href="https://ble.ir/yazdirancell_65016" target="_blank" title="بله" className="hover:text-[#FFCC00] hover:-translate-y-1 transition-all flex flex-col items-center gap-1">
                        <BaleIcon /> <span className="text-[10px]">بله</span>
                    </a>
                </div>

            </div>
        </footer>
    );
}