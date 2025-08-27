import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import Button from "../../Component/Button/Button";

const MealCollection = () => {
  const { user } = useContext(UserContext);
  const [meals, setMeals] = useState([]);
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
  }, [user, toggleEffect]);

  const handleRemoveFromCollection = async (mealId) => {
    try {
      await biteCraftService.RemoveFromCollection("Meal", mealId, user._id);
      setToggleEffect(!toggleEffect);
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <main>
      <h1>Welcome to {user.username}'s Meals Collection</h1>
      <Link to="/meals/new">
        <Button buttonText="Create New Meal" />
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
            {user._id === params.userId && meal.author._id !== user._id && (
              <Button
                onClick={() => handleRemoveFromCollection(meal._id)}
                buttonText="Remove from Collection"
              />
            )}
          </article>
        ))
      ) : (
        <h2>Meals Collection is Currently Empty!</h2>
      )}
    </main>
  );
};

export default MealCollection;
