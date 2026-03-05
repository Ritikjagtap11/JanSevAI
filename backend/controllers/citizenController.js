const Citizen = require('../models/Citizen');

const saveCitizen = async (req, res) => {
    try {
        const citizenData = req.body;

        // Mongoose pre-save middleware will handle age and isBPL
        const citizen = new Citizen(citizenData);
        await citizen.save();

        res.status(201).json(citizen);
    } catch (error) {
        console.error('Save Citizen Error:', error);
        res.status(400).json({ message: 'Error saving citizen data', error: error.message });
    }
};

module.exports = {
    saveCitizen
};
