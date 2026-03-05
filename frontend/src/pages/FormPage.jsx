import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CitizenForm from '../components/CitizenForm';
import { motion } from 'framer-motion';

const FormPage = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-bg-subtle">
            <Navbar />

            <main className="pt-[140px] pb-20 px-10">
                <div className="max-w-[1280px] mx-auto text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                        className="mb-12"
                    >
                        <span className="block text-[0.72rem] font-semibold text-rose uppercase tracking-widest mb-1">
                            {t('form.step1Label', 'STEP 1')}
                        </span>
                        <h1 className="font-playfair text-[2.1rem] font-bold text-dark mb-3">
                            {t('form.title')}
                        </h1>
                        <div className="w-[48px] h-[3px] bg-rose rounded-[2px]" />
                    </motion.div>

                    <CitizenForm />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FormPage;
