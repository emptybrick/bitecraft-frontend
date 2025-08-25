const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyToken = require('../middleware/verify-token');

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

// router.get('/:userId/planner', verifyToken, async (req, res) => {
//   try {
//     if (req.user._id !== req.params.userId) {
//       return res.status(403).json({ err: "Unauthorized" });
//     }

//     const user = await User.findById(req.params.userId);

//     if (!user) {
//       return res.status(404).json({ err: 'User not found.' });
//     }

//     res.json({ mealPlan: user.mealPlan });
//   } catch (error) {
//     res.status(500).json({ err: err.message });
//   }
// });

// router.post('/:userId/planner', verifyToken, async (req, res) => {
//   try {
//     if (req.user._id !== req.params.userId) {
//       return res.status(403).json({ err: "Unauthorized" });
//     }

//     const user = await User.findById(req.params.userId);

//     if (!user) {
//       return res.status(404).json({ err: 'User not found.' });
//     }

//     const updateMealPlan = await User.findByIdAndUpdate(
//       { _id: req.params.userId },
//       { $push: { mealPlan: req.body } },
//       { new: true, runValidators: true }
//     );

//     res.json(updateMealPlan);
//   } catch (error) {
//     res.status(500).json({ err: err.message });
//   }
// });

// router.delete('/:userId/planner/:id', verifyToken, async (req, res) => {
//   try {
//     if (req.user._id !== req.params.userId) {
//       return res.status(403).json({ err: "Unauthorized" });
//     }

//     const user = await User.findById(req.params.userId);

//     if (!user) {
//       return res.status(404).json({ err: 'User not found.' });
//     }

//     user.mealPlan.remove({ _id: req.params.id });
//     await user.save();

//     res.status(200).json({ message: "Meal Plan removed successfully" });
//   } catch (error) {
//     res.status(500).json({ err: err.message });
//   }
// });

router.get('/:userId/recipes-collection', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate([
      { path: 'recipesCollection' },
      {
        path: 'recipesCollection',
        populate: { path: 'author' }
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
        { path: 'author' },
        { path: 'main' },
        { path: 'side1' },
        { path: 'side2' }
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
