import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";

const MealCollection = () => {
  const { user } = useContext(UserContext);
  const [meals, setMeals] = useState([]);
  useEffect(() => {
    const fetchAllMeals = async () => {
      const mealsData = await biteCraftService.Index("MealCollection", user._id);
      if (mealsData) {
        setMeals(mealsData);
      }
    };
    if (user) fetchAllMeals();
  }, [user]);

  return (
    <main>
      <h1>Welcome to {user.username}'s Meals Collection</h1>
      <Link to="/meals/new">
        <button>Add New Meal</button>
      </Link>
      {meals.length > 0 ? (
        meals.map((meal) => (
          <Link key={meal._id} to={`/meals/${meal._id}`}>
            <article>
              <header>
                <h2>{meal.name}</h2>
                <p>{`${meal.author.username} posted on ${new Date(
                  meal.createdAt
                ).toLocaleDateString()}`}</p>
              </header>
              <p>{meal.details}</p>
              <h3>Recipes:</h3>
              <Link key={meal.main._id} to={`/recipes/${meal.main._id}`}>
                Main Dish: {meal.main.name}
              </Link>
              <Link key={meal.side1._id} to={`/recipes/${meal.side1._id}`}>
                Side Dish: {meal.side1.name}
              </Link>
              {main.side2 ? (
                <Link key={meal.side2._id} to={`/recipes/${meal.side2._id}`}>
                  Side Dish: {meal.side2.name}
                </Link>
              ) : (
                ""
              )}
            </article>
          </Link>
        ))
      ) : (
        <h2>Meals Collection is Currently Empty!</h2>
      )}
    </main>
  );
};

export default MealCollection;
