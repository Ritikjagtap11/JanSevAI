const mongoose = require('mongoose');

const citizenSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    caste: {
        type: String,
        enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'SBC', 'VJNT'],
        required: true
    },
    annualIncome: {
        type: Number,
        required: [true, 'Annual income is required'],
        min: 0
    },
    incomeRange: {
        type: String,
        enum: [
            'Below Rs. 21,000',
            'Rs. 21,001 - Rs. 1,00,000',
            'Rs. 1,00,001 - Rs. 1,20,000',
            'Rs. 1,20,001 - Rs. 1,50,000',
            'Rs. 1,50,001 - Rs. 2,50,000',
            'Rs. 2,50,001 - Rs. 8,00,000',
            'Rs. 8,00,001 - Rs. 10,00,000',
            'Rs. 10,00,001 - Rs. 18,00,000',
            'Above Rs. 18,00,000'
        ]
    },
    isBPL: {
        type: Boolean,
        default: false
    },
    occupation: {
        type: String,
        enum: [
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
        ],
        required: true
    },
    maritalStatus: {
        type: String,
        enum: ['Single', 'Married', 'Widowed', 'Divorced'],
        required: true
    },
    hasDisability: {
        type: Boolean,
        default: false
    },
    disabilityType: {
        type: String,
        enum: [
            'None',
            'Physical Disability',
            'Visual Impairment',
            'Hearing Impairment',
            'Intellectual / Mental Disability',
            'Multiple Disabilities'
        ],
        default: 'None'
    },
    disabilityPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    educationLevel: {
        type: String,
        enum: [
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
        ],
        required: true
    },
    isMinority: {
        type: Boolean,
        default: false
    },
    minorityCommunity: {
        type: String,
        enum: ['None', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi'],
        default: 'None'
    },
    availableDocuments: [{
        type: String
    }],
    state: {
        type: String,
        default: 'Maharashtra'
    },
    matchedSchemes: [{
        type: Object
    }]
}, {
    timestamps: true
});

// PRE-SAVE MIDDLEWARE
citizenSchema.pre('save', function () {
    // Auto-calculate age from dateOfBirth
    if (this.dateOfBirth) {
        const diff = Date.now() - this.dateOfBirth.getTime();
        const ageDate = new Date(diff);
        this.age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    // Auto-set isBPL = true if annualIncome < 21000
    if (this.annualIncome !== undefined) {
        this.isBPL = this.annualIncome < 21000;
    }
});

module.exports = mongoose.model('Citizen', citizenSchema);
