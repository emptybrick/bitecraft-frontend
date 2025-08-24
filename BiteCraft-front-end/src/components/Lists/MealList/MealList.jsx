import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";

const MealList = () => {
  const { user } = useContext(UserContext);
  const [meals, setMeals] = useState([]);
  useEffect(() => {
    const fetchAllMeals = async () => {
      const mealsData = await biteCraftService.Index("Meal");
      setMeals(mealsData);
    };
    if (user) fetchAllMeals();
  }, [user]);

  return (
    <main>
      <h1>List of All Meals!</h1>
      <Link to="/meals/new">
        <button>Add New Meal</button>
      </Link>
      {meals.map((meal) => (
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
            <p>Main Dish: {meal.main.name}</p>
            <p>Side Dish: {meal.side1.name}</p>
            {meal.side2 ? <p>Side Dish: {meal.side2.name}</p> : ""}
          </article>
        </Link>
      ))}
    </main>
  );
};

export default MealList;
