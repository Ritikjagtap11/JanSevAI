const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
    try {
        const schemesPath = path.join(__dirname, '../data/gov_dataset.json');
        const schemesData = fs.readFileSync(schemesPath, 'utf8');
        const schemes = JSON.parse(schemesData);
        res.status(200).json(schemes);
    } catch (error) {
        res.status(500).json({ message: 'Error loading schemes', error: error.message });
    }
});

module.exports = router;
