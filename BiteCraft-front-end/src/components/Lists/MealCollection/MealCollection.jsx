import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";

const MealCollection = () => {
  const { user } = useContext(UserContext);
  const [ meals, setMeals ] = useState([]);
    const params = useParams();
    const [toggleEffect, setToggleEffect] = useState(false);
  
  useEffect(() => {
    const fetchAllMeals = async () => {
      const mealsData = await biteCraftService.Index(
        "MealCollection",
        user._id
      );
      if (mealsData) {
        setMeals(mealsData);
      }
    };
    if (user) fetchAllMeals();
  }, [ user, toggleEffect ]);
  
    const handleRemoveFromCollection = async (mealId) => {
      try {
        await biteCraftService.RemoveFromCollection("Meal", mealId, user._id);
        setToggleEffect(!toggleEffect)
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <main>
      <h1>Welcome to {user.username}'s Meals Collection</h1>
      <Link to="/meals/new">
        <button>Add New Meal</button>
      </Link>
      {meals.length > 0 ? (
        meals.map((meal, idx) => (
          <article key={idx}>
            <header>
              <Link to={`/meals/${meal._id}`}>
                <h2>{meal.name}</h2>
              </Link>
              <p>{`${meal.author.username} posted on ${new Date(
                meal.createdAt
              ).toLocaleDateString()}`}</p>
            </header>
            {user._id === params.userId && (
              <button onClick={() => handleRemoveFromCollection(meal._id)}>
                Remove from Collection
              </button>
            )}
            {/* <p>{meal.details}</p>
            <h3>Recipes:</h3>
            <p>
              Main Dish:{" "}
              <Link to={`/recipes/${meal.main._id}`}>{meal.main.name}</Link>
            </p>
            <p>
              Side Dish:{" "}
              <Link to={`/recipes/${meal.side1._id}`}>{meal.side1.name}</Link>
            </p>
            {meal.side2 ? (
              <p>
                Side Dish:{" "}
                <Link to={`/recipes/${meal.side2._id}`}>{meal.side2.name}</Link>
              </p>
            ) : (
              ""
            )} */}
          </article>
        ))
      ) : (
        <h2>Meals Collection is Currently Empty!</h2>
      )}
    </main>
  );
};

export default MealCollection;
