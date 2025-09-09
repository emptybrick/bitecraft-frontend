const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const Ingredient = require('../models/ingredient.js');
const { keys } = require('lodash');

router.get('/', verifyToken, async (req, res) => {
    try {
        const results = await Ingredient.find({});
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const name = keys(req.body)[ 0 ];
        if (!name || typeof name !== 'string' || name.trim().length < 2) {
            return res.status(400).json({ error: 'Invalid name' });
        }
        const trimmedName = name.trim();
        const regex = new RegExp(`^${ trimmedName.split('').join('.*') }$`, 'i');
        const check = await Ingredient.find({ name: { $regex: regex } }).select('name').limit(5);
        if (check && check.length > 0) {
            return res.status(400).json({
                error: "Ingredient already exists!",
                ingredients: check.map(item => item.name)
            });
        }
        const ingredient = await Ingredient.create({ name: trimmedName });
        return res.status(201).json(ingredient);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;