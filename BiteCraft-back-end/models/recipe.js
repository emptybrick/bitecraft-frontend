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

const recipeSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        details: {
            type: String,
        },
        name: {
            type: String,
            required: true,
        },
        // simple instructions for now, eventually want an array or way of enforcing step instructions easier
        instructions: [ String ],
        // instructions: [ {
        //     stepNumber: Number,
        //     description: String
        // } ],
        // need to figure out how to get ingredients input properly
        ingredients: [ String ],
        // ingredients: [ {
        //     name: String,
        //     quantity: Number,
        //     unit: String,
        // } ],
        category: {
            type: String,
            required: true,
            enum: [ 'Main', 'Side' ]
        },
        comments: [ commentSchema ]
    },
    { timestamps: true }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;