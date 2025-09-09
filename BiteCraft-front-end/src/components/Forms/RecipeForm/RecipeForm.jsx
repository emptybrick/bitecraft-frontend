import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import Button from "../../Component/Button/Button";
import CreatableSelect from "react-select/creatable";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";
import PageHeader from "../../Component/Header/PageHeader";
import Select from "react-select";

const RecipeForm = ({
  onCancel = null,
  initialData = null,
  buttonText = "Submit",
  handleUpdateRecipe,
}) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [ ingredientsData, setIngredientsData ] = useState([]);
  const [toggle, setToggle] = useState(false)
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
  const categories = [
    { label: "Main Dish", value: "Main" },
    { label: "Side Dish", value: "Side" },
  ];
  const units = [
    { label: "n/a", value: "null" },
    { label: "tsp", value: "teaspoon" },
    { label: "tbsp", value: "tablespoon" },
    { label: "cup", value: "cup" },
    { label: "pint", value: "pint" },
    { label: "quart", value: "quart" },
    { label: "oz", value: "oz" },
    { label: "lb", value: "lb" },
    { label: "g", value: "g" },
    { label: "L", value: "L" },
  ];
  const fractions = [
    { value: "null", label: "n/a" },
    { value: "1/8", label: "1/8" },
    { value: "1/4", label: "1/4" },
    { value: "3/8", label: "3/8" },
    { value: "1/2", label: "1/2" },
    { value: "5/8", label: "5/8" },
    { value: "3/4", label: "3/4" },
    { value: "7/8", label: "7/8" },
  ];

  useEffect(() => {
    const getData = async () => {
      const getIngredients = await biteCraftService.Index("Ingredient");
      setIngredientsData(getIngredients);
    };
    if (user) getData();
  }, [user, toggle]);

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
        if (type === "quantity") {
          updatedItem[index] = {
            ...updatedItem[index],
            [type]: event.target.value,
          };
        } else {
          updatedItem[index] = {
            ...updatedItem[index],
            [type]: event.value,
          };
        }
        setFormData({ ...formData, ingredients: updatedItem });
      }
    } else {
      if (!event.target) {
        setFormData({ ...formData, category: event.value });
      } else {
        setFormData({ ...formData, [event.target.name]: event.target.value });
      }
    }
  };

  const handleInput = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z_ -]/g, "");
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
        navigate(`/${user._id}/recipes-collection`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCreateIngredient = async (e, idx) => {
    const event = {label: e, value: e}
      try {
        await biteCraftService.Create("Ingredient", e);
        setIngredientsData([...ingredientsData, event])
        handleChange(event, idx, "name")
        setToggle(!toggle)
      } catch (error) {
        console.log(error);
      }
  };

  if (!ingredientsData) return <ProgressBar />;

  return (
    <div className="section">
      <div className="container">
        <PageHeader headerText={"Recipe Form"} />
        <form onSubmit={handleSubmit} className="box">
          <div className="field">
            <label htmlFor="category-input" className="label">
              Category:
            </label>
            <div className="control">
              <Select
                className="react-select"
                onChange={handleChange}
                name="category"
                id="category-input"
                options={categories.map((cat) => ({
                  label: cat.label,
                  value: cat.value,
                }))}
                defaultValue={
                  formData.category
                    ? {
                        value: formData.category,
                        label: formData.category,
                      }
                    : null
                }
                placeholder="Select a Category"
                required
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="name-input" className="label">
              Name:
            </label>
            <div className="control">
              <input
                required
                type="text"
                name="name"
                id="name-input"
                value={formData.name}
                onChange={handleChange}
                onInput={handleInput}
                className="input input-select"
                placeholder="Recipe name"
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="details-input" className="label">
              Details:
            </label>
            <div className="control">
              <textarea
                type="text"
                name="details"
                id="details-input"
                value={formData.details}
                onChange={handleChange}
                required
                placeholder="Describe your recipe"
                className="textarea"
              ></textarea>
            </div>
          </div>
          <div className="field">
            <h3 className="title is-5 has-text-centered is-underlined pt-4">
              Ingredients
            </h3>
            <div className="columns has-text-weight-semibold mb-2 has-text-centered is-vcentered">
              <div className="column is-narrow pl-5 pr-6 ml-4 mr-6">Unit</div>
              <div className="column is-narrow pl-6">Amount/Fraction</div>
              <div className="column">Name</div>
              <div className="column is-narrow"></div>
            </div>
            {formData.ingredients.map((ingredient, index) => (
              <div className="columns mb-2" key={index}>
                <div className="column is-narrow">
                  <Select
                    className="react-select"
                    onChange={(e) => handleChange(e, index, "unit")}
                    name={`unit-${index}`}
                    id={`unit-input-${index}`}
                    options={units.map((unit) => ({
                      label: unit.label,
                      value: unit.value,
                    }))}
                    defaultValue={
                      ingredient.unit
                        ? {
                            value: ingredient.unit,
                            label: ingredient.unit,
                          }
                        : null
                    }
                    placeholder="n/a"
                    required
                  />
                </div>
                <div className="column is-flex is-narrow">
                  <input
                    className="input input-select"
                    type="number"
                    required
                    name={`quantity-${index}`}
                    id={`quantity-input-${index}`}
                    value={ingredient.quantity}
                    onChange={(e) => handleChange(e, index, "quantity")}
                    step={1}
                    min={1}
                    placeholder="1"
                    onInput={handleInputQuantity}
                  />
                </div>
                <div className="column is-flex is-narrow">
                  <Select
                    className="react-select"
                    onChange={(e) => handleChange(e, index, "fraction")}
                    name={`fraction-${index}`}
                    id={`fraction-input-${index}`}
                    options={fractions.map((fraction) => ({
                      label: fraction.label,
                      value: fraction.value,
                    }))}
                    defaultValue={
                      ingredient.fraction
                        ? {
                            value: ingredient.fraction,
                            label: fractions.find(
                              (i) => i.value === ingredient.fraction
                            ),
                          }
                        : null
                    }
                    placeholder="n/a"
                    required
                  />
                </div>
                <div className="column">
                  <CreatableSelect
                    onChange={(e) => handleChange(e, index, "name")}
                    onCreateOption={(e) => handleCreateIngredient(e, index)}
                    name={`ingredients-${index}`}
                    id={`ingredients-input-${index}`}
                    options={ingredientsData.map((ing) => ({
                      label: ing.name,
                      value: ing.name,
                    }))}
                    value={
                      ingredient.name
                        ? { value: ingredient.name, label: ingredient.name }
                        : null
                    }
                    placeholder={"e.g. Flour, Sugar, Eggs"}
                    required
                    className="react-select"
                  />
                </div>
                <div className="column is-narrow">
                  {formData.ingredients.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      buttonText="Remove"
                    />
                  )}
                </div>
              </div>
            ))}
            <div className="mt-2">
              <Button
                type="button"
                onClick={() => addIngredient()}
                buttonText="Add Ingredient"
              />
            </div>
          </div>
          <div className="field mt-5"></div>
          <label htmlFor="instructions-input" className="label">
            <h3 className="title is-5 is-underlined has-text-centered">
              Instructions:
            </h3>
          </label>
          {formData.instructions.map((instruction, index) => (
            <div className="field is-grouped mb-2 mt-4" key={index}>
              <div className="control is-expanded">
                <textarea
                  type="text"
                  name={`instructions-${index}`}
                  id={`instructions-input-${index}`}
                  value={instruction}
                  onChange={(e) => handleChange(e, index, "instruction")}
                  placeholder={`Step ${index + 1}:`}
                  required
                  className="textarea"
                ></textarea>
              </div>
              <div className="control is-flex is-flex-direction-column is-justify-content-center">
                {formData.instructions.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    buttonText="Remove"
                  />
                )}
              </div>
            </div>
          ))}
          <div className="mt-4">
            <Button
              type="button"
              onClick={() => addInstruction()}
              buttonText="Add Step"
            />
          </div>
          <div className="field is-grouped mt-4 is-grouped-right">
            <div className="control">
              <Button type="submit" buttonText={buttonText} />
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
    </div>
  );
};

export default RecipeForm;
