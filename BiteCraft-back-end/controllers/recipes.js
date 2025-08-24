const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const Recipe = require('../models/recipe');

router.post('/', verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id;
        const recipe = await Recipe.create(req.body);
        recipe._doc.author = req.user;
        res.status(201).json(recipe);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const recipes = await Recipe.find({})
            .populate("author")
            .sort({ createdAt: "desc" });
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/:recipeId', verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId).populate([
            'author',
            'comments.author',
            'comments.reply.author',
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
        req.body.author = req.user._id;
        const updateRecipe = await Recipe.findByIdAndUpdate(
            { _id: req.params.recipeId },
            { $push: { comments: req.body } },
            { new: true, runValidators: true }
        );

        if (!updateRecipe) {
            return res.status(404).send("Recipe not found");
        }

        const newComment = { ...req.body, author: req.user };
        res.status(201).json(newComment);

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
    console.log("trying to add reply")
    try {
        req.body.author = req.user._id;
        const updateRecipe = await Recipe.findById(req.params.recipeId)
        if (!updateRecipe) {
            return res.status(404).send("Recipe not found");
        }
        const comment = updateRecipe.comments.id(req.params.commentId)
        if (!comment) {
            return res.status(404).send("Comment not found");
        }
        comment.reply = comment.reply || []
        comment.reply.push(req.body)

        await updateRecipe.save()
  
        const newComment = { ...req.body, author: req.user };
        res.status(201).json(newComment);
        
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/:recipeId/comments/:commentId/reply/:replyId', verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        const comment = recipe.comments.id(req.params.commentId);
        const reply = comment.reply.id(req.params.replyId);

        if (reply.author.toString() !== req.user._id) {
            return res.status(403).json({ message: "You are not authorized to edit this comment" });
        }

        reply.text = req.body.text;
        await recipe.save();
        res.status(200).json({ message: 'Comment updated successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/:recipeId/comments/:commentId/reply/:replyId', verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        const comment = recipe.comments.id(req.params.commentId);
        const reply = comment.reply.id(req.params.replyId);

        if (reply.author.toString() !== req.user._id) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }
        console.log(recipe)
        comment.reply.remove({ _id: req.params.replyId });
        await recipe.save();
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;