import Link from 'next/link';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#002B5E]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

export default function Header() {
    return (
        <header className="w-full bg-[#FFCC00] py-4 px-6 md:px-12 shadow-md flex justify-between items-center z-20 relative">
            <div className="text-[#002B5E] font-extrabold xs:text-base sm:text-xl md:text-2xl">
                مرکز ارتباط با ایرانسل - کد ۶۵۰۱۶
            </div>
            <Link href="/profile" className="p-2 bg-white/40 rounded-full hover:bg-white transition-all shadow-sm">
                <UserIcon />
            </Link>
        </header>
    );
}