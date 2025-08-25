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
      const filteredMeals = mealsData.filter(
        (meal) => meal.main && meal.side1 && meal.side2
      );
      setMeals(filteredMeals);
    };
    if (user) fetchAllMeals();
  }, [user]);

  return (
    <main>
      <h1>List of All Meals!</h1>
      <Link to="/meals/new">
        <button>Add New Meal</button>
      </Link>
      {meals.map((meal, idx) => (
        <article key={idx}>
          <header>
            <Link to={`/meals/${meal._id}`}>
              <h2>{meal.name}</h2>{" "}
            </Link>
            <p>{`${meal.author.username} posted on ${new Date(
              meal.createdAt
            ).toLocaleDateString()}`}</p>
          </header>
          <p>{meal.details}</p>
        </article>
      ))}
    </main>
  );
};

export default MealList;
