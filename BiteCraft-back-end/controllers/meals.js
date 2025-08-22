const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const Meal = require('../models/meal');

router.post('/', verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id;
        const meal = await Meal.create(req.body);
        meal._doc.author = req.user;
        res.status(201).json(meal);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const meals = await Meal.find({})
            .populate("author")
            .sort({ createdAt: "desc" });
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/:mealId', verifyToken, async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.mealId).populate([
            'author',
            'comments.author',
            'comments.reply.author',
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

        const deletedRecipe = await Meal.findByIdAndDelete(req.params.mealId);
        res.status(200).json(deletedRecipe);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/:mealId/comments', verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id;
        const updateMeal = await Meal.findByIdAndUpdate(
            { _id: req.params.mealId },
            { $push: { comments: req.body } },
            { new: true, runValidators: true }
        );

        if (!updateMeal) {
            return res.status(404).send("Meal not found");
        }

        const newComment = { ...req.body, author: req.user };
        res.status(201).json(newComment);

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
        req.body.author = req.user._id;
        const updateMeal = await Meal.findByIdAndUpdate(
            { _id: req.params.commentId },
            { $push: { reply: req.body } },
            { new: true, runValidators: true }
        );

        if (!updateMeal) {
            return res.status(404).send("Meal not found");
        }

        const newComment = { ...req.body, author: req.user };
        res.status(201).json(newComment);

    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/:mealId/comments/:commentId/reply/:replyId', verifyToken, async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.mealId);
        const comment = meal.comments.id(req.params.commentId);
        const reply = comment.reply.id(req.params.replyId);

        if (reply.author.toString() !== req.user._id) {
            return res.status(403).json({ message: "You are not authorized to edit this comment" });
        }

        reply.text = req.body.text;
        await meal.save();
        res.status(200).json({ message: 'Comment updated successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/:mealId/comments/:commentId/reply/:replyId', verifyToken, async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.mealId);
        const comment = meal.comments.id(req.params.commentId);
        const reply = comment.reply.id(req.params.replyId);

        if (reply.author.toString() !== req.user._id) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        meal.comments.reply.remove({ _id: req.params.replyId });
        await meal.save();
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;