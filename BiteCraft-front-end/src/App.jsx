import { useContext } from "react";
import { Routes, Route } from "react-router";

import NavBar from "./components/Component/NavBar/NavBar";
import SignUpForm from "./components/Forms/SignUpForm/SignUpForm";
import SignInForm from "./components/Forms/SignInForm/SignInForm";
import Landing from "./components/Views/Landing/Landing";
import Dashboard from "./components/Views/Dashboard/Dashboard";
import RecipeCollection from "./components/Views/RecipeCollection/RecipeCollection";
import MealCollection from "./components/Views/MealCollection/MealCollection";
import RecipeDetails from "./components/Views/RecipeDetails/RecipeDetails";
import MealDetails from "./components/Views/MealDetails/MealDetails";
import MealForm from "./components/Forms/MealForm/MealForm";
import RecipeForm from "./components/Forms/RecipeForm/RecipeForm";
import RecipeList from "./components/Views/RecipeList/RecipeList";
import MealList from "./components/Views/MealList/MealList";
import MealPlan from "./components/Views/MealPlan/MealPlan";
import { UserContext } from "./contexts/UserContext";

const App = () => {
  const { user } = useContext(UserContext);
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Landing />} />
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/recipes/:recipeId" element={<RecipeDetails />} />
          <Route path="/meals/:mealId" element={<MealDetails />} />
          <Route
            path="/:userId/recipes-collection"
            element={<RecipeCollection />}
          />
          <Route
            path="/:userId/meals-collection"
            element={<MealCollection />}
          />
          <Route path="/recipes/new" element={<RecipeForm />} />
          <Route path="/meals/new" element={<MealForm />} />
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/meals" element={<MealList />} />
          <Route path="/:userId/planner" element={<MealPlan />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
