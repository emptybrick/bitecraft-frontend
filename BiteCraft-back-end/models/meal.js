const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true
        },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
);

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true
        },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reply: replySchema
    },
    { timestamps: true }
);

const mealSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        main: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
        side1: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
        side2: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
        name: { type: String },
        details: { type: String },
        comments: [ commentSchema ],
    },
    { timestamps: true }
);

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal