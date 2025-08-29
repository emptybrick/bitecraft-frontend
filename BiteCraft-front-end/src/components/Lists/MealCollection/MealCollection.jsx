import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import Button from "../../Component/Button/Button";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";

const MealCollection = () => {
  const { user } = useContext(UserContext);
  const [meals, setMeals] = useState([]);
  const params = useParams();
  const [toggleEffect, setToggleEffect] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchAllMeals = async () => {
      const mealsData = await biteCraftService.Index(
        "MealCollection",
        user._id
      );
      if (mealsData) {
        setMeals(mealsData);
      }
      setIsLoading(false);
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

  if (!user || isLoading) return <ProgressBar />;

  return (
    <main className="section">
      <div className="hero">
        <h1 className="title has-text-centered mb-6">
          Welcome to {user.username}'s Meals Collection
        </h1>
      </div>
      <div className="container">

          <div className="columns is-multiline mt-2 has-text-centered is-vcentered">
            {meals.length > 0 ? (
              meals.map((meal, idx) => (
                <div className="column is-one-third" key={idx}>
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
                      </section>
                      <footer className="modal-card-foot pt-4 is-flex-direction-column">
                        <div className="level mb-2 is-gap-8">
                          <p className="has-text-left pt-2 mr-6 pr-6">{`Total Comments: ${meal.comments.length}`}</p>
                          <p className="has-text-right pt-2 ml-6 pl-6">{`${
                            meal.author.username
                          } posted on ${new Date(
                            meal.createdAt
                          ).toLocaleDateString()}`}</p>
                        </div>
                        <div className="buttons">
                          <Button
                            onClick={(e) => handleCloseQuickView(e)}
                            buttonText="Close"
                          />
                          {user._id === params.userId &&
                            meal.author._id !== user._id && (
                              <Button
                                onClick={(e) => {
                                  handleCloseQuickView(e);
                                  handleRemoveFromCollection(meal._id);
                                }}
                                buttonText="Remove from Collection"
                              />
                            )}
                        </div>
                      </footer>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-content">
                      <div>
                        <div className="subtitle is-4 mb-2 pt-2">
                          {meal.name}
                        </div>
                        <div className="is-6 pl-2 pr-2 card-content-override-details">
                          {meal.details}
                        </div>
                        <div className="is-8 pt-3">
                          Created by:{" "}
                          <span className="has-text-weight-semibold">
                            {meal.author.username}
                          </span>
                        </div>
                      </div>
                      <div className="buttons is-grouped are-small is-centered mt-2">
                        <button
                          className="button modal-trigger is-info is-light"
                          id={`modal-trigger-${idx}`}
                          data-target={`modal-${idx}`}
                          onClick={(e) => handleShowQuickView(e)}
                        >
                          Quick View
                        </button>
                        <Link className="ml-1" to={`/meals/${meal._id}`}>
                          <Button
                            className="button is-primary is-light"
                            buttonText="Go to Meal"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
              <div className="container">
              <div className="notification is-warning is-light has-text-centered">
                <p className="is-size-4">
                  There are no meals in your collection!
                </p>
                <p className="is-size-5 mt-2">
                  <span role="img" aria-label="chef">
                    👨‍🍳
                  </span>{" "}
                  Add meals from other users or create your own to get started!
                </p>
                <Link className="ml-1" to={`/meals`}>
                  <Button
                    className="button is-link is-light mt-4 is-medium"
                    buttonText="View All Meals"
                  />
                </Link>
                </div>
              </div>
            )}
          </div>

      </div>
    </main>
  );
};

export default MealCollection;
