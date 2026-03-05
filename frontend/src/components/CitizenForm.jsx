import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { saveCitizenData, analyzeEligibility } from '../services/api';

const CitizenForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const initialFormState = {
        fullName: '',
        dateOfBirth: '',
        gender: 'Male',
        caste: 'General',
        annualIncome: 0,
        incomeRange: 'Below Rs. 21,000',
        occupation: 'Other',
        maritalStatus: 'Single',
        hasDisability: false,
        disabilityType: 'None',
        disabilityPercentage: 0,
        educationLevel: 'No Formal Education',
        isMinority: false,
        minorityCommunity: 'None',
        availableDocuments: [],
        state: 'Maharashtra'
    };

    const [formData, setFormData] = useState(initialFormState);
    const [age, setAge] = useState(0);

    // Auto-calculate age
    useEffect(() => {
        if (formData.dateOfBirth) {
            const dob = new Date(formData.dateOfBirth);
            const today = new Date();
            let calculatedAge = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                calculatedAge--;
            }
            setAge(calculatedAge);
        }
    }, [formData.dateOfBirth]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            if (name === 'availableDocuments') {
                const updatedDocs = checked
                    ? [...formData.availableDocuments, value]
                    : formData.availableDocuments.filter(doc => doc !== value);
                setFormData({ ...formData, availableDocuments: updatedDocs });
            } else {
                setFormData({ ...formData, [name]: checked });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const clearForm = () => {
        setFormData(initialFormState);
        setAge(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Step 1: Store Data
            const savedCitizen = await saveCitizenData(formData);

            // Step 2: AI Analysis
            const eligibleSchemes = await analyzeEligibility(savedCitizen._id);

            // Step 3: Redirect to Result Page
            navigate('/result', { state: { eligibleSchemes, citizen: savedCitizen } });
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error processing analysis. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const casteOptions = ['General', 'OBC', 'SC', 'ST', 'EWS', 'SBC', 'VJNT'];
    const incomeOptions = [
        'Below Rs. 21,000',
        'Rs. 21,001 - Rs. 1,00,000',
        'Rs. 1,00,001 - Rs. 1,20,000',
        'Rs. 1,20,001 - Rs. 1,50,000',
        'Rs. 1,50,001 - Rs. 2,50,000',
        'Rs. 2,50,001 - Rs. 8,00,000',
        'Rs. 8,00,001 - Rs. 10,00,000',
        'Rs. 10,00,001 - Rs. 18,00,000',
        'Above Rs. 18,00,000'
    ];
    const occupationOptions = [
        'Farmer (Small / Marginal)',
        'Dairy Farmer',
        'Construction Worker',
        'Unemployed (Educated Graduate)',
        'Student',
        'Farmer\'s Child (Dependent)',
        'Government Employee',
        'Private Employee',
        'Self-Employed / Business',
        'Daily Wage Worker',
        'Housewife',
        'Other'
    ];
    const educationOptions = [
        'No Formal Education',
        'Primary (1st - 7th Std)',
        'School (Up to 10th / SSC)',
        '12th Pass (HSC)',
        'ITI / Vocational Course',
        'Post-Matric (After 10th)',
        'Higher Secondary (12th Pass)',
        'Graduate (Bachelor\'s Degree)',
        'Post-Graduate (Master\'s Degree)',
        'Diploma',
        'Professional Degree'
    ];
    const documentOptions = [
        'Aadhaar Card', 'Ration Card (Yellow / Orange / White / AY Card)', 'BPL Card (Below Poverty Line)',
        'Income Certificate', 'Caste Certificate', 'Domicile / Residence Certificate',
        'Bank Passbook / Account Details', 'Land Records / 7/12 Extract (Satbara Utara)',
        'Birth Certificate', 'Death Certificate (Spouse / Breadwinner)', 'Disability Certificate (UDID)',
        'Minority Certificate', 'Marksheet / Education Certificate', 'Fee Receipt (School / College)',
        'Admission Proof', 'Job Card (MGNREGS)', 'Labour Card (BOCW)', 'Electricity Bill',
        'Crop / Agricultural Details', 'Business Plan Document', 'Project Report',
        'Unemployment Registration Certificate', 'School ID Card', 'Orphan Certificate', 'Photo (Passport Size)'
    ];
    const disabilityOptions = [
        'None', 'Physical Disability', 'Visual Impairment', 'Hearing Impairment',
        'Intellectual / Mental Disability', 'Multiple Disabilities'
    ];
    const minorityOptions = ['None', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi'];

    const inputClass = "w-full bg-dark text-white placeholder:text-white/40 border-none rounded-[4px] p-[13px_16px] focus:ring-2 focus:ring-rose outline-none font-dmsans text-[0.95rem] transition-250";
    const labelClass = "block text-[0.8rem] font-semibold text-rose uppercase tracking-[0.08em] mb-[7px]";

    return (
        <>
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-dark/70 backdrop-blur-[4px] flex items-center justify-center pointer-events-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-[12px] p-[40px] text-center shadow-2xl max-w-sm"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.08, 1] }}
                                transition={{ repeat: Infinity, duration: 1.2 }}
                                className="w-[56px] h-[56px] bg-dark/5 rounded-full flex items-center justify-center p-2 mb-4 mx-auto border border-rose/30"
                            >
                                <div className="w-full h-full border-2 border-rose rounded-full" />
                            </motion.div>
                            <h3 className="font-playfair text-[1.4rem] font-bold text-dark mb-2">Analyzing Your Profile…</h3>
                            <p className="font-dmsans text-[0.9rem] text-rose">Matching against Maharashtra schemes</p>
                            <div className="flex justify-center mt-4 space-x-1">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                                        className="w-2 h-2 rounded-full bg-rose"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.form
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                onSubmit={handleSubmit}
                className="bg-white border border-rose/20 border-t-[4px] border-t-rose rounded-[8px] p-[40px] shadow-[0_2px_20px_rgba(68,63,63,0.06)] max-w-[760px] mx-auto mb-20"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                    {/* Full Name */}
                    <div className="md:col-span-2">
                        <label className={labelClass}>
                            {t('form.fullName')} <span className="text-rose">*</span>
                        </label>
                        <input
                            required
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder={t('form.placeholders.fullName')}
                            className={inputClass}
                        />
                    </div>

                    {/* DOB */}
                    <div>
                        <label className={labelClass}>
                            {t('form.dob')} <span className="text-rose">*</span>
                        </label>
                        <input
                            required
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className={`${inputClass} appearance-none`}
                            style={{ colorScheme: 'dark' }}
                        />
                    </div>

                    {/* Age (Read Only) */}
                    <div>
                        <label className={labelClass}>{t('form.age')}</label>
                        <input
                            readOnly
                            type="number"
                            value={age}
                            className={`${inputClass} bg-dark/90 cursor-not-allowed`}
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className={labelClass}>
                            {t('form.gender')} <span className="text-rose">*</span>
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className={inputClass}
                        >
                            {['Male', 'Female', 'Other'].map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    {/* Marital Status */}
                    <div>
                        <label className={labelClass}>
                            {t('form.maritalStatus')} <span className="text-rose">*</span>
                        </label>
                        <select
                            name="maritalStatus"
                            value={formData.maritalStatus}
                            onChange={handleInputChange}
                            className={inputClass}
                        >
                            {['Single', 'Married', 'Widowed', 'Divorced'].map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    {/* Caste */}
                    <div>
                        <label className={labelClass}>
                            {t('form.caste')} <span className="text-rose">*</span>
                        </label>
                        <select
                            name="caste"
                            value={formData.caste}
                            onChange={handleInputChange}
                            className={inputClass}
                        >
                            {casteOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>

                    {/* Income Range */}
                    <div>
                        <label className={labelClass}>
                            {t('form.annualIncome')} <span className="text-rose">*</span>
                        </label>
                        <select
                            name="incomeRange"
                            value={formData.incomeRange}
                            onChange={(e) => {
                                handleInputChange(e);
                                const values = {
                                    'Below Rs. 21,000': 20000,
                                    'Rs. 21,001 - Rs. 1,00,000': 60000,
                                    'Rs. 1,00,001 - Rs. 1,20,000': 110000,
                                    'Rs. 1,20,001 - Rs. 1,50,000': 135000,
                                    'Rs. 1,50,001 - Rs. 2,50,000': 200000,
                                    'Rs. 2,50,001 - Rs. 8,00,000': 500000,
                                    'Rs. 8,00,001 - Rs. 10,00,000': 900000,
                                    'Rs. 10,00,001 - Rs. 18,00,000': 1400000,
                                    'Above Rs. 18,00,000': 2000000
                                };
                                setFormData(prev => ({ ...prev, annualIncome: values[e.target.value] }));
                            }}
                            className={inputClass}
                        >
                            {incomeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>

                    {/* Occupation */}
                    <div>
                        <label className={labelClass}>
                            {t('form.occupation')} <span className="text-rose">*</span>
                        </label>
                        <select
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleInputChange}
                            className={inputClass}
                        >
                            {occupationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>

                    {/* Education Level */}
                    <div>
                        <label className={labelClass}>
                            {t('form.education')} <span className="text-rose">*</span>
                        </label>
                        <select
                            name="educationLevel"
                            value={formData.educationLevel}
                            onChange={handleInputChange}
                            className={inputClass}
                        >
                            {educationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>

                    {/* Disability Section */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center space-x-4">
                            <label className={labelClass + " !mb-0"}>{t('form.disability')}</label>
                            <div className="flex bg-dark rounded-[4px] p-1">
                                <button type="button" onClick={() => setFormData({ ...formData, hasDisability: true })} className={`px-4 py-1 rounded-[2px] text-[0.7rem] font-bold transition-250 ${formData.hasDisability ? 'bg-rose text-white' : 'text-white/40'}`}>YES</button>
                                <button type="button" onClick={() => setFormData({ ...formData, hasDisability: false, disabilityType: 'None', disabilityPercentage: 0 })} className={`px-4 py-1 rounded-[2px] text-[0.7rem] font-bold transition-250 ${!formData.hasDisability ? 'bg-rose text-white' : 'text-white/40'}`}>NO</button>
                            </div>
                        </div>

                        {formData.hasDisability && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
                                <div>
                                    <label className={labelClass}>Disability Type</label>
                                    <select name="disabilityType" value={formData.disabilityType} onChange={handleInputChange} className={inputClass}>
                                        {disabilityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Percentage ({formData.disabilityPercentage}%)</label>
                                    <input type="range" name="disabilityPercentage" min="0" max="100" value={formData.disabilityPercentage} onChange={handleInputChange} className="w-full accent-rose" />
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Minority Section */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center space-x-4">
                            <label className={labelClass + " !mb-0"}>{t('form.minority')}</label>
                            <div className="flex bg-dark rounded-[4px] p-1">
                                <button type="button" onClick={() => setFormData({ ...formData, isMinority: true })} className={`px-4 py-1 rounded-[2px] text-[0.7rem] font-bold transition-250 ${formData.isMinority ? 'bg-rose text-white' : 'text-white/40'}`}>YES</button>
                                <button type="button" onClick={() => setFormData({ ...formData, isMinority: false, minorityCommunity: 'None' })} className={`px-4 py-1 rounded-[2px] text-[0.7rem] font-bold transition-250 ${!formData.isMinority ? 'bg-rose text-white' : 'text-white/40'}`}>NO</button>
                            </div>
                        </div>

                        {formData.isMinority && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                                <label className={labelClass}>Minority Community</label>
                                <select name="minorityCommunity" value={formData.minorityCommunity} onChange={handleInputChange} className={inputClass}>
                                    {minorityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </motion.div>
                        )}
                    </div>

                    {/* Documents */}
                    <div className="md:col-span-2 mt-4">
                        <label className={labelClass}>{t('form.documents')} <span className="text-rose">*</span></label>
                        <div className="max-h-[200px] overflow-y-auto border border-rose/10 rounded-[4px] p-4 bg-bg-subtle/50">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {documentOptions.map(doc => (
                                    <label key={doc} className="flex items-center space-x-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name="availableDocuments"
                                            value={doc}
                                            checked={formData.availableDocuments.includes(doc)}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 rounded border-rose accent-rose"
                                        />
                                        <span className="text-[0.85rem] text-dark/80 group-hover:text-dark transition-colors">{doc}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-[12px] mt-9">
                    <button
                        type="button"
                        onClick={clearForm}
                        className="w-[160px] bg-transparent border-[1.5px] border-dark text-dark font-dmsans font-semibold text-[0.9rem] tracking-button py-[13px] rounded-[4px] transition-250 hover:bg-dark hover:text-white"
                    >
                        {t('form.clearForm')}
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-[200px] bg-dark hover:bg-rose text-white font-dmsans font-semibold text-[0.9rem] tracking-button py-[13px] rounded-[4px] shadow-[0_4px_20px_rgba(68,63,63,0.2)] transition-250 hover:-translate-y-[2px]"
                    >
                        {loading ? 'Analyzing…' : t('form.checkScheme')}
                    </button>
                </div>
            </motion.form>
        </>
    );
};

export default CitizenForm;
