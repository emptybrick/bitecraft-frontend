import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import Button from "../../Component/Button/Button";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";

const RecipeCollection = () => {
  const { user } = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);
  const params = useParams();
  const [toggleEffect, setToggleEffect] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchAllRecipes = async () => {
      const recipesData = await biteCraftService.Index(
        "RecipeCollection",
        user._id
      );
      if (recipesData) {
        setRecipes(recipesData);
      }
      setIsLoading(false);
    };

    if (user) fetchAllRecipes();
  }, [user, toggleEffect]);

  const handleRemoveFromCollection = async (recipeId) => {
    try {
      await biteCraftService.RemoveFromCollection("Recipe", recipeId, user._id);
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
    <main>
      <div className="section">
        <div className="hero">
          <h1 className="title has-text-centered mb-6">
            Welcome to {user.username}'s Recipes Collection
          </h1>
        </div>
        <div className="container">
          <div className="box">
            <div className="columns is-multiline mt-2 has-text-centered is-vcentered">
              {recipes.length > 0 ? (
                recipes.map((recipe, idx) => (
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
                            {recipe.name}
                          </h2>
                          <button
                            className="delete"
                            aria-label="close"
                            onClick={handleCloseQuickView}
                          ></button>
                        </header>
                        <section className="modal-card-body pb-2">
                          <div className="columns is-4">
                            <div className="column is-one-third">
                              <h4 className="subtitle is-5 mb-4 has-text-weight-bold is-underlined">
                                Ingredients
                              </h4>
                              <div className="content">
                                <ul>
                                  {recipe.ingredients.map((ing, idx) => (
                                    <li key={idx}>
                                      <p className="mb-2 has-text-left">{`${ing.quantity} ${ing.unit} ${ing.name}`}</p>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="column pl-4">
                              <h4 className="subtitle is-5 mb-4 has-text-weight-bold is-underlined">
                                Instructions
                              </h4>
                              <ol className="pl-6">
                                {recipe.instructions.map((instruction, idx) => (
                                  <li className="" key={idx}>
                                    <p className="has-text-left pl-2">
                                      {instruction}
                                    </p>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        </section>
                        <footer className="modal-card-foot pt-4 is-flex-direction-column">
                          <div className="level mb-2 is-gap-8">
                            <p className="has-text-left pt-2 mr-6 pr-6">{`Total Comments: ${recipe.comments.length}`}</p>
                            <p className="has-text-right pt-2 ml-6 pl-6">{`${
                              recipe.author.username
                            } posted on ${new Date(
                              recipe.createdAt
                            ).toLocaleDateString()}`}</p>
                          </div>
                          <div className="buttons">
                            <Button
                              onClick={(e) => handleCloseQuickView(e)}
                              buttonText="Close"
                            />
                            {user._id === params.userId &&
                              recipe.author._id !== user._id && (
                                <Button
                                  onClick={() =>
                                    handleRemoveFromCollection(recipe._id)
                                  }
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
                            {recipe.name}
                          </div>
                          <div
                            className="is-6 pl-2 pr-2 card-content-override-details"
                          >
                            {recipe.details}
                          </div>
                          <div className="is-8 pt-3">
                            Created by:{" "}
                            <span className="has-text-weight-semibold">
                              {recipe.author.username}
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
                          <Link className="ml-1" to={`/recipes/${recipe._id}`}>
                            <Button
                              className="button is-primary is-light"
                              buttonText="Go to Recipe"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="column is-full">
                  <h2 className="title is-4 has-text-grey-light">
                    Recipes Collection is Currently Empty!
                  </h2>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RecipeCollection;
