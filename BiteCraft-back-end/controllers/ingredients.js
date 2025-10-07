const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const Ingredient = require('../models/ingredient.js');
const { keys } = require('lodash');

router.get('/', verifyToken, async (req, res) => {
    try {
        if (req.query.all === "true") {
            const results = await Ingredient.find({});
            res.status(200).json(results);
        } else {
            const name = req.query.search;
            if (!name || typeof name !== 'string' || name.trim().length < 2) {
                return res.status(400).json({ error: 'Invalid name' });
            }
            const trimmedName = name.trim();

            const query = [
                {
                    $search: {
                        index: "ingredientSearch",
                        text: {
                            query: trimmedName,
                            path: "name",
                            fuzzy: { maxEdits: 2, prefixLength: 3 }
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        name: 1,
                        score: { $meta: "searchScore" },
                    },
                },

                {
                    $limit: 5,
                }
            ];

            const findInCollection = await Ingredient.aggregate(query);
            
            if (findInCollection && findInCollection.length > 0) {
                return res.status(200).json({
                    message: "Similar ingredient(s) found, Please confirm the name or select an existing one.",
                    searchedItem: trimmedName,
                    itemsFound: findInCollection.map(item => item.name)
                });
            } else {
                return res.status(200).json({message: "No siminal ingredient(s) found."})
            }
        }
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
        const ingredient = await Ingredient.create({ name: trimmedName });
        return res.status(201).json(ingredient);

    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;