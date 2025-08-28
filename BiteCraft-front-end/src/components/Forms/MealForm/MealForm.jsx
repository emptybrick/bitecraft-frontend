import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import Button from "../../Component/Button/Button";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";

const MealForm = ({
  onCancel,
  initialData = null,
  buttonText = "Submit",
  handleUpdateMeal,
  sidesFromDetails = [],
  mainsFromDetails = [],
}) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState(
    initialData
      ? initialData
      : {
          main: "",
          side1: "",
          side2: "",
          name: "",
          details: "",
        }
  );
  const [sideRecipes, setSideRecipes] = useState(sidesFromDetails);
  const [mainRecipes, setMainRecipes] = useState(mainsFromDetails);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchAllRecipes = async () => {
      setIsLoading(true);
      const recipesData = await biteCraftService.Index(
        "RecipeCollection",
        user._id
      );
      if (recipesData.length >= 1) {
        const mains = [...recipesData].filter(
          (recipe) => recipe.category === "Main"
        );
        const sides = [...recipesData].filter(
          (recipe) => recipe.category === "Side"
        );
        setSideRecipes(sides);
        setMainRecipes(mains);
      }
      setIsLoading(false);
    };
    if (user) fetchAllRecipes();
  }, [user]);

  const handleNavigation = () => {
    navigate(`/${user._id}/recipes-collection`);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.main || !formData.side1 || !formData.side2) return;
    if (initialData && buttonText === "Save") {
      handleUpdateMeal(formData);
    } else {
      try {
        await biteCraftService.Create("Meal", formData);
        navigate(`/${user._id}/meals-collection`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (isLoading) return <ProgressBar />

  return (
    <>
      {mainRecipes.length < 1 || sideRecipes.length < 1 ? (
        <div className="container mt-6">
          <article className="message is-warning">
            <div className="message-header">
              <span className="icon-text">
                <span className="icon">
                  <i className="fas fa-exclamation-triangle"></i>
                </span>
                <span>Not enough recipes found!</span>
              </span>
            </div>
            <div className="message-body has-text-centered">
              <p>
                You need at least <strong>1 Main</strong> and{" "}
                <strong>1 Side</strong> recipe in your collection to create a
                meal.
              </p>
              <p className="mt-2">
                <span role="img" aria-label="chef">
                  👨‍🍳
                </span>{" "}
                Add recipes from other users or create your own to get started!
              </p>
              <button
                className="button is-link is-light mt-4"
                onClick={handleNavigation}
              >
                Go to Recipes Collection
              </button>
            </div>
          </article>
        </div>
      ) : (
          <div className="container">
            <h2 className="title is-4 pt-5 has-text-centered">Meal Form</h2>
          <form onSubmit={handleSubmit} className="box mt-4">
            <div className="field">
              <label className="label" htmlFor="name-input">
                Name
              </label>
              <div className="control">
                <input
                  required
                  className="input"
                  type="text"
                  name="name"
                  id="name-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Meal name"
                />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="details-input">
                Details
              </label>
              <div className="control">
                <textarea
                  className="textarea"
                  type="text"
                  name="details"
                  id="details-input"
                  value={formData.details}
                  onChange={handleChange}
                  required
                  placeholder="Describe your meal"
                ></textarea>
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="main-input">
                Main Dish
              </label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    required
                    name="main"
                    id="main-input"
                    value={formData.main}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select a Recipe
                    </option>
                    {mainRecipes.map((recipe, idx) => (
                      <option key={idx} value={recipe._id}>
                        {recipe.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="side1-input">
                Side Dish 1
              </label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    required
                    name="side1"
                    id="side1-input"
                    value={formData.side1}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select a Recipe
                    </option>
                    {sideRecipes.map((recipe, idx) => (
                      <option key={idx} value={recipe._id}>
                        {recipe.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="side2-input">
                Side Dish 2
              </label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    required
                    name="side2"
                    id="side2-input"
                    value={formData.side2}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select a Recipe
                    </option>
                    {sideRecipes.map((recipe, idx) => (
                      <option key={idx} value={recipe._id}>
                        {recipe.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="field is-grouped is-grouped-right mt-5">
              <div className="control">
                <Button type="Submit" buttonText={buttonText} />
              </div>
              <div className="control">
                <Button
                  type="button"
                  onClick={onCancel ? onCancel : () => handleNavigation()}
                  buttonText="Cancel"
                />
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default MealForm;
