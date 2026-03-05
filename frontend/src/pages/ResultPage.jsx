import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SchemeCard from '../components/SchemeCard';

const ResultPage = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { eligibleSchemes, citizen } = location.state || { eligibleSchemes: [], citizen: null };

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!citizen) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-subtle px-10">
                <div className="text-center max-w-[400px]">
                    <div className="w-[60px] h-[60px] bg-rose/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <div className="w-6 h-6 border-2 border-rose rounded-sm" />
                    </div>
                    <h2 className="font-playfair text-[1.8rem] font-bold text-dark mb-4">Profile Not Found</h2>
                    <p className="font-dmsans text-[0.95rem] text-[#7a7070] mb-8">Please fill the digital form first to see eligible government schemes.</p>
                    <button
                        onClick={() => navigate('/form')}
                        className="w-full bg-dark hover:bg-rose text-white font-dmsans font-semibold text-[0.9rem] tracking-button py-[14px] rounded-[4px] transition-250"
                    >
                        Go to Citizen Form
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-subtle">
            <Navbar />

            <main className="pt-[140px] pb-20 px-10">
                <div className="max-w-[1280px] mx-auto text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                        className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
                    >
                        <div>
                            <span className="block text-[0.72rem] font-semibold text-rose uppercase tracking-widest mb-1">
                                {t('result.label', 'YOUR RESULTS')}
                            </span>
                            <h1 className="font-playfair text-[2.1rem] font-bold text-dark mb-3">
                                {t('result.title')}
                            </h1>
                            <div className="w-[48px] h-[3px] bg-rose rounded-[2px]" />
                        </div>

                        <div className="text-right">
                            <span className="text-[0.9rem] text-rose font-medium">
                                {eligibleSchemes.length} Schemes Found for {citizen.fullName.split(' ')[0]}
                            </span>
                        </div>
                    </motion.div>

                    {eligibleSchemes.length > 0 ? (
                        <div className="max-w-[1100px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
                            {eligibleSchemes.map((scheme, idx) => (
                                <SchemeCard key={idx} scheme={scheme} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white border border-rose/10 rounded-[8px] max-w-[760px] mx-auto shadow-sm">
                            <div className="w-[60px] h-[60px] bg-rose/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <div className="w-6 h-6 border border-rose/30 rounded-sm" />
                            </div>
                            <h3 className="font-playfair text-[1.4rem] font-bold text-dark mb-2">No Matching Schemes</h3>
                            <p className="font-dmsans text-[0.9rem] text-[#7a7070] mb-8 max-w-[400px] mx-auto">
                                We couldn't find any schemes matching your current profile details. Try updating your information.
                            </p>
                            <button
                                onClick={() => navigate('/form')}
                                className="w-[200px] bg-transparent border-[1.5px] border-dark text-dark font-dmsans font-semibold text-[0.9rem] tracking-button py-[12px] rounded-[4px] transition-250 hover:bg-dark hover:text-white mx-auto"
                            >
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ResultPage;
