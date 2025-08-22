const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const User = require('../models/user');

router.get('/:userId/recipes-collection', verifyToken, async (req, res) => {
    try {
        const user = await User.find(req.params.userId);
        if (!user) {
            return res.status(404).json({ err: 'User not found.' });
        }
        const recipes = user.recipesCollection;
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ err: err.message });
    }
});

router.get('/:userId/meals-collection', verifyToken, async (req, res) => {
    try {
        const user = await User.find(req.params.userId);
        if (!user) {
            return res.status(404).json({ err: 'User not found.' });
        }
        const meals = user.mealsCollection;
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ err: err.message });
    }
});

router.post('/:userId/meals-collection', verifyToken, async (req, res) => {
    try {
        const user = await User.find(req.params.userId);

        if (!user) {
            return res.status(404).json({ err: 'User not found.' });
        }
        if (req.user._id !== req.params.userId) {
            return res.status(403).send("You're not allowed to do that!");
        }

        const updateMealCollection = await User.findByIdAndUpdate(
            { _id: req.params.userId },
            { $push: { mealsCollection: req.body } },
            { new: true, runValidators: true }
        );

        if (!updateMealCollection) {
            return res.status(404).send("Recipe not found");
        }

        res.status(201).json(updateMealCollection);

    } catch (error) {
        res.status(500).json({ err: err.message });
    }
});

router.post('/:userId/recipes-collection', verifyToken, async (req, res) => {
    try {
        const user = await User.find(req.params.userId);

        if (!user) {
            return res.status(404).json({ err: 'User not found.' });
        }
        if (req.user._id !== req.params.userId) {
            return res.status(403).send("You're not allowed to do that!");
        }

        const updateRecipeCollection = await User.findByIdAndUpdate(
            { _id: req.params.userId },
            { $push: { recipesCollection: req.body } },
            { new: true, runValidators: true }
        );

        if (!updateRecipeCollection) {
            return res.status(404).send("Recipe not found");
        }
        res.status(201).json(updateRecipeCollection);
    } catch (error) {
        res.status(500).json({ err: err.message });
    }
});

router.delete('/:userId/recipes-collection/:recipeId', verifyToken, async (req, res) => {
    try {
        const user = await User.find(req.params.userId);

        if (!user) {
            return res.status(404).json({ err: 'User not found.' });
        }
        if (req.user._id !== req.params.userId) {
            return res.status(403).send("You're not allowed to do that!");
        }

        user.recipesCollection.remove({ _id: req.params.recipeId })
        await user.save();
        res.status(200).json({ message: "Recipe removed from collection successfully" });
    } catch (error) {
        res.status(500).json({ err: err.message });
    }
});

router.delete('/:userId/meals-collection/:recipeId', verifyToken, async (req, res) => {
    try {
        const user = await User.find(req.params.userId);

        if (!user) {
            return res.status(404).json({ err: 'User not found.' });
        }
        if (req.user._id !== req.params.userId) {
            return res.status(403).send("You're not allowed to do that!");
        }

        user.mealsCollection.remove({ _id: req.params.recipeId });
        await user.save();
        res.status(200).json({ message: "Meal removed from collection successfully" });
    } catch (error) {
        res.status(500).json({ err: err.message });
    }
});


module.exports = router;