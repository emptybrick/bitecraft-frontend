import { useContext } from "react";
import { Routes, Route } from "react-router";

import NavBar from "./components/NavBar/NavBar";
import SignUpForm from "./components/Forms/SignUpForm/SignUpForm";
import SignInForm from "./components/Forms/SignInForm/SignInForm";
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";
import RecipeCollection from "./components/Lists/RecipeCollection/RecipeCollection";
import MealCollection from "./components/Lists/MealCollection/MealCollection";
import RecipeDetails from "./components/Details/RecipeDetails/RecipeDetails";
import MealDetails from "./components/Details/MealDetails/MealDetails";
import MealForm from "./components/Forms/MealForm/MealForm";
import RecipeForm from "./components/Forms/RecipeForm/RecipeForm";
import RecipeList from "./components/Lists/RecipeList/RecipeList"
import MealList from "./components/Lists/MealList/MealList"
import MealPlan from "./components/MealPlan/MealPlan";

import { UserContext } from "./contexts/UserContext";

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/recipes/:recipeId" element={<RecipeDetails />} />
        <Route path="/meals/:mealId" element={<MealDetails />} />
        <Route
          path="/collections/:userId/recipes-collection"
          element={<RecipeCollection />}
        />
        <Route
          path="/collections/:userId/meals-collection"
          element={<MealCollection />}
        />
        <Route path="/recipes/new" element={<RecipeForm />} />
        <Route path="/meals/new" element={<MealForm />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/meals" element={<MealList />} />
        <Route path="/meal-plan/:userId/meal-plan" element={<MealList />} />
      </Routes>
    </>
  );
};

export default App;
