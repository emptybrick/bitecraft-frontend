import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";

const RecipeCollection = () => {
  const { user } = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);
  const params = useParams();
  const [toggleEffect, setToggleEffect] = useState(false)

  useEffect(() => {
    const fetchAllRecipes = async () => {
      const recipesData = await biteCraftService.Index(
        "RecipeCollection",
        user._id
      );
      if (recipesData) {
        setRecipes(recipesData);
      }
    };
    if (user) fetchAllRecipes();
  }, [user, toggleEffect]);

  const handleRemoveFromCollection = async (recipeId) => {
    try {
      await biteCraftService.RemoveFromCollection("Recipe", recipeId, user._id);
      setToggleEffect(!toggleEffect)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      <h1>Welcome to {user.username}'s Recipes Collection</h1>
      <Link to="/recipes/new">
        <button>Add New Recipe</button>
      </Link>
      {recipes.length > 0 ? (
        recipes.map((recipe, idx) => (
          <article key={idx}>
            <header>
              <Link to={`/recipes/${recipe._id}`}>
                <h2>{recipe.name}</h2>
              </Link>
              <p>{`${recipe.author.username} posted on ${new Date(
                recipe.createdAt
              ).toLocaleDateString()}`}</p>
            </header>
            {user._id === params.userId && recipe.author._id !== user._id && (
              <button onClick={() => handleRemoveFromCollection(recipe._id)}>
                Remove from Collection
              </button>
            )}
          </article>
        ))
      ) : (
        <h2>Recipes Collection is Currently Empty!</h2>
      )}
    </main>
  );
};

export default RecipeCollection;
