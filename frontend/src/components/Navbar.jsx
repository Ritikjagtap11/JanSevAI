import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import logo from "../assets/logo.png";

const Navbar = () => {
    const { t } = useTranslation();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-10 py-[15px] flex items-center justify-between bg-dark/95 backdrop-blur-[10px] border-b border-rose/20">

            {/* left: lang n stuff */}
            <div className="flex items-center space-x-[15px]">
                <LanguageSwitcher />
                <Link
                    to="/form"
                    className="bg-rose hover:bg-rose-light text-white px-6 py-[12px] rounded-[4px] font-dmsans font-semibold text-[0.85rem] transition-all hover:shadow-md"
                >
                    {t('navbar.fillForm')}
                </Link>
            </div>

            {/* right: logo and branding */}
            <Link to="/" className="flex items-center space-x-3 text-right">
                <div className="hidden sm:block">
                    <h1 className="font-playfair text-[2.2rem] font-bold text-white leading-none">
                        JanSev<span className="text-rose-light">AI</span>
                    </h1>
                    <p className="font-dmsans text-[9px] text-rose tracking-widest uppercase mt-1 opacity-80">
                        Digital Saathi
                    </p>
                </div>

                <div className="w-[42px] h-[42px] bg-white/5 rounded-full flex items-center justify-center p-1 border border-white/10">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-full h-full object-contain rounded-full"
                    />
                </div>
            </Link>
        </nav>
    );
};

export default Navbar;
