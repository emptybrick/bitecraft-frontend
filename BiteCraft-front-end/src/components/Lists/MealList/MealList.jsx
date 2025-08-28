import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";

const MealList = () => {
  const { user } = useContext(UserContext);
  const [meals, setMeals] = useState([]);
  const [search, setSearch] = useState("");

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

  if (!user || !meals) return <ProgressBar />;

  return (
    <main className="section">
      <div className="container">
        <h1 className="title is-3 has-text-centered mb-5">
          List of All Meals!
        </h1>
        <div className="container mb-5">
          <input
            className="input is-small has-background-light"
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="table-container">
          <table className="table is-hoverable is-fullwidth">
            <thead className="has-background-primary">
              <tr>
                <th>Name</th>
                <th>Author</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {meals
                .filter((meal) =>
                  meal.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((meal) => (
                  <tr key={meal._id}>
                    <td>
                      <Link
                        to={`/meals/${meal._id}`}
                        className="has-text-info-40 has-text-weight-bold"
                      >
                        {meal.name}
                      </Link>
                    </td>
                    <td>{meal.author.username}</td>
                    <td>{new Date(meal.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default MealList;
