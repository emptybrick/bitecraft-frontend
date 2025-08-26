import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import CommentForm from "../../Forms/CommentForm/CommentForm";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import { Link } from "react-router";
import MealForm from "../../Forms/MealForm/MealForm";
import CommentsAndReplies from "../Comments/Comments";
import Header from "../../Component/Header/Header";

const MealDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useContext(UserContext);
  const [meal, setMeal] = useState(null);
  const [mealsInCollection, setMealsInCollection] = useState([]);
  const mealId = params.mealId;
  const [visibleMealForm, setVisibleMealForm] = useState(null);
  const [sideRecipes, setSideRecipes] = useState([]);
  const [ mainRecipes, setMainRecipes ] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true)
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
      setIsLoading(false)
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
    if (!formData.main || !formData.side1 || !formData.side2)
      return;
    try {
        await biteCraftService.Update("Meal", formData, mealId);
        setMeal(formData);
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

  if (!meal || isLoading) return <main>Loading...</main>;

  return (
    <main>
      <section>
        {visibleMealForm ? (
          <MealForm
            initialData={meal}
            handleUpdateMeal={(formData) => {
              handleUpdateMeal(formData);
            }}
            buttonText="Save"
            onCancel={ () => toggleMealForm() }
            sidesFromDetails={ sideRecipes }
            mainsFromDetails={mainRecipes}
          />
        ) : (
          <>
          <Header item={meal}/>
            <h3>Recipes:</h3>
            <div>
              Main Dish:
              {meal.main ? (
                <Link key={meal.main._id} to={`/recipes/${meal.main._id}`}>
                  {meal.main.name}
                </Link>
              ) : (
                "Recipe is no longer available."
              )}
            </div>
            <div>
              Side Dish:
              {meal.side1 ? (
                <Link key={meal.side1._id} to={`/recipes/${meal.side1._id}`}>
                  {meal.side1.name}
                </Link>
              ) : (
                "Recipe is no longer available."
              )}
            </div>
            <div>
              Side Dish:
              {meal.side2 ? (
                <Link key={meal.side2._id} to={`/recipes/${meal.side2._id}`}>
                  {meal.side2.name}
                </Link>
              ) : (
                "Recipe is no longer available."
              )}
            </div>
            {meal.author._id === user._id &&
              !visibleMealForm && (
                <>
                  <button onClick={handleDeleteMeal}>Delete</button>
                  <button onClick={() => toggleMealForm()}>
                    Edit
                  </button>
                </>
              )}
          </>
        )}
        {!mealsInCollection.includes(mealId) && (
          <button onClick={handleAddToCollection}>Add to Collection</button>
        )}
      </section>
      <CommentsAndReplies item={meal} itemId={mealId} type={"Meal"} />
    </main>
  );
};

export default MealDetails;
