const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const Meal = require('../models/meal');
const User = require('../models/user.js');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

router.post('/', verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id;
        const meal = await Meal.create(req.body);
        await User.findByIdAndUpdate(
            { _id: req.user._id },
            { $push: { mealsCollection: meal._id } },
            { new: true, runValidators: true }
        );
        meal._doc.author = req.user;
        res.status(201).json(meal);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const meals = await Meal.find({})
            .populate('author', 'username')
            .populate([
                { path: 'main', populate: { path: 'author', select: 'username' } },
                { path: 'side1', populate: { path: 'author', select: 'username' } },
                { path: 'side2', populate: { path: 'author', select: 'username' } }
            ])
            .sort({ createdAt: "desc" });
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/:mealId', verifyToken, async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.mealId)
            .populate('author', 'username')
            .populate([
                { path: 'main', populate: { path: 'author', select: 'username' } },
                { path: 'side1', populate: { path: 'author', select: 'username' } },
                { path: 'side2', populate: { path: 'author', select: 'username' } },
                {
                    path: 'comments',
                    populate: [
                        { path: 'author', select: 'username' }, 
                        { path: 'reply', populate: { path: 'author', select: 'username' } } 
                    ]
                }
            ]);
        res.status(200).json(meal);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/:mealId', verifyToken, async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.mealId);

        if (!meal.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!");
        }

        const updatedMeal = await Meal.findByIdAndUpdate(
            req.params.mealId,
            req.body,
            { new: true }
        );

        updatedMeal._doc.author = req.user;

        res.status(200).json(updatedMeal);

    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/:mealId', verifyToken, async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.mealId);

        if (!meal.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!");
        }

        const deletedMeal = await Meal.findByIdAndDelete(req.params.mealId);
        res.status(200).json(deletedMeal);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/:mealId/comments', verifyToken, async (req, res) => {
    try {
        const comment = {
            _id: new ObjectId(),
            text: req.body.text,
            author: req.user._id,
        };
        const updateMeal = await Meal.findByIdAndUpdate(
            req.params.mealId,
            { $push: { comments: { $each: [ comment ], $sort: { createdAt: -1 } } } },
            { new: true, runValidators: true }
        );

        if (!updateMeal) {
            return res.status(404).send("Meal not found");
        }

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/:mealId/comments/:commentId', verifyToken, async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.mealId);
        const comment = meal.comments.id(req.params.commentId);

        if (comment.author.toString() !== req.user._id) {
            return res.status(403).json({ message: "You are not authorized to edit this comment" });
        }

        comment.text = req.body.text;
        await meal.save();
        res.status(200).json({ message: 'Comment updated successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/:mealId/comments/:commentId', verifyToken, async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.mealId);
        const comment = meal.comments.id(req.params.commentId);

        if (comment.author.toString() !== req.user._id) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        meal.comments.remove({ _id: req.params.commentId });
        await meal.save();
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/:mealId/comments/:commentId/reply', verifyToken, async (req, res) => {
    try {
        const reply = {
            text: req.body.text,
            author: req.user._id
        };
        const updatedMeal = await Meal.findOneAndUpdate(
            {
                _id: req.params.mealId,
                "comments._id": req.params.commentId,
                $or: [
                    { 'comments.reply': { $exists: false } },
                    { 'comments.reply': null }
                ]
            },
            { $set: { "comments.$.reply": reply } },
            { new: true, runValidators: true }
        );
        if (!updatedMeal) {
            const meal = await Meal.findById(req.params.mealId);
            if (!meal) {
                return res.status(404).json({ error: "Meal not found" });
            }
            const comment = meal.comments.id(req.params.commentId);
            if (!comment) {
                return res.status(404).json({ error: "Comment not found" });
            }
            return res.status(400).json({ error: "Comment already has a reply" });
        }
        res.status(201).json(reply);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/:mealId/comments/:commentId/reply', verifyToken, async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.mealId);
        const comment = meal.comments.id(req.params.commentId);

        if (comment.reply.author.toString() !== req.user._id) {
            return res.status(403).json({ message: "You are not authorized to edit this reply" });
        }
        comment.reply.text = req.body.text;
        await meal.save();
        res.status(200).json({ message: 'Reply updated successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/:mealId/comments/:commentId/reply', verifyToken, async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.mealId);
        const comment = meal.comments.id(req.params.commentId);

        if (comment.reply.author.toString() !== req.user._id) {
            return res.status(403).json({ message: "You are not authorized to delete this reply" });
        }

        await Meal.updateOne(
            { _id: req.params.mealId, 'comments._id': req.params.commentId },
            { $unset: { 'comments.$.reply': '' } }
        );
        res.status(200).json({ message: "Reply deleted successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;