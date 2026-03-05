import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="relative group">
            <button className="flex items-center space-x-2 bg-transparent border-[1.5px] border-rose-light text-rose-light px-4 py-2 rounded-[4px] font-dmsans font-semibold text-[0.9rem] tracking-button transition-250 hover:bg-rose-light hover:text-white">
                <span>भाषा / Language</span>
            </button>
            <div className="absolute left-0 mt-2 w-32 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden border border-rose/20">
                <button
                    onClick={() => changeLanguage('en')}
                    className={`w-full text-left px-4 py-2 hover:bg-bg-subtle transition-colors font-dmsans text-[0.9rem] ${i18n.language === 'en' ? 'bg-rose text-white' : 'text-dark'}`}
                >
                    English
                </button>
                <button
                    onClick={() => changeLanguage('mr')}
                    className={`w-full text-left px-4 py-2 hover:bg-bg-subtle transition-colors font-dmsans text-[0.9rem] ${i18n.language === 'mr' ? 'bg-rose text-white' : 'text-dark font-regional'}`}
                >
                    मराठी
                </button>
                <button
                    onClick={() => changeLanguage('hi')}
                    className={`w-full text-left px-4 py-2 hover:bg-bg-subtle transition-colors font-dmsans text-[0.9rem] ${i18n.language === 'hi' ? 'bg-rose text-white' : 'text-dark font-regional'}`}
                >
                    हिंदी
                </button>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
