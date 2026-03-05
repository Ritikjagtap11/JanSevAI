import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * individual scheme display
 */
const SchemeCard = ({ scheme }) => {
    const { t } = useTranslation();

    const score = Math.round(scheme.eligibilityScore || 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white border border-rose/5 rounded-lg p-6 flex flex-col h-full hover:shadow-xl transition-all relative overflow-hidden"
        >
            {/* accent line on hover */}
            <div className="absolute top-0 left-0 h-[3px] bg-rose w-0 group-hover:w-full transition-all duration-500" />

            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-rose/10 rounded flex items-center justify-center text-rose">
                    <div className="w-4 h-4 border-2 border-rose rounded-sm" />
                </div>
                <div className="text-[0.7rem] bg-rose/5 text-rose font-bold px-3 py-1 rounded-full uppercase">
                    {score}% {t('result.eligible', 'Match')}
                </div>
            </div>

            <h3 className="font-playfair text-[1.15rem] font-bold text-dark leading-tight mb-2">
                {scheme.schemeName}
            </h3>

            <p className="text-[0.75rem] text-rose font-bold tracking-widest uppercase mb-4">
                {scheme.department}
            </p>

            <p className="text-[0.85rem] text-gray-500 mb-6 flex-grow line-clamp-4">
                {scheme.benefitDescription}
            </p>

            {/* tags section */}
            <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-gray-100 text-gray-600 text-[0.65rem] px-2 py-0.5 rounded border border-gray-200">
                    {scheme.processMode}
                </span>
                <span className="bg-gray-100 text-gray-600 text-[0.65rem] px-2 py-0.5 rounded border border-gray-200 uppercase">
                    {scheme.category || 'Scholarship'}
                </span>
            </div>

            <a
                href={scheme.officialLink}
                target="_blank"
                rel="noreferrer"
                className="mt-auto flex items-center justify-center gap-2 border-2 border-dark py-2 text-[0.9rem] font-bold text-dark hover:bg-dark hover:text-white transition-colors rounded"
            >
                <span>{t('result.applyNow')}</span>
                <ExternalLink size={14} />
            </a>
        </motion.div>
    );
};

export default SchemeCard;
