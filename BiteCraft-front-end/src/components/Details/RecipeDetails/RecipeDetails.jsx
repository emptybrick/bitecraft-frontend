import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import RecipeForm from "../../Forms/RecipeForm/RecipeForm";
import CommentsAndReplies from "../Comments/Comments";
import CardHeader from "../../Component/Header/CardHeader";
import Button from "../../Component/Button/Button";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";

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
    <main>
      <section className="section">
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
            <CardHeader item={recipe} />
            <div className="container mt-2">
              <div className="columns is-desktop">
                <div className="column is-one-third">
                  <div className="box has-text-centered">
                    <h4 className="subtitle is-5 mb-3 has-text-weight-bold is-underlined">
                      Ingredients
                    </h4>
                    <ul className="content has-text-left">
                      {recipe.ingredients.map((ing, idx) => (
                        <li key={idx} className="mb-2">
                          {`${ing.quantity} ${ing.unit} ${ing.name}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="column">
                  <div className="box has-text-centered">
                    <h4 className="subtitle is-5 mb-3 has-text-weight-bold is-underlined">
                      Instructions
                    </h4>
                    <ol className="content has-text-left pl-4 ml-2">
                      {recipe.instructions.map((instruction, idx) => (
                        <li key={idx} className="mb-2">
                          <span className="is-size-6">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
              <div className="level mb-4">
                <Button
                  className="button is-medium"
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
                      className="button has-background-primary-45 is-medium"
                      onClick={handleAddToCollection}
                      buttonText="Add to Collection"
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        <div className="comments-replys">
          <CommentsAndReplies item={recipe} itemId={recipeId} type={"Recipe"} />
        </div>
      </section>
    </main>
  );
};

export default RecipeDetails;
