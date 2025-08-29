import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import * as biteCraftService from "../../services/BiteCraftService";
import { UserContext } from "../../contexts/UserContext";
import Button from "../Component/Button/Button";
import ProgressBar from "../Component/ProgressBar/ProgressBar";
import Select from "react-select";

const MealPlan = () => {
  const { user } = useContext(UserContext);
  const [meals, setMeals] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [visibleForm, setVisibleForm] = useState(null);
  const [formData, setFormData] = useState({
    week1: ["", "", "", "", "", "", ""],
    week2: ["", "", "", "", "", "", ""],
    week3: ["", "", "", "", "", "", ""],
    week4: ["", "", "", "", "", "", ""],
  });

  const weeks = ["week1", "week2", "week3", "week4"];

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    setIsLoading(true);
      const fetchdata = async () => {
        // first attempt to find mealplan, if none then populate meals
      const mealsData = await biteCraftService.Index(
        "MealCollection",
        user._id
      );
      if (mealsData.length >= 1) {
        setMeals(mealsData);
      }
      setIsLoading(false);
    };
    if (user) fetchdata();
  }, [user]);

  const handleSelect = (event, week, idx) => {
    let updatedItem = [...formData[week]];
    updatedItem[idx] = event.value;
    setFormData({ ...formData, [week]: updatedItem });
  };

    const handleToggleForm = () => {
      console.log(meals)
    setVisibleForm(!visibleForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
      setMealPlan(formData);
      // send mealplan data to backend
    // if (!mealPlan) return;
    // try {
    //   await biteCraftService.Create("Meal", mealPlan);
    //   navigate(`/${user._id}/planner`);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const handleNavigation = () => {
    navigate(`/${user._id}/recipes-collection`);
  };

  const handleAutoGenerate = () => {};

  if (!user || isLoading) return <ProgressBar />;

  return (
    <main>
      <div className="section">
        {visibleForm ? (
          <div className="container">
            <h2 className="title is-4 pt-5 has-text-centered">
              Meal Plan Form
            </h2>
            <form action={handleSubmit} className="box">
              <div className="columns">
                {weeks.map((week, idx) => (
                  <div className="column" key={idx}>
                    <div className="box">
                      <label
                        htmlFor="meal-input"
                        className="label has-text-centered"
                      >
                        {`Week ${idx + 1}`}
                      </label>
                      {weekDays.map((day, idx) => (
                        <div className="field" key={idx}>
                          <label htmlFor={`${week}-${day}-input`} />
                          <Select
                            className="is-fullwidth"
                            isClearable
                            onChange={(e) => handleSelect(e, week, idx)}
                            name={`${week}-${day}`}
                            id={`${week}-${day}-input`}
                            options={meals.map((meal) => ({
                              label: meal.name,
                              value: meal._id,
                            }))}
                            placeholder={`${day}`}
                            required
                            classNamePrefix="react-select"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="field is-grouped mt-4 is-grouped-centered">
                <div className="control">
                  <Button
                    type="submit"
                    className="button has-background-primary-65"
                    buttonText="Create"
                  />
                </div>
                <div className="control">
                  <Button
                    type="button"
                    onClick={handleToggleForm}
                    buttonText="Cancel"
                  />
                </div>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="hero">
              <h1 className="title has-text-centered mb-6">Meal Planner</h1>
            </div>
            {!mealPlan && meals ?  (
              <div className="container">
                <div className="columns">
                  <div className="column">
                    <div className="buttons is-centered">
                      <Button
                        className="button  has-background-link-80"
                        buttonText="Auto-Generate"
                        onClick={handleAutoGenerate}
                      />
                    </div>
                    <article className="message">
                      <div className="message-header has-text-grey-darker has-background-link-80">
                        <p>Auto Generate</p>
                      </div>
                      <div className="message-body">
                        <div className="content">
                          <ul>
                            <li>
                              Selecting Auto-Generate will create a meal plan
                              using meals that are in your collection.
                            </li>
                            <li>
                              If your collection has less than 28 meals total,
                              it will repeat some to create a full plan of 28
                              days of meals.
                            </li>
                            <li>
                              If theres more than 28, it will choose 28 randomly
                              and assign them.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </article>
                  </div>
                  <div className="column">
                    <div className="buttons is-centered">
                      <Button
                        className="button has-background-success-80"
                        buttonText="Manual Select"
                        onClick={handleToggleForm}
                      />
                    </div>
                    <article className="message">
                      <div className="message-header has-text-grey-darker has-background-success-80">
                        <p>Manual Input</p>
                      </div>
                      <div className="message-body">
                        <div className="content">
                          <ul>
                            <li>
                              Selecting Manual Select will prompt you to create
                              a meal plan using meals that are in your
                              collection
                            </li>
                            <li>
                              a form will show that will allow to select the
                              meals you would like to set and in what order.
                            </li>
                            <li>
                              Use the dropdowns on each line to input 28 days
                              worth of meals.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            ) : (
              <div className="notification is-warning is-light has-text-centered">
                <p className="is-size-4">There are no meals in your collection!</p>
                <p className="is-size-5 mt-2">
                  <span role="img" aria-label="chef">
                    👨‍🍳
                  </span>{" "}
                  Add meals from other users or create your own to get started!
                </p>
                <button
                  className="button is-link is-light mt-4 is-medium"
                  onClick={handleNavigation}
                >
                  View All Meals
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default MealPlan;
