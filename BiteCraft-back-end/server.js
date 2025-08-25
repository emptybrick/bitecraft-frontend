// npm
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

// Import routers
const authRouter = require('./controllers/auth');
const usersRouter = require('./controllers/users');
const mealsRouter = require('./controllers/meals')
const recipesRouter = require('./controllers/recipes')
// const collectionsRouter = require('./controllers/collections')
// const mealPlansRouter = require('./controllers/mealplans')

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Routes
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/meals', mealsRouter);
app.use('/recipes', recipesRouter)

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log('The express app is ready!');
});
