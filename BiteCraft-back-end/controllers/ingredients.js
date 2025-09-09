const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const Ingredient = require('../models/ingredient.js');

router.get('/', verifyToken, async (req, res) => {
    try {
        const results = await Ingredient.find({});
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ error: 'Invalid name' });
    }
    try {
        const result = await Ingredient.find({ name: { $regex: userInput.toLowerCase(), $options: "i" } });

        if (result) {
            res.status(400).json({ error: 'Ingredient already in database.' });
        }
        const trimmedName = name.trim();
        const ingredient = await Ingredient.create({ name: trimmedName });
        res.status(201).json(ingredient);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;