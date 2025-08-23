const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyToken = require('../middleware/verify-token');

router.get('/:userId/meal-plan', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.params.userId) {
            return res.status(403).json({ err: "Unauthorized" });
        }

        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ err: 'User not found.' });
        }

        res.json({ mealPlan: user.mealPlan });
    } catch (error) {
        res.status(500).json({ err: err.message });
    }
});

router.post('/:userId/meal-plan', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.params.userId) {
            return res.status(403).json({ err: "Unauthorized" });
        }

        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ err: 'User not found.' });
        }

        const updateMealPlan = await User.findByIdAndUpdate(
            { _id: req.params.userId },
            { $push: { mealPlan: req.body } },
            { new: true, runValidators: true }
        );

        res.json(updateMealPlan);
    } catch (error) {
        res.status(500).json({ err: err.message });
    }
});

router.delete('/:userId/meal-plan/:id', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.params.userId) {
            return res.status(403).json({ err: "Unauthorized" });
        }

        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ err: 'User not found.' });
        }

        user.mealPlan.remove({ _id: req.params.id });
        await user.save();

        res.status(200).json({ message: "Meal Plan removed successfully" });
    } catch (error) {
        res.status(500).json({ err: err.message });
    }
});

module.exports = router;