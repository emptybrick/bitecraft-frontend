const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyToken = require('../middleware/verify-token');
const handleMealPlan = require('../utils/utils');

router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, "username");

    res.json(users);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/:userId', verifyToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ err: 'User not found.' });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/:userId/planner', verifyToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    const user = await User.findById(req.params.userId).populate({
      path: 'mealsCollection',
      populate: [
        { path: 'author' },
        { path: 'main' },
        { path: 'side1' },
        { path: 'side2' }
      ]
    });

    if (!user) {
      return res.status(404).json({ err: 'User not found.' });
    }

    const mealPlan = user.mealPlan;

    if (mealPlan) {
      res.json(user.mealPlan);
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post('/:userId/planner', verifyToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    const data = req.body;
    let newMealPlan;

    if (data.week1) {
      newMealPlan = handleMealPlan(data, "Manual");
    } else {
      newMealPlan = handleMealPlan(data, "Auto");
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ err: 'User not found.' });
    }

    user.mealPlan = newMealPlan;
    await user.save();
    return res.status(200).json(newMealPlan);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:userId/planner', verifyToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ err: 'User not found.' });
    }

    user.mealPlan = null
    await user.save();

    res.status(200).json({ message: "Meal Plan removed successfully" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/:userId/recipes-collection', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate([
      { path: 'recipesCollection' },
      {
        path: 'recipesCollection',
        populate: { path: 'author', select: 'username' }
      },
    ]);
    if (!user) {
      return res.status(404).json({ err: 'User not found.' });
    }
    const recipes = user.recipesCollection;
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:userId/meals-collection', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate({
      path: 'mealsCollection',
      populate: [
        { path: 'author', select: 'username' },
        { path: 'main' },
        {
          path: 'main',
          populate: { path: 'author', select: 'username' }
        },
        { path: 'side1' },
        {
          path: 'side1',
          populate: { path: 'author', select: 'username' }
        },
        { path: 'side2' },
        {
          path: 'side2',
          populate: { path: 'author', select: 'username' }
        },
      ]
    });

    if (!user) {
      return res.status(404).json({ err: 'User not found.' });
    }
    const meals = user.mealsCollection;
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/:userId/meals-collection', verifyToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    const updateMealCollection = await User.findByIdAndUpdate(
      { _id: req.params.userId },
      { $push: { mealsCollection: req.body._id } },
      { new: true, runValidators: true }
    );

    if (!updateMealCollection) {
      return res.status(404).send("Recipe not found");
    }

    res.status(201).json(updateMealCollection);

  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/:userId/recipes-collection', verifyToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    const updateRecipeCollection = await User.findByIdAndUpdate(
      { _id: req.params.userId },
      { $push: { recipesCollection: req.body._id } },
      { new: true, runValidators: true }
    );

    if (!updateRecipeCollection) {
      return res.status(404).send("Recipe not found");
    }
    res.status(201).json(updateRecipeCollection);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:userId/recipes-collection/:recipeId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ err: 'User not found.' });
    }
    if (req.user._id !== req.params.userId) {
      return res.status(403).send("You're not allowed to do that!");
    }

    user.recipesCollection.remove({ _id: req.params.recipeId });
    await user.save();
    res.status(200).json({ message: "Recipe removed from collection successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:userId/meals-collection/:mealId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ err: 'User not found.' });
    }
    if (req.user._id !== req.params.userId) {
      return res.status(403).send("You're not allowed to do that!");
    }

    user.mealsCollection.remove({ _id: req.params.mealId });
    await user.save();
    res.status(200).json({ message: "Meal removed from collection successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
