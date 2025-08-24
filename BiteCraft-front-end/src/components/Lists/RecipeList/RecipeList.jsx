import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";

const RecipeList = () => {
  const { user } = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    const fetchAllRecipes = async () => {
      const recipesData = await biteCraftService.Index("Recipe");
      setRecipes(recipesData);
    };
    if (user) fetchAllRecipes();
  }, [user]);

  return (
    <main>
      <h1>List of All Recipes!</h1>
      <Link to="/recipes/new">
        <button>Add New Recipe</button>
      </Link>
      {recipes.map((recipe) => (
        <Link key={recipe._id} to={`/recipes/${recipe._id}`}>
          <article>
            <header>
              <h2>{recipe.category} Dish</h2>
              <h2>{recipe.name}</h2>
              <p>{`${recipe.author.username} posted on ${new Date(
                recipe.createdAt
              ).toLocaleDateString()}`}</p>
            </header>
            <p>{recipe.details}</p>
          </article>
        </Link>
      ))}
    </main>
  );
};

export default RecipeList;
