import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";

const MealForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    main: null,
    side1: null,
    side2: null,
    name: "",
    details: "",
  });
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    const fetchAllRecipes = async () => {
      const recipesData = await biteCraftService.Index("Recipe");
      setRecipes(recipesData);
    };
    if (user) fetchAllRecipes();
  }, [user]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await biteCraftService.Create("Meal", formData);
      navigate(`/collections/${user._id}/meals-collection`);
    } catch (error) {
      console.log(error);
    }
  };

  const sideRecipes = recipes.filter((recipe) => recipe.category === "Side");
  const mainRecipes = recipes.filter((recipe) => recipe.category === "Main");

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name-input">Name:</label>
        <input
          required
          type="text"
          name="name"
          id="name-input"
          value={formData.name}
          onChange={handleChange}
        />
        <label htmlFor="details-input">Details:</label>
        <textarea
          type="text"
          name="details"
          id="details-input"
          value={formData.details}
          onChange={handleChange}
          required
        ></textarea>
        <label htmlFor="main-input">Main Dish:</label>
        <select
          required
          name="main"
          id="main-input"
          value={formData.main}
          onChange={handleChange}
        >
          <option value="" disabled selected>
            Select a Recipe
          </option>
          {mainRecipes.map((recipe) => {
            <option value={recipe._id}>{recipe.name}</option>;
          })}
        </select>
        <label htmlFor="side1-input">Side Dish 1:</label>
        <select
          required
          name="side1"
          id="side1-input"
          value={formData.side1}
          onChange={handleChange}
        >
          <option value="" disabled selected>
            Select a Recipe
          </option>
          {sideRecipes.map((recipe) => {
            <option value={recipe._id}>{recipe.name}</option>;
          })}
        </select>
        <label htmlFor="side2-input">Side Dish 2:</label>
        <select
          required
          name="side2"
          id="side2-input"
          value={formData.side2}
          onChange={handleChange}
        >
          <option value="" disabled selected>
            Select a Recipe
          </option>
          {sideRecipes.map((recipe) => {
            <option value={recipe._id}>{recipe.name}</option>;
          })}
        </select>
        <button type="Submit">Submit</button>
      </form>
    </main>
  );
};

export default MealForm;
