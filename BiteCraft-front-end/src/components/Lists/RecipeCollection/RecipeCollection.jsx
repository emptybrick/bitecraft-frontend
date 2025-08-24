import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";

const RecipeCollection = () => {
  const { user } = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    const fetchAllRecipes = async () => {
      const recipesData = await biteCraftService.Index("RecipeCollection", user._id);
      if (recipesData) {
        setRecipes(recipesData);
      }
    };
    if (user) fetchAllRecipes();
  }, [user]);

  return (
    <main>
      <h1>Welcome to {user.username}'s Recipes Collection</h1>
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <Link key={recipe._id} to={`/recipes/${recipe._id}`}>
            <article>
              <header>
                <h2>{recipe.category} Dish</h2>
                <h2>{recipe.name}</h2>
                <p>{`${recipe.author.username} posted on ${new Date(
                  recipe.createAt
                ).toLocaleDateString()}`}</p>
              </header>
              <p>{recipe.details}</p>
              <p>{recipe.instructions}</p>
              <p>{recipe.ingredients}</p>
            </article>
          </Link>
        ))
      ) : (
        <h2>Recipes Collection is Currently Empty!</h2>
      )}
    </main>
  );
};

export default RecipeCollection;
