import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import RecipeForm from "../../Forms/RecipeForm/RecipeForm";
import CommentsAndReplies from "../../Component/Comments/Comments";
import DetailsHeader from "../../Component/Header/DetailsHeader";
import Button from "../../Component/Button/Button";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";
import RecipeBody from "../../Component/Body/RecipeBody";

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

  const handlePrint = () => {
    window.print();
  };

  if (!recipe || isLoading || !user) return <ProgressBar />;

  return (
    <section className="section">
      <div className="container">
        <div>
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
              <DetailsHeader item={recipe} />
              <RecipeBody item={recipe} />
              <div className="level mb-4 mt-4">
                <Button
                  onClick={handlePrint}
                  buttonText="Print"
                />
                {recipe.author._id === user._id && !visibleRecipeForm && (
                  <div className="field is-grouped">
                    <Button onClick={handleDeleteRecipe} buttonText="Delete" />
                    <Button onClick={toggleRecipeForm} buttonText="Edit" />
                  </div>
                )}
                {!recipesInCollection.includes(recipeId) && (
                  <div className="has-text-centered">
                    <Button
                      onClick={handleAddToCollection}
                      buttonText="Add to Collection"
                    />
                  </div>
                )}
              </div>
            </>
          )}
          <div className="comments-replys">
            <CommentsAndReplies
              item={recipe}
              itemId={recipeId}
              type={"Recipe"}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecipeDetails;
