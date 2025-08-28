import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import RecipeForm from "../../Forms/RecipeForm/RecipeForm";
import CommentsAndReplies from "../Comments/Comments";
import Header from "../../Component/Header/Header";
import Button from "../../Component/Button/Button";

const RecipeDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useContext(UserContext);
  const [recipe, setRecipe] = useState(null);
  const [recipesInCollection, setRecipesInCollection] = useState([]);
  const recipeId = params.recipeId;
  const [isLoading, setIsLoading] = useState(false);
  const [visibleRecipeForm, setVisibleRecipeForm] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const recipeToShow = await biteCraftService.Show("Recipe", recipeId);
      setRecipe(recipeToShow);
      if (recipesInCollection.length < 1) {
        const recipesToGet = await biteCraftService.Index(
          "RecipeCollection",
          user._id
        );
        const recipeArray = recipesToGet.map((item) => item._id);
        setRecipesInCollection(recipeArray);
      }
      setIsLoading(false);
    };
    if (!visibleRecipeForm) {
      getData();
    }
  }, [recipeId]);

  const toggleRecipeForm = () => {
    setVisibleRecipeForm(!visibleRecipeForm);
  };

  const handleUpdateRecipe = async (formData) => {
    try {
      await biteCraftService.Update("Recipe", formData, recipeId);
      setRecipe(formData);
      toggleRecipeForm();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRecipe = async () => {
    try {
      await biteCraftService.Delete("Recipe", recipeId);
      navigate(`/${user._id}/recipes-collection`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCollection = async () => {
    try {
      await biteCraftService.AddToCollection("Recipe", recipe, user._id);
      navigate(`/${user._id}/recipes-collection`);
    } catch (error) {
      console.log(error);
    }
  };

  if (!recipe || isLoading) return <main>Loading...</main>;

  return (
    <main>
      <section>
        {visibleRecipeForm ? (
          <RecipeForm
            initialData={recipe}
            handleUpdateRecipe={(formData) => {
              handleUpdateRecipe(formData);
            }}
            buttonText="Save"
            onCancel={() => toggleRecipeForm()}
          />
        ) : (
          <>
            <Header item={recipe} />
            <div>
              <div>
                {/* need to map through these */}
                <h4>Ingredients</h4>
                <p>{recipe.ingredients.map(ing => ing.name)}</p>
              </div>
              <div>
                <h4>Instructions</h4>
                <p>{recipe.instructions}</p>
              </div>
            </div>
            {recipe.author._id === user._id && !visibleRecipeForm && (
              <>
                <Button onClick={handleDeleteRecipe} buttonText="Delete" />
                <Button onClick={toggleRecipeForm} buttonText="Edit" />
              </>
            )}
          </>
        )}
        {!recipesInCollection.includes(recipeId) && (
          <Button
            onClick={handleAddToCollection}
            buttonText="Add to Collection"
          />
        )}
      </section>
      <CommentsAndReplies item={recipe} itemId={recipeId} type={"Recipe"} />
    </main>
  );
};

export default RecipeDetails;
