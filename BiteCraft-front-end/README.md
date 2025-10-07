**BiteCraft**

BiteCraft is a meal planning application focused on creating and managing 28-day dinner meal plans with weekly grocery lists. Users can create, share, and collect recipes and meals, comment on them, and generate personalized meal plans.

**Table of Contents**

* Features (\#features)  
* User Stories (\#user-stories)  
* Installation (\#installation)  
* Usage (\#usage)  
* TechStack (\#techstack)  
* Database Schema (\#database-schema)  
* API Endpoints (\#api-endpoints)  
* Future Enhancements (\#future-enhancements)  
* Contributing (\#contributing)  
* License (\#license)

**Features**

* **User Authentication**: Sign up, sign in, and sign out.  
* **Recipes**:  
  * Create and edit recipes (mains or sides) with instructions and ingredients.  
  * View, filter, and categorize recipes.  
  * Add other users' recipes to personal collections.  
  * Comment on and reply to comments on recipes.  
  * Edit own comments.  
  * Print recipe instructions.  
* **Meals**:  
  * Create meals by selecting one main and two sides.  
  * Add other users' meals to personal collections.  
  * Comment on and reply to comments on meals.  
  * Edit own comments.  
* **Meal Plans**:  
  * Generate a 28-day meal plan with weekly grocery lists.  
  * View and print meal plans and grocery lists.  
* **Collections**:  
  * Add/remove recipes and meals to/from personal collections.  
  * Deleting owned items removes them for all users; removing others' items affects only the user's collection.

**User Stories**

**General**

* View a welcome page with app information and sign-up/sign-in options.  
* Access a navigation bar with a sign-out option.  
* See a dashboard displaying all available options clearly.  
* Navigate to each option with clear understanding of functionality.

**Recipes**

* Create recipes with simple input for instructions and ingredients.  
* View and filter other users' recipes by category.  
* Add others' recipes to personal collection.  
* Identify recipe creators.  
* Comment on and reply to comments on recipes.  
* Edit own comments on recipes.  
* Print recipe instructions.  
* View recipes used in meals.

**Meals**

* Create meals by selecting one main and two sides, with filters for ease of use.  
* Add others' meals to personal collection.  
* Identify creators of meals and their recipes.  
* Comment on and reply to comments on meals.  
* Edit own comments on meals.

**Meal Plans**

* Generate a 28-day meal plan with weekly grocery lists.  
* View meal plan details and grocery lists in an easy-to-understand format.  
* Print grocery lists.

**Usage**

1. **Sign Up/In**: Create an account or sign in from the welcome page.  
2. **Dashboard**: Access the dashboard to navigate to recipes, meals, or meal plans.  
3. **Recipes**:  
   * Create a recipe under "mains" or "sides" with ingredients and instructions.  
   * Browse, filter, and add recipes to your collection.  
   * Comment, reply, or edit comments on recipes.  
4. **Meals**:  
   * Create a meal by selecting one main and two sides.  
   * Add meals to your collection and comment on them.  
5. **Meal Plans**:  
   * Generate a 28-day plan with weekly grocery lists.  
   * View or print meal plans and lists.  
6. **Collections**:  
   * Manage your recipe and meal collections.  
   * Remove items (deletes owned items for all users; removes others' items from your collection only).

**Tech Stack**

* **Frontend**: React (with hooks and context for state management).  
* **Styling**: Bulma CSS framework for responsive, mobile-first design.  
* **UI Components**: react-select for dropdown filters and multi-selects (e.g., recipe/meal selection).  
* **Utilities**: Lodash for array/object manipulation (e.g., collections, randomization); math.js for ingredient calculations (e.g., scaling grocery quantities).  
* **Backend/Database**: MongoDB with Mongoose for schema-based modeling and CRUD operations.  
* **Other**: Node.js/Express implied for API server (endpoints for auth, CRUD on resources).

**Database Schema**

**User**

* recipesCollection: Array of recipe IDs (references)  
* mealsCollection: Array of meal IDs (references)  
* mealPlan: Object with four weeks, each containing:  
  * meals: Array of 7 meal IDs  
  * list: Array of ingredients

**Meal**

* author: User’s name  
* timeStamps: Boolean (true)  
* main: Recipe ID (reference)  
* side1: Recipe ID (reference)  
* side2: Recipe ID (reference)  
* comments: Array of comment objects:  
  * owner: User’s name  
  * comment: Text  
  * created: Timestamp  
  * timeStamps: Boolean (true)

**Recipe**

* author: User’s name  
* timeStamps: Boolean (true)  
* instructions: Text  
* ingredients: Array of ingredients  
* comments: Array of comment objects:  
  * owner: User’s name  
  * comment: Text  
  * created: Timestamp  
  * timeStamps: Boolean (true)

**API Endpoints**

**User**

* POST /user/sign-up: Create a new user.  
* POST /user/sign-in: Authenticate user.  
* POST /user/sign-out: Log out user.

**Create**

* POST /meals: Create a new meal.  
* POST /recipes: Create a new recipe.  
* POST /meals/:mealId/comments: Add comment to a meal.  
* POST /recipes/:recipeId/comments: Add comment to a recipe.  
* POST /meals/:mealId/comments/:commentId/reply: Reply to a meal comment.  
* POST /recipes/:recipeId/comments/:commentId/reply: Reply to a recipe comment.  
* POST /user/:userId/planner: Generate a meal plan.

**Update**

* PUT /meals/:mealId/edit: Edit a meal.  
* PUT /recipes/:recipeId/edit: Edit a recipe.  
* PUT /meals/:mealId/comments/:commentId/edit: Edit a meal comment.  
* PUT /recipes/:recipeId/comments/:commentId/edit: Edit a recipe comment.  
* PUT /meals/:mealId/comments/:commentId/replyId/edit: Edit a meal comment reply.  
* PUT /recipes/:recipeId/comments/:commentId/replyId/edit: Edit a recipe comment reply.

**Delete**

* DELETE /meals/:mealId: Delete a meal.  
* DELETE /recipes/:recipeId: Delete a recipe.  
* DELETE /meals/:mealId/comments/:commentId: Delete a meal comment.  
* DELETE /recipes/:recipeId/comments/:commentId: Delete a recipe comment.  
* DELETE /mealPlans/:mealPlanId: Delete a meal plan.  
* DELETE /meals/:mealId/comments/:commentId/replyId: Delete a meal comment reply.  
* DELETE /recipes/:recipeId/comments/:commentId/replyId: Delete a recipe comment reply.  
* DELETE /user/:userId/planner: Delete a meal plan.

**Get**

* GET /meals: List all meals.  
* GET /recipes: List all recipes.  
* GET /meals/:mealId: Get a specific meal.  
* GET /recipes/:recipeId: Get a specific recipe.  
* GET /mealsCollection/:userId: Get user’s meal collection.  
* GET /recipesCollection/:userId: Get user’s recipe collection.  
* GET /mealPlans/:mealPlanId: Get a specific meal plan.  
* GET /user/:userId/planner: Get user’s meal plan.

**Future Enhancements**

* Add pictures to recipes, meals, and comments.  
* Implement a 1-5 star review system for recipes and meals.  
* Allow users to view and add other users’ meal and recipe collections.

**Contributing**

Contributions are welcome\! Please follow these steps:

1. Fork the repository.  
2. Create a new branch (git checkout \-b feature-branch).  
3. Make your changes and commit (git commit \-m "Add feature").  
4. Push to the branch (git push origin feature-branch).  
5. Open a pull request.

**License**

This project is licensed under the MIT License. See the LICENSE file for details.