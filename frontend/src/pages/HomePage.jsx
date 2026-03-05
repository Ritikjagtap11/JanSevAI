import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import heroImg from '../assets/hero.png';
import logo from "../assets/logo.png";

const HomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleExplore = () => {
        navigate('/form');
    };

    return (
        <div className="min-h-screen bg-bg-subtle">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <section className="h-screen flex flex-col md:flex-row items-stretch overflow-hidden pt-[68px]">

                {/* Image side */}
                <div className="flex-1 relative order-2 md:order-1">
                    <img
                        src={heroImg}
                        alt="Rural landscape"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark/30 to-transparent" />
                </div>

                {/* Content side */}
                <div className="flex-1 bg-bg-subtle flex justify-center items-center px-[50px] relative order-1 md:order-2">
                    {/* decorative bar */}
                    <div className="hidden md:block absolute right-0 top-1/4 bottom-1/4 w-[5px] bg-gradient-to-b from-transparent via-rose to-transparent rounded-l-full " />

                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-[500px]"
                    >
                        {/* the main logo area */}
                        <div className="w-[180px] h-[180px] bg-dark/5 rounded-md flex items-center justify-center p-2 mb-5 border border-rose/20">
                            <img
                                src={logo}
                                alt="JanSev Logo"
                                className="w-full h-full object-contain rounded-full"
                            />
                        </div>

                        <h1 className="font-playfair text-[clamp(2.5rem,5vw,4rem)] font-bold text-dark leading-tight mb-2">
                            JanSev<span className="text-rose">AI</span>
                        </h1>

                        <p className="font-dmsans text-[1.1rem] font-normal text-rose tracking-relaxed mb-7 opacity-90">
                            {t('home.tagline')}
                        </p>

                        <div className="flex flex-wrap gap-[10px] mb-9">
                            <span className="px-[14px] py-[5px] rounded-[20px] bg-dark text-white text-[0.75rem] font-medium tracking-wide">
                                {t('home.onePortal')}
                            </span>
                            <span className="px-[14px] py-[5px] rounded-[20px] bg-rose/15 text-dark border border-rose text-[0.75rem] font-medium tracking-wide uppercase">
                                {t('home.allSchemes')}
                            </span>
                            <span className="px-[14px] py-[5px] rounded-[20px] bg-transparent text-rose border-[1.5px] border-rose text-[0.75rem] font-medium tracking-wide uppercase">
                                {t('home.maharashtraLanguage')}
                            </span>
                        </div>

                        <button
                            onClick={handleExplore}
                            className="bg-rose hover:bg-rose-light text-white px-8 py-[14px] rounded-[4px] font-dmsans font-semibold text-[0.95rem] shadow-lg transition-all hover:-translate-y-[2px]"
                        >
                            {t('home.exploreSchemes')} →
                        </button>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HomePage;
