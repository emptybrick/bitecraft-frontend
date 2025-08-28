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
  const [activeModal, setActiveModal] = useState(null);

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

  const handleShowQuickView = (e) => {
    e.preventDefault();
    const modal = e.target.dataset.target;
    setActiveModal(modal);
  };

  const handleCloseQuickView = (e) => {
    e.preventDefault();
    setActiveModal(null);
  };

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <main className="section">
      <div className="hero">
        <h1 className="title has-text-centered mb-1">
          Welcome to {user.username}'s Meals Collection
        </h1>
      </div>
      <div className="has-text-centered mt-4">
        <Link to="/meals/new">
          <Button buttonText="Create New Meal" />
        </Link>
      </div>
      <div className="columns is-multiline is-centered mt-2 has-text-centered">
        {meals.length > 0 ? (
          meals.map((meal, idx) => (
            <div className="column is-one-quarter" key={idx}>
              <div
                className={`modal ${
                  activeModal === `modal-${idx}` ? "is-active" : ""
                }`}
                id={`modal-${idx}`}
              >
                <div
                  className="modal-background"
                  onClick={handleCloseQuickView}
                ></div>
                <div className="modal-card">
                  <header className="modal-card-head has-background-primary">
                    <h2 className="has-text-weight-extrabold modal-card-title has-text-white">
                      {meal.name}
                    </h2>
                    <button
                      className="delete"
                      aria-label="close"
                      onClick={handleCloseQuickView}
                    ></button>
                  </header>
                  <section className="modal-card-body pb-2">
                    <h3 className="subtitle is-4 has-text-weight-bold is-underlined">
                      Recipes:
                    </h3>
                    <div className="has-text-left pl-4">
                      <div className="mb-2">
                        <span className="has-text-weight-semibold">
                          Main Dish:{" "}
                        </span>
                        {meal.main ? (
                          <Link
                            key={meal.main._id}
                            to={`/recipes/${meal.main._id}`}
                            className="has-text-link"
                          >
                            {meal.main.name}
                          </Link>
                        ) : (
                          <span className="has-text-grey-light">
                            Recipe is no longer available.
                          </span>
                        )}
                      </div>
                      <div className="mb-2">
                        <span className="has-text-weight-semibold">
                          Side Dish:{" "}
                        </span>
                        {meal.side1 ? (
                          <Link
                            key={meal.side1._id}
                            to={`/recipes/${meal.side1._id}`}
                            className="has-text-link"
                          >
                            {meal.side1.name}
                          </Link>
                        ) : (
                          <span className="has-text-grey-light">
                            Recipe is no longer available.
                          </span>
                        )}
                      </div>
                      <div className="mb-2">
                        <span className="has-text-weight-semibold">
                          Side Dish:{" "}
                        </span>
                        {meal.side2 ? (
                          <Link
                            key={meal.side2._id}
                            to={`/recipes/${meal.side2._id}`}
                            className="has-text-link"
                          >
                            {meal.side2.name}
                          </Link>
                        ) : (
                          <span className="has-text-grey-light">
                            Recipe is no longer available.
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="level">
                    <p className="has-text-left pt-2">{`Total Comments: ${meal.comments.length}`}</p>
                    <p className="has-text-right pt-2">{`${
                      meal.author.username
                    } posted on ${new Date(
                      meal.createdAt
                    ).toLocaleDateString()}`}</p></div>
                  </section>
                  <footer className="modal-card-foot is-justify-content-center pt-2">
                    <div className="buttons">
                      <Button
                        onClick={(e) => handleCloseQuickView(e)}
                        buttonText="Close"
                      />
                      {user._id === params.userId &&
                        meal.author._id !== user._id && (
                          <Button
                            onClick={() => handleRemoveFromCollection(meal._id)}
                            buttonText="Remove from Collection"
                          />
                        )}
                    </div>
                  </footer>
                </div>
              </div>
              <div className="card has-background-light">
                <div>
                  <div className="subtitle is-4 mb-2 pt-2">{meal.name}</div>
                  <div className="is-6 pl-2 pr-2">{meal.details}</div>
                  <div className="is-8 pt-3">
                    Created by:{" "}
                    <span className="has-text-weight-semibold">
                      {meal.author.username}
                    </span>
                  </div>
                </div>
                <div className="buttons is-justify-content-center pb-3 mt-2 is-gapless">
                  <button
                    className="button modal-trigger is-info mr-1"
                    id={`modal-trigger-${idx}`}
                    data-target={`modal-${idx}`}
                    onClick={(e) => handleShowQuickView(e)}
                  >
                    Quick View
                  </button>
                  <Link className="ml-1" to={`/meals/${meal._id}`}>
                    <Button buttonText="Go to Meal" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="column is-full">
            <h2 className="title is-4 has-text-grey-light">
              Meals Collection is Currently Empty!
            </h2>
          </div>
        )}
      </div>
    </main>
  );
};

export default MealCollection;
