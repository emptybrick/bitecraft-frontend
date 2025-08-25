import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";

const MealList = () => {
  const { user } = useContext(UserContext);
  const [ meals, setMeals ] = useState([]);
  
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
          {/* <h3>Recipes:</h3>
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
      ))}
    </main>
  );
};

export default MealList;
