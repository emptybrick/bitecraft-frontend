import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import { Link } from "react-router";
import MealForm from "../../Forms/MealForm/MealForm";
import CommentsAndReplies from "../Comments/Comments";
import CardHeader from "../../Component/Header/CardHeader";
import Button from "../../Component/Button/Button";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";

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

  // meal handlers
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

  if (!meal || isLoading) return <ProgressBar />;

  return (
    <main>
      <section className="section">
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
            <CardHeader item={meal} />
            <div className="container mt-2">
              <div className="box">
                <h4 className="subtitle is-3 mb-5 has-text-weight-bold has-text-centered">
                  Recipes:
                </h4>
                <div className="content">
                  <div className="content">
                    <div>
                      <span className="has-text-weight-semibold is-size-5">
                        Main Dish:{" "}
                      </span>
                      {meal.main ? (
                        <Link
                          key={meal.main._id}
                          to={`/recipes/${meal.main._id}`}
                          className="has-text-link has-text-weight-semibold is-size-5"
                        >
                          {meal.main.name}
                        </Link>
                      ) : (
                        <span className="has-text-grey-light">
                          Recipe is no longer available.
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      {meal.main ? (
                        <p className="is-size-6 has-text-grey">
                          {meal.main.details}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="content">
                    <div>
                      <span className="has-text-weight-semibold is-size-5">
                        Side Dish:{" "}
                      </span>
                      {meal.side1 ? (
                        <Link
                          key={meal.side1._id}
                          to={`/recipes/${meal.side1._id}`}
                          className="has-text-link has-text-weight-semibold is-size-5"
                        >
                          {meal.side1.name}
                        </Link>
                      ) : (
                        <span className="has-text-grey-light">
                          Recipe is no longer available.
                        </span>
                      )}
                      <div className="mt-1">
                        {meal.side1 ? (
                          <p className="is-size-6 has-text-grey">
                            {meal.side1.details}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="content">
                    <div>
                      <span className="has-text-weight-semibold is-size-5">
                        Side Dish:{" "}
                      </span>
                      {meal.side2 ? (
                        <Link
                          key={meal.side2._id}
                          to={`/recipes/${meal.side2._id}`}
                          className="has-text-link has-text-weight-semibold is-size-5"
                        >
                          {meal.side2.name}
                        </Link>
                      ) : (
                        <span className="has-text-grey-light">
                          Recipe is no longer available.
                        </span>
                      )}
                      <div className="mt-1">
                        {meal.side2 ? (
                          <p className="is-size-6 has-text-grey">
                            {meal.side2.details}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {meal.author._id === user._id && !visibleMealForm && (
                  <div className="field mt-4 is-grouped is-grouped-right">
                    <Button onClick={handleDeleteMeal} buttonText="Delete" />
                    <Button onClick={toggleMealForm} buttonText="Edit" />
                  </div>
                )}
                {!mealsInCollection.includes(mealId) && (
                  <div className="mt-4 has-text-right">
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
      </section>
      <CommentsAndReplies item={meal} itemId={mealId} type={"Meal"} />
    </main>
  );
};

export default MealDetails;
