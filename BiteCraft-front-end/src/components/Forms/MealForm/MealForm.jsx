import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";

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
  const [mainRecipes, setMainRecipes ] = useState(mainsFromDetails);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true)
    const fetchAllRecipes = async () => {
      console.log("fetching meal form data")
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
      setIsLoading(false)
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

  return (
    <>
      {!isLoading && mainRecipes.length < 1 || sideRecipes.length < 1 ? (
        <div>
          <h2>Not enough recipes found in your collection!</h2>
          <h3>
            Add some recipes from other users to your collection, or create a
            new recipe! Make sure you have atleast 1 Main and 1 Side recipe.
          </h3>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name-input">Name:</label>
            <input
              required
              type="text"
              name="name"
              id="name-input"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="details-input">Details:</label>
            <textarea
              type="text"
              name="details"
              id="details-input"
              value={formData.details}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="main-input">Main Dish:</label>
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
              {mainRecipes.map((recipe, idx) => {
                return (
                  <option key={idx} value={recipe._id}>
                    {recipe.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label htmlFor="side1-input">Side Dish 1:</label>
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
              {sideRecipes.map((recipe, idx) => {
                return (
                  <option key={idx} value={recipe._id}>
                    {recipe.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label htmlFor="side2-input">Side Dish 2:</label>
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
              {sideRecipes.map((recipe, idx) => {
                return (
                  <option key={idx} value={recipe._id}>
                    {recipe.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <button type="Submit">{buttonText}</button>
            <button
              type="button"
              onClick={onCancel ? onCancel : () => handleNavigation()}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default MealForm;
