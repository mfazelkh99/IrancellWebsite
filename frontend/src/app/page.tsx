import Link from 'next/link';
import Image from 'next/image';

// آیکون‌های SVG
const SimCardIcon = () => (
  <Image
    src="/images/home_icons/sim-card.png"
    alt="خرید سیم‌کارت ایرانسل"
    width={250}
    height={250}
    className="w-12 h-12 md:w-30 md:h-30 object-contain"
  />
);
const ReceiptIcon = () => (
  <Image
    src="/images/home_icons/sharg.png"
    alt="شارژ ، پرداخت قبض و خرید بسته های اینترنت ، مکالمه و پیامک اقتصادی و به صرفه"
    width={250}
    height={250}
    className="w-12 h-12 md:w-30 md:h-30 object-contain"
  />
);
const ModemIcon = () => (
  <Image
    src="/images/home_icons/modem.png"
    alt="خرید مودم"
    width={250}
    height={250}
    className="w-12 h-12 md:w-30 md:h-30 object-contain"
  />
);
const SupportIcon = () => (
  <Image
    src="/images/home_icons/khadamat.png"
    alt="خدمات ایرانسل"
    width={250}
    height={250}
    className="w-12 h-12 md:w-30 md:h-30 object-contain"
  />
);
const CorporateIcon = () => (
  <Image
    src="/images/home_icons/sazmani.png"
    alt="محصولات سازمانی - سیمکارت سازمانی و بیلبوردی"
    width={250}
    height={250}
    className="w-12 h-12 md:w-30 md:h-30 object-contain"
  />
);

export default function Home() {
  const menuItems = [
    { title: 'خرید سیم‌کارت', desc: 'دائمی، اعتباری و آپتل', icon: <SimCardIcon />, link: '/simcard' },
    { title: 'خدمات قبض و شارژ', desc: 'قبض، شارژ و بسته‌های اقتصادی', icon: <ReceiptIcon />, link: '/recharge' },
    { title: 'مودم', desc: 'مودم‌های 4G و 5G و ثابت', icon: <ModemIcon />, link: '/modem' },
    { title: 'خدمات', desc: 'تعویض سیم‌کارت، ترابرد و پشتیبانی', icon: <SupportIcon />, link: '/services' },
    { title: 'محصولات سازمانی', desc: 'ویژه کسب‌وکارها و شرکت‌ها', icon: <CorporateIcon />, link: '/corporate' },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-10 md:py-20 flex-1">

      {/* Container با عرض 80 درصد */}
      <div className="w-[90%] lg:w-[80%] mx-auto">

        {/* گرید 5 ستونه در نمایشگرهای بزرگ */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {menuItems.map((item, index) => (
            <Link
              href={item.link}
              key={index}
              className={`bg-white rounded-[1rem] md:rounded-[2rem] shadow-[0_0_25px_rgba(0,0,0,0.08)] transition-all duration-300 flex items-center group border border-transparent border-gray-300 hover:border-[#ffda46]/50 md:min-h-[220px] ${index === 4
                ? 'col-span-2 md:col-span-1 flex-row md:flex-col justify-between md:justify-center p-4 md:p-6 min-h-[90px]'
                : 'flex-col justify-center text-center p-1 md:p-6 min-h-[140px]'
                }`}
            >
              <div className="rounded-3xl p-1 md:p-4 mb-1 md:mb-5 group-hover:scale-110 transition-all duration-300">
                {item.icon}
              </div>
              <div className={index === 4 ? 'text-right md:text-center flex-1 pr-3 md:pr-0' : 'text-center'}>
                <h2 className="text-sm md:text-lg font-bold text-gray-800 mb-1 md:mb-2">{item.title}</h2>
                <p className={`text-xs md:text-sm text-gray-500 leading-relaxed ${index === 4 ? ' px-0 ' : ' px-2 '}`}>{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}