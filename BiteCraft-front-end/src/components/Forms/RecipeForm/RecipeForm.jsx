import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import Button from "../../Component/Button/Button";

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
          ingredients: [
            {
              name: "",
              unit: "",
              quantity: "",
            },
            {
              name: "",
              unit: "",
              quantity: "",
            },
            {
              name: "",
              unit: "",
              quantity: "",
            },
          ],
          category: "Main",
        }
  );

  const handleNavigation = () => {
    navigate(`/${user._id}/recipes-collection`);
  };

  const handleChange = (event, index, type) => {
    if (type) {
      let updatedItem;
      if (type === "instruction") {
        updatedItem = [...formData.instructions];
        updatedItem[index] = event.target.value;
        setFormData({ ...formData, instructions: updatedItem });
      } else {
        updatedItem = [...formData.ingredients];
        if (type === "Name") {
          updatedItem[index] = {
            ...updatedItem[index],
            name: event.target.value,
          };
        } else if (type === "Quantity") {
          updatedItem[index] = {
            ...updatedItem[index],
            quantity: event.target.value,
          };
        } else {
          updatedItem[index] = {
            ...updatedItem[index],
            unit: event.target.value,
          };
        }
        setFormData({ ...formData, ingredients: updatedItem });
      }
    } else {
      setFormData({ ...formData, [event.target.name]: event.target.value });
    }
  };

  const handleInput = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z]/g, "");
  };

  const handleInputQuantity = (e) => {
    e.target.value = e.target.value.replace(/[^1-9][0-9]*/g, "");
  };

  const addInstruction = () => {
    setFormData({ ...formData, instructions: [...formData.instructions, ""] });
  };

  const addIngredient = () => {
    const newRow = {
      name: "",
      unit: "",
      quantity: "",
    };
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, newRow],
    });
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
          onInput={handleInput}
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
        <h3>Ingredients</h3>
        <div className="ingredient-table-categories">
          <h4>Unit</h4>
          <h4>Amount</h4>
          <h4>Name</h4>
        </div>
        <label htmlFor="ingredients-input"></label>
        {formData.ingredients.map((ingredient, index) => (
          <div key={index}>
            <select
              required
              name={`unit-${index}`}
              id={`unit-input-${index}`}
              value={ingredient.unit}
              onChange={(e) => handleChange(e, index, "Unit")}
            >
              <option value="Tablespoon">Tablespoon</option>
              <option value="Teaspoon">Teaspoon</option>
            </select>
            <input
              className="number-input"
              type="number"
              required
              name={`quantity-${index}`}
              id={`quantity-input-${index}`}
              value={ingredient.quantity}
              onChange={(e) => handleChange(e, index, "Quantity")}
              step={1}
              min={1}
              placeholder="1"
              onInput={handleInputQuantity}
            />
            <input
              type="text"
              name={`ingredients-${index}`}
              id={`ingredients-input-${index}`}
              value={ingredient.name}
              onChange={(e) => handleChange(e, index, "Name")}
              placeholder={"e.g. Flour, Sugar, Eggs"}
              required
              onInput={handleInput}
            ></input>
            {formData.ingredients.length > 1 && (
              <Button
                type="button"
                onClick={() => removeIngredient(index)}
                buttonText="Remove"
              />
            )}
          </div>
        ))}
        <Button
          type="button"
          onClick={() => addIngredient()}
          buttonText="Add Ingredient"
        />
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
              placeholder={`Step ${index + 1}:`}
              required
            ></textarea>
            {formData.instructions.length > 1 && (
              <Button
                type="button"
                onClick={() => removeInstruction(index)}
                buttonText="Remove"
              />
            )}
          </div>
        ))}
        <Button
          type="button"
          onClick={() => addInstruction()}
          buttonText="Add Step"
        />
      </div>
      <Button type="submit" buttonText={buttonText} />
      <Button
        type="button"
        onClick={onCancel ? onCancel : () => handleNavigation()}
        buttonText="Cancel"
      />
    </form>
  );
};

export default RecipeForm;
