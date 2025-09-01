const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const Recipe = require('../models/recipe');
const User = require('../models/user.js');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

router.post('/', verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id;
        const recipe = await Recipe.create(req.body);
        await User.findByIdAndUpdate(
            { _id: req.user._id },
            { $push: { recipesCollection: recipe._id } },
            { new: true, runValidators: true }
        );
        recipe._doc.author = req.user;
        res.status(201).json(recipe);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const recipes = await Recipe.find({})
            .populate('author', 'username')
            .sort({ createdAt: "desc" });
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/:recipeId', verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId)
            .populate([
                { path: 'author', select: 'username' },
                {
                    path: 'comments',
                    populate: [
                        { path: 'author', select: 'username' },
                        { path: 'reply', populate: { path: 'author', select: 'username' } }
                    ]
                }
            ]);
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/:recipeId', verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);

        if (!recipe.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!");
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.recipeId,
            req.body,
            { new: true }
        );

        updatedRecipe._doc.author = req.user;
        res.status(200).json(updatedRecipe);

    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/:recipeId', verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);

        if (!recipe.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!");
        }

        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.recipeId);
        res.status(200).json(deletedRecipe);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/:recipeId/comments', verifyToken, async (req, res) => {
    try {
        const comment = {
            _id: new ObjectId(),
            text: req.body.text,
            author: req.user._id,
        };
        const updateRecipe = await Recipe.findByIdAndUpdate(
            req.params.recipeId,
            { $push: { comments: { $each: [ comment ], $sort: { createdAt: -1 } } } },
            { new: true, runValidators: true }
        );

        if (!updateRecipe) {
            return res.status(404).send("Recipe not found");
        }

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/:recipeId/comments/:commentId', verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        const comment = recipe.comments.id(req.params.commentId);

        if (comment.author.toString() !== req.user._id) {
            return res.status(403).json({ message: "You are not authorized to edit this comment" });
        }

        comment.text = req.body.text;
        await recipe.save();
        res.status(200).json({ message: 'Comment updated successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/:recipeId/comments/:commentId', verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        const comment = recipe.comments.id(req.params.commentId);

        if (comment.author.toString() !== req.user._id) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        recipe.comments.remove({ _id: req.params.commentId });
        await recipe.save();
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/:recipeId/comments/:commentId/reply', verifyToken, async (req, res) => {
    try {
        const reply = {
            text: req.body.text,
            author: req.user._id
        };
        const updatedRecipe = await Recipe.findOneAndUpdate(
            {
                _id: req.params.recipeId,
                "comments._id": req.params.commentId,
                $or: [
                    { 'comments.reply': { $exists: false } },
                    { 'comments.reply': null }
                ]
            },
            { $set: { "comments.$.reply": reply } },
            { new: true, runValidators: true }
        );

        if (!updatedRecipe) {
            const recipe = await Recipe.findById(req.params.recipeId);
            if (!recipe) {
                return res.status(404).json({ error: "Recipe not found" });
            }
            const comment = recipe.comments.id(req.params.commentId);
            if (!comment) {
                return res.status(404).json({ error: "Comment not found" });
            }
            if (comment.reply) {
                return res.status(400).json({ error: "Comment already has a reply" });
            }
        }
        res.status(201).json(reply);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/:recipeId/comments/:commentId/reply', verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        const comment = recipe.comments.id(req.params.commentId);

        if (comment.reply.author.toString() !== req.user._id) {
            return res.status(403).json({ message: "You are not authorized to edit this reply" });
        }
        comment.reply.text = req.body.text;
        await recipe.save();
        res.status(200).json({ message: 'Reply updated successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/:recipeId/comments/:commentId/reply', verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        const comment = recipe.comments.id(req.params.commentId);

        if (comment.reply.author.toString() !== req.user._id) {
            return res.status(403).json({ message: "You are not authorized to delete this reply" });
        }

        await Recipe.updateOne(
            { _id: req.params.recipeId, 'comments._id': req.params.commentId },
            { $unset: { 'comments.$.reply': '' } }
        );
        res.status(200).json({ message: "Reply deleted successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;