const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

const authRouter = require('./controllers/auth');
const usersRouter = require('./controllers/users');
const mealsRouter = require('./controllers/meals');
const recipesRouter = require('./controllers/recipes');
const ingredientsRouter = require('./controllers/ingredients');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${ mongoose.connection.name }.`);
});

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/meals', mealsRouter);
app.use('/recipes', recipesRouter);
app.use('/ingredients', ingredientsRouter);

app.listen(3000, () => {
  console.log('The express app is ready!');
});