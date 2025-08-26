import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";

const RecipeForm = ({
  onCancel = null,
  initialData = null,
  buttonText = "Submit",
  handleUpdateRecipe,
}) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState(
    initialData
      ? initialData
      : {
          name: "",
          details: "",
          instructions: [""],
          ingredients: ["", "", ""],
          category: "Main",
        }
  );

  const handleNavigation = () => {
    navigate(`/${user._id}/recipes-collection`);
  };

  const handleChange = (event, index, type) => {
    if (type) {
      let newItem;
      if (type === "instruction") {
        newItem = [...formData.instructions];
        newItem[index] = event.target.value;
        setFormData({ ...formData, instructions: newItem });
      } else {
        newItem = [...formData.ingredients];
        newItem[index] = event.target.value;
        setFormData({ ...formData, ingredients: newItem });
      }
    } else {
      setFormData({ ...formData, [event.target.name]: event.target.value });
    }
  };

  const addInstruction = () => {
    setFormData({ ...formData, instructions: [...formData.instructions, ""] });
  };

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ""] });
  };

  const removeInstruction = (index) => {
    const filteredInstructions = formData.instructions.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, instructions: filteredInstructions });
  };

  const removeIngredient = (index) => {
    const filteredIngredients = formData.ingredients.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, ingredients: filteredIngredients });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (initialData && buttonText === "Save") {
      handleUpdateRecipe(formData);
    } else {
      try {
        await biteCraftService.Create("Recipe", formData);
        // navigate('/recipes')
        navigate(`/${user._id}/recipes-collection`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
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
      </div>
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
        <label htmlFor="instructions-input">Instructions:</label>
        {formData.instructions.map((instruction, index) => (
          <div key={index}>
            <textarea
              type="text"
              name={`instructions-${index}`}
              id={`instructions-input-${index}`}
              value={instruction}
              onChange={(e) => handleChange(e, index, "instruction")}
              placeholder={`Instruction ${index + 1}`}
              required
            ></textarea>
            {formData.instructions.length > 1 && (
              <button type="button" onClick={() => removeInstruction(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addInstruction}>
          Add Step
        </button>
      </div>
      <div>
        <label htmlFor="ingredients-input">Ingredients:</label>
        {formData.ingredients.map((ingredient, index) => (
          <div key={index}>
            <input
              type="text"
              name={`ingredients-${index}`}
              id={`ingredients-input-${index}`}
              value={ingredient}
              onChange={(e) => handleChange(e, index, "ingredient")}
              placeholder={"e.g. 1 cup flour"}
              required
            ></input>
            {formData.ingredients.length > 1 && (
              <button type="button" onClick={() => removeIngredient(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addIngredient}>
          Add Ingredient
        </button>
      </div>
      <button type="submit">{buttonText}</button>
      <button
        type="button"
        onClick={onCancel ? onCancel : () => handleNavigation()}
      >
        Cancel
      </button>
    </form>
  );
};

export default RecipeForm;
