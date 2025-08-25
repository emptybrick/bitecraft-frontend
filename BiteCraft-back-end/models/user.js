const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  recipesCollection: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' } ],
  mealsCollection: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' } ],
  mealPlan: [
    {
    meals: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' } ],
      groceryList: {
        week1: {
          meals: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' } ],
          list: [ String ]
        },
        week2: {
          meals: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' } ],
          list: [ String ]
        },
        week3: {
          meals: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' } ],
          list: [ String ]
        },
        week4: {
          meals: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' } ],
          list: [ String ]
        },
      },
    }
  ]
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User
