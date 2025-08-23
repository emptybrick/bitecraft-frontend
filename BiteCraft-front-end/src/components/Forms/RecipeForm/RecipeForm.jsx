import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";

const RecipeForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    details: "",
    instructions: "",
    ingredients: "",
    category: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await biteCraftService.Create("Recipe", formData);
      navigate(`/collections/${user._id}/meals-collection`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label htmlFor="category-input">Category:</label>
        <select
          required
          name="category"
          id="category-input"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="Main">Main Dish</option>
          <option value="Side">Side Dish</option>
        </select>
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
        <label htmlFor="instructions-input">Instructions:</label>
        <textarea
          type="text"
          name="instructions"
          id="instructions-input"
          value={formData.instructions}
          onChange={handleChange}
          required
        ></textarea>
        <label htmlFor="ingredients-input">Ingredients:</label>
        <textarea
          type="text"
          name="ingredients"
          id="ingredients-input"
          value={formData.ingredients}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
};

export default RecipeForm;
