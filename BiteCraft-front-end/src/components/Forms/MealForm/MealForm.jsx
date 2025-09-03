import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import Button from "../../Component/Button/Button";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";
import Select from "react-select";
import Message from "../../Component/Message/Message";
import PageHeader from "../../Component/Header/PageHeader";

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
      if (initialData) {
        setFormData(initialData);
      }
      setIsLoading(false);
    };
    if (user) fetchAllRecipes();
  }, [user]);

  const handleNavigation = () => {
    navigate(`/${user._id}/meals-collection`);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSelect = (event, option) => {
    setFormData({ ...formData, [option]: event.value });
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

  if (isLoading) return <ProgressBar />;

  return (
    <div className="section">
      <div className="container">
        <PageHeader headerText={"Meal Form"} />
        {mainRecipes.length < 1 || sideRecipes.length < 1 ? (
          <Message itemName={"Recipe"} itemType={"createMeal"} />
        ) : (
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
                <Select
                  className="is-fullwidth"
                  isClearable
                  onChange={(e) => handleSelect(e, "main")}
                  name="main"
                  id="main-input"
                  options={mainRecipes.map((recipe) => ({
                    label: recipe.name,
                    value: recipe._id,
                  }))}
                  defaultValue={
                    formData.main
                      ? {
                          value: formData.main._id,
                          label: formData.main.name,
                        }
                      : null
                  }
                  placeholder="Select a Recipe"
                  required
                  classNamePrefix="react-select"
                />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="side1-input">
                Side Dish 1
              </label>
              <div className="control">
                <Select
                  className="is-fullwidth"
                  isClearable
                  onChange={(e) => handleSelect(e, "side1")}
                  name="side1"
                  id="side1-input"
                  options={sideRecipes.map((recipe) => ({
                    label: recipe.name,
                    value: recipe._id,
                  }))}
                  defaultValue={
                    formData.side1
                      ? {
                          value: formData.side1._id,
                          label: formData.side1.name,
                        }
                      : null
                  }
                  placeholder="Select a Recipe"
                  required
                  classNamePrefix="react-select"
                />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="side2-input">
                Side Dish 2
              </label>
              <div className="control">
                <Select
                  className="is-fullwidth"
                  isClearable
                  onChange={(e) => handleSelect(e, "side2")}
                  name="side2"
                  id="side2-input"
                  options={sideRecipes.map((recipe) => ({
                    label: recipe.name,
                    value: recipe._id,
                  }))}
                  defaultValue={
                    formData.side2
                      ? {
                          value: formData.side2._id,
                          label: formData.side2.name,
                        }
                      : null
                  }
                  placeholder="Select a Recipe"
                  required
                  classNamePrefix="react-select"
                />
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
        )}
      </div>
    </div>
  );
};

export default MealForm;
