const fs = require('fs');
const path = require('path');
const { analyzeWithOllama } = require('../services/ollamaService');
const Citizen = require('../models/Citizen');

// rough scoring to rank candidates before AI check
const getPreScore = (c, s) => {
    let score = 0;

    // 1. Gender check (hard)
    if (s.eligibleGenders?.length > 0 && !s.eligibleGenders.includes(c.gender)) return 0;

    // 2. Age check (hard)
    if (c.age && ((s.minAge && c.age < s.minAge) || (s.maxAge && c.age > s.maxAge))) return 0;

    // 3. Income check
    if (s.maxIncome) {
        if (c.annualIncome > s.maxIncome) return 0;
        score += 20; // eligible by income
    } else {
        score += 10; // general scheme
    }

    // 4. Occupation match (weighted)
    if (s.eligibleOccupations?.length > 0) {
        if (s.eligibleOccupations.includes(c.occupation)) {
            score += 40; // strong match
        } else {
            // maybe a partial match or generic
            score -= 10;
        }
    } else {
        score += 15; // open to all occupations
    }

    // 5. Caste match
    if (s.eligibleCastes?.length > 0) {
        if (s.eligibleCastes.includes(c.caste)) score += 20;
    } else {
        score += 10;
    }

    // 6. BPL match
    if (s.requiresBPL && !c.isBPL) return 0;
    if (s.requiresBPL && c.isBPL) score += 10;

    return score;
};

const minimize = (list) => list.map(s => ({
    name: s.schemeName,
    age: `${s.minAge}-${s.maxAge}`,
    inc: s.maxIncome,
    gen: s.eligibleGenders,
    cst: s.eligibleCastes,
    occ: s.eligibleOccupations,
    bpl: s.requiresBPL
}));

const analyzeEligibility = async (req, res) => {
    try {
        const { citizenId, citizenData } = req.body;
        let c = citizenData || (citizenId ? await Citizen.findById(citizenId) : null);
        if (!c) return res.status(404).json({ message: 'missing data' });

        const prompt = fs.readFileSync(path.join(__dirname, '../prompts/ollama_prompt.txt'), 'utf8');
        const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/gov_dataset.json'), 'utf8'));

        // Pass 1: JS Scoring (check all 50+ schemes)
        console.log(`Analyzing ${db.length} schemes locally first...`);
        const scored = db.map(s => ({
            ...s,
            preScore: getPreScore(c, s)
        })).filter(s => s.preScore > 0);

        // Take Top 5 for AI (keep low for VRAM safety)
        const candidates = scored
            .sort((a, b) => b.preScore - a.preScore)
            .slice(0, 5);

        console.log(`Sending top ${candidates.length} candidates to AI for refinement...`);

        let found;
        try {
            const msg = `Match: ${JSON.stringify({
                gender: c.gender, age: c.age, income: c.annualIncome,
                occupation: c.occupation, caste: c.caste, bpl: c.isBPL
            })} against: ${JSON.stringify(minimize(candidates))}`;

            found = await analyzeWithOllama(prompt, msg);
            console.log('--- OLLAMA RAW OUTPUT ---');
            console.log(JSON.stringify(found, null, 2));

            if (found && !Array.isArray(found)) {
                if (found.schemeName) found = [found];
                else found = found.results || [];
            }
        } catch (err) {
            console.error('ai failure:', err.message);
            // backup: if AI fails, return the pre-scored candidates (better than nothing)
            found = candidates.map(s => ({ schemeName: s.schemeName, eligibilityScore: 70, reason: 'Eligible based on basic criteria.' }));
        }

        // Pass 3: Data Enrichment
        console.log('Enriching results...');
        let enriched = (found || []).map(r => {
            const aiName = (r.schemeName || r.name || '').toLowerCase().trim();
            // Fuzzy search: try exact match first, then see if aiName is contained within dbName
            const match = db.find(s => {
                const dbName = s.schemeName.toLowerCase().trim();
                return dbName === aiName || dbName.includes(aiName) || aiName.includes(dbName);
            });

            if (match) {
                return {
                    ...match,
                    eligibilityScore: r.eligibilityScore || 80,
                    reason: r.reason || 'Criteria matched'
                };
            }
            return null;
        }).filter(Boolean);

        console.log(`Matched ${enriched.length} schemes after enrichment.`);

        // Final Sort & Filter
        const finalResults = enriched
            .filter(s => s.eligibilityScore >= 50)
            .sort((a, b) => b.eligibilityScore - a.eligibilityScore);

        if (citizenId) await Citizen.findByIdAndUpdate(citizenId, { matchedSchemes: finalResults });

        res.status(200).json(finalResults);

    } catch (error) {
        console.error('fatal error:', error);
        res.status(500).json({ message: 'server error' });
    }
};

module.exports = { analyzeEligibility };
