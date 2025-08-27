const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const Ingredient = require('../models/ingredient.js');

router.get('/autocomplete', verifyToken, async (req, res) => {
    const userInput = req.query.query?.trim();
    if (!userInput) {
        return res.status(400).json({ error: 'Query parameter required' });
    }

    try {
        const pipeline = [
            {
                $search: {
                    index: 'ingredientSearch',
                    autocomplete: {
                        query: userInput,
                        path: 'name',
                        fuzzy: { maxEdits: 2, prefixLength: 1, maxExpansions: 50 }
                    }
                }
            },
            { $limit: 5 },
            { $project: { name: 1, score: { $meta: 'searchScore' }, _id: 1 } }
        ];

        const results = await Ingredient.aggregate(pipeline);
        const formattedResults = results.map(result => ({
            name: result.name,
            score: Math.min(Math.round(result.score * 100), 100), 
            id: result._id.toString()
        }));

        res.json(formattedResults);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ error: 'Invalid name' });
    }

    const trimmedName = name.trim();

    try {
        // Check for duplicates
        const pipeline = [
            {
                $search: {
                    index: 'ingredientSearch', 
                    text: {
                        query: trimmedName,
                        path: 'name',
                        fuzzy: { maxEdits: 2 }
                    }
                }
            },
            { $limit: 1 },
            { $project: { name: 1, score: { $meta: 'searchScore' } } }
        ];

        const duplicates = await Ingredient.aggregate(pipeline);
        if (duplicates.length > 0 && duplicates[ 0 ].score > 0.9) {
            return res.status(400).json({
                error: `Name similar to "${ duplicates[ 0 ].name }" (score: ${ Math.round(duplicates[ 0 ].score * 100) })`,
                suggestedName: duplicates[ 0 ].name
            });
        }

        const ingredient = await Ingredient.create({ name: trimmedName });
        res.status(201).json(ingredient);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;