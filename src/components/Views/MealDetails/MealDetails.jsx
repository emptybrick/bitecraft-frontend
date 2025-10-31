import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import MealForm from "../../Forms/MealForm/MealForm";
import CommentsAndReplies from "../../Component/Comments/Comments";
import DetailsHeader from "../../Component/Header/DetailsHeader";
import Button from "../../Component/Button/Button";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";
import RecipeBody from "../../Component/Body/RecipeBody";

const MealDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useContext(UserContext);
  const [meal, setMeal] = useState(null);
  const [mealsInCollection, setMealsInCollection] = useState([]);
  const mealId = params.mealId;
  const [visibleMealForm, setVisibleMealForm] = useState(null);
  const [sideRecipes, setSideRecipes] = useState([]);
  const [mainRecipes, setMainRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const mealOptions = ["main", "side1", "side2"];

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const mealToShow = await biteCraftService.Show("Meal", mealId);
      setMeal(mealToShow);
      if (mainRecipes.length < 1 || sideRecipes.length < 1) {
        const recipesData = await biteCraftService.Index(
          "RecipeCollection",
          user._id
        );
        if (recipesData.length >= 1) {
          const mains = [...recipesData].filter(
            (recipe) => recipe.category === "Main"
          );
          const sides = [...recipesData].filter(
            (recipe) => recipe.category === "Side"
          );
          setSideRecipes(sides);
          setMainRecipes(mains);
        }
      }
      if (mealsInCollection.length < 1) {
        const mealsToGet = await biteCraftService.Index(
          "MealCollection",
          user._id
        );
        const recipeArray = mealsToGet.map((item) => item._id);
        setMealsInCollection(recipeArray);
      }
      setIsLoading(false);
    };
    if (!visibleMealForm) {
      getData();
    }
  }, [mealId]);

  const toggleMealForm = () => {
    setVisibleMealForm(!visibleMealForm);
  };

  const handleUpdateMeal = async (formData) => {
    if (!formData.main || !formData.side1 || !formData.side2) return;
    try {
      await biteCraftService.Update("Meal", formData, mealId);
      const mealToShow = await biteCraftService.Show("Meal", mealId);
      setMeal(mealToShow);
      toggleMealForm();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMeal = async () => {
    try {
      await biteCraftService.Delete("Meal", mealId);
      navigate(`/${user._id}/meals-collection`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCollection = async () => {
    try {
      await biteCraftService.AddToCollection("Meal", meal, user._id);
      navigate(`/${user._id}/meals-collection`);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!meal || isLoading) return <ProgressBar />;

  return (
    <section className="section">
      <div className="container">
        {visibleMealForm ? (
          <MealForm
            initialData={meal}
            handleUpdateMeal={(formData) => {
              handleUpdateMeal(formData);
            }}
            buttonText="Save"
            onCancel={() => toggleMealForm()}
            sidesFromDetails={sideRecipes}
            mainsFromDetails={mainRecipes}
          />
        ) : (
          <>
            <DetailsHeader item={meal} />
            <div className="container">
              <div className="columns is-multiline">
                {mealOptions.map((option, idx) => (
                  <div className="column is-full" key={idx}>
                    <RecipeBody item={meal[option]} type={"Meal"} />
                  </div>
                ))}
              </div>
              <div className="level">
                <Button
                  onClick={handlePrint}
                  buttonText="Print"
                />
                {meal.author._id === user._id && !visibleMealForm && (
                  <div className="field is-grouped is-grouped-right">
                    <Button onClick={handleDeleteMeal} buttonText="Delete" />
                    <Button onClick={toggleMealForm} buttonText="Edit" />
                  </div>
                )}
                {!mealsInCollection.includes(mealId) && (
                  <div className="has-text-right">
                    <Button
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
          <CommentsAndReplies item={meal} itemId={mealId} type={"Meal"} />
        </div>
      </div>
    </section>
  );
};

export default MealDetails;
