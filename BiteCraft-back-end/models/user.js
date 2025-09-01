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
  mealPlan: {
    week1: {
      meals: [ Object ],
      list: [ String ]
    },
    week2: {
      meals: [ Object ],
      list: [ String ]
    },
    week3: {
      meals: [ Object ],
      list: [ String ]
    },
    week4: {
      meals: [ Object ],
      list: [ String ]
    },
  }
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
