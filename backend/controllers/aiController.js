const fs = require('fs');
const path = require('path');
const { analyzeWithOllama } = require('../services/ollamaService');
const Citizen = require('../models/Citizen');

/**
 * Enhanced Preliminary Weighted Scorer (Phase 1)
 * Follows the logic from the user's ai_prompt.txt
 */
const getPreScore = (c, s) => {
    let score = 0;

    // Hard Blockers (Gender, Age, Income, BPL, Caste, Occupation, Marital, Disability)

    // 1. Gender check
    if (s.eligibleGenders?.length > 0 && !s.eligibleGenders.includes(c.gender)) return 0;

    // 2. Age check
    if (c.age && (s.minAge !== null && s.maxAge !== null)) {
        if (c.age < s.minAge - 2 || c.age > s.maxAge + 2) return 0; // Hard fail
        if (c.age >= s.minAge && c.age <= s.maxAge) score += 20;
        else score += 10; // Borderline
    } else {
        score += 20;
    }

    // 3. Caste check
    if (s.eligibleCastes?.length > 0 && !s.eligibleCastes.includes(c.caste)) return 0;
    score += 15;

    // 4. Income match
    if (s.maxIncome) {
        if (c.annualIncome > s.maxIncome * 1.1) return 0;
        if (c.annualIncome <= s.maxIncome) score += 15;
        else score += 7; // Borderline
    } else {
        score += 15;
    }

    // 5. BPL match
    if (s.requiresBPL && !c.isBPL && c.annualIncome > 21000) return 0;
    score += 10;

    // 6. Occupation match
    if (s.eligibleOccupations?.length > 0) {
        // Simple string match or simple fuzzy check for pre-scoring
        const normalizedOcc = c.occupation?.toLowerCase();
        const matchesOcc = s.eligibleOccupations.some(o => normalizedOcc.includes(o.toLowerCase()));
        if (!matchesOcc) return 0;
        score += 5;
    } else {
        score += 5;
    }

    // 7. Marital match
    if (s.maritalStatus?.length > 0 && !s.maritalStatus.includes(c.maritalStatus)) return 0;
    score += 5;

    // 8. Disability check
    if (s.requiresDisability && !c.hasDisability) return 0;
    score += 5;

    // 9. Granularity: Proximity to limits (e.g. closer to max income or age limit might affect score)
    if (s.maxIncome && c.annualIncome <= s.maxIncome) {
        // give a tiny boost to lower income relative to max
        const mobility = (s.maxIncome - c.annualIncome) / s.maxIncome;
        score += mobility * 5;
    }

    if (s.maxAge && c.age <= s.maxAge) {
        // give a tiny boost based on age fit
        const ageRange = s.maxAge - s.minAge || 1;
        const fit = (s.maxAge - c.age) / ageRange;
        score += fit * 5;
    }

    return Math.round(score);
};

const minimize = (list) => list.map(s => ({
    schemeName: s.schemeName,
    department: s.department,
    minAge: s.minAge,
    maxAge: s.maxAge,
    maxIncome: s.maxIncome,
    eligibleGenders: s.eligibleGenders,
    eligibleCastes: s.eligibleCastes,
    eligibleOccupations: s.eligibleOccupations,
    requiresDisability: s.requiresDisability,
    requiresBPL: s.requiresBPL,
    maritalStatus: s.maritalStatus,
    documentsRequired: s.documentsRequired
}));

const analyzeEligibility = async (req, res) => {
    try {
        const { citizenId, citizenData } = req.body;
        let c = citizenData || (citizenId ? await Citizen.findById(citizenId) : null);
        if (!c) return res.status(404).json({ message: 'Missing citizen data' });

        // User requested to use ai_prompt.txt
        const promptPath = path.join(__dirname, '../prompts/ai_prompt.txt');
        const systemPrompt = fs.readFileSync(promptPath, 'utf8');
        const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/gov_dataset.json'), 'utf8'));

        console.log(`Phase 1: Ranking ${db.length} schemes...`);
        const rated = db.map(s => ({
            ...s,
            preScore: getPreScore(c, s)
        })).filter(s => s.preScore > 0);

        // Limit to top 5-8 for stability
        const candidates = rated
            .sort((a, b) => b.preScore - a.preScore)
            .slice(0, 8);

        // tiny optimization: we need preScore later for enrichment fallback if AI is weird
        candidates.forEach(c => {
            // it's already there but let's be explicit
        });

        console.log(`Phase 2: Sending top ${candidates.length} candidates to Ollama...`);

        const citizenInfo = {
            fullName: c.fullName || "Citizen",
            age: c.age,
            gender: c.gender,
            caste: c.caste,
            annualIncome: c.annualIncome,
            isBPL: c.isBPL || c.annualIncome < 21000,
            occupation: c.occupation,
            maritalStatus: c.maritalStatus,
            hasDisability: c.hasDisability,
            availableDocuments: c.availableDocuments || [],
            state: "Maharashtra"
        };

        const userMessage = `Analyze following citizen: ${JSON.stringify(citizenInfo)} against these schemes: ${JSON.stringify(minimize(candidates))}`;

        let aiResponse;
        try {
            aiResponse = await analyzeWithOllama(systemPrompt, userMessage);
            console.log('--- RAW AI RESULTS ---');
            console.log(JSON.stringify(aiResponse, null, 2));
        } catch (err) {
            console.warn('AI failed, using fallback results');
            // Basic fallback based on pre-scores
            aiResponse = {
                eligibleSchemes: candidates.map(s => ({
                    schemeName: s.schemeName,
                    eligibilityScore: Math.round(s.preScore * 1.1),
                    reasonForEligibility: "Matches basic criteria."
                }))
            };
        }

        // Pass 3: Data Enrichment & Formatting
        console.log('Enriching results...');
        const list = aiResponse.eligibleSchemes || [];

        let finalResults = list.map(r => {
            const aiName = (r.schemeName || '').toLowerCase().trim();
            const match = db.find(s => {
                const dbName = s.schemeName.toLowerCase().trim();
                return dbName === aiName || dbName.includes(aiName) || aiName.includes(dbName);
            });

            if (match) {
                // use AI score if available, otherwise fallback to our phase 1 preScore 
                const rawScore = r.eligibilityScore || r.score || (match.preScore ? Math.round(match.preScore * 1.1) : 0);

                return {
                    ...match,
                    eligibilityScore: Math.min(100, Math.max(0, rawScore)),
                    eligibilityLabel: r.eligibilityLabel || (rawScore >= 90 ? 'Highly Eligible' : rawScore >= 75 ? 'Strongly Eligible' : 'Eligible'),
                    reason: r.reasonForEligibility || r.reason || 'Strong match found based on your profile.',
                    scoreBreakdown: r.scoreBreakdown
                };
            }
            return null;
        }).filter(Boolean);

        // final sorting
        finalResults.sort((a, b) => b.eligibilityScore - a.eligibilityScore);

        if (citizenId) {
            await Citizen.findByIdAndUpdate(citizenId, { matchedSchemes: finalResults });
        }

        res.status(200).json(finalResults);

    } catch (crash) {
        console.error('Big crash in controller:', crash);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { analyzeEligibility };
