import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import Button from "../../Component/Button/Button";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";
import Select from "react-select";
import RecipeModalBody from "../../Component/Body/RecipeBody";
import Message from "../../Component/Message/Message";
import PageHeader from "../../Component/Header/PageHeader";

const MealPlan = () => {
  const { user } = useContext(UserContext);
  const [meals, setMeals] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [visibleForm, setVisibleForm] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({
    week1: [{}, {}, {}, {}, {}, {}, {}],
    week2: [{}, {}, {}, {}, {}, {}, {}],
    week3: [{}, {}, {}, {}, {}, {}, {}],
    week4: [{}, {}, {}, {}, {}, {}, {}],
  });

  const mealOptions = ["main", "side1", "side2"];
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
      const getMealPlan = await biteCraftService.Index("MealPlan", user._id);
      if (getMealPlan) {
        setMealPlan(getMealPlan);
      }

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
    setVisibleForm(!visibleForm);
  };

  const handleSubmit = async () => {
    setMealPlan(formData);
    if (!mealPlan) return;
    try {
      await biteCraftService.Create("MealPlan", mealPlan, user._id);
      navigate(`/${user._id}/planner`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAutoGenerate = async () => {
    try {
      const newMealPlan = await biteCraftService.Create(
        "MealPlan",
        meals,
        user._id
      );
      setMealPlan(newMealPlan);
      navigate(`/${user._id}/planner`);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMealPlan = async () => {
    try {
      await biteCraftService.Delete("MealPlan", user._id);
      setMealPlan(null);
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

  const handlePrint = () => {
    window.print();
  };

  if (!user || isLoading) return <ProgressBar />;
  return (
    <div className="section">
      <PageHeader userName={user.username} headerText={"Meal Planner"} />
      <div className="container">
        {visibleForm ? (
          <form action={handleSubmit}>
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
                          className="react-select is-fullwidth"
                          onChange={(e) => handleSelect(e, week, idx)}
                          name={`${week}-${day}`}
                          id={`${week}-${day}-input`}
                          options={meals.map((meal) => ({
                            label: meal.name,
                            value: meal,
                          }))}
                          placeholder={`${day}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="field is-grouped mt-4 is-grouped-centered">
              <div className="control">
                <Button type="submit" buttonText="Create" />
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
        ) : (
          <>
            {!mealPlan && meals ? (
              <div className="container">
                <div className="columns">
                  <div className="column">
                    <div className="buttons is-centered">
                      <Button
                        buttonText="Auto-Generate"
                        onClick={handleAutoGenerate}
                      />
                    </div>
                    <article className="message">
                      <div className="message-header has-text-grey-darker has-background-success-90">
                        <p>Auto Generate</p>
                      </div>
                      <div className="message-body has-background-white box">
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
                        buttonText="Manual Select"
                        onClick={handleToggleForm}
                      />
                    </div>
                    <article className="message">
                      <div className="message-header has-text-grey-darker has-background-warning-90">
                        <p>Manual Input</p>
                      </div>
                      <div className="message-body has-background-white box">
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
              <>
                {!mealPlan ? (
                  <Message itemName={"Meal"} />
                ) : (
                  <>
                    <div className="container">
                      <div className="columns is-centered">
                        {weeks.map((week, index) => (
                          <div className="column" key={index}>
                            <div className="box">
                              <>
                                <h1 className="title is-5 mb-2 has-text-centered has-text-weight-bold is-underlined">
                                  Week {index + 1}
                                </h1>
                                {weekDays.map((day, idx) => (
                                  <div className="container" key={day}>
                                    <div className="content">
                                      <div
                                        className={`modal ${
                                          activeModal ===
                                          `modal-${idx}-${day}-${week}`
                                            ? "is-active"
                                            : ""
                                        }`}
                                        id={`modal-${idx}-${day}-${week}`}
                                      >
                                        <div
                                          className="modal-background"
                                          onClick={handleCloseQuickView}
                                        ></div>
                                        <div className="modal-card">
                                          <header className="modal-card-head has-background-primary">
                                            <h2 className="mb-0 has-text-weight-extrabold modal-card-title has-text-white has-text-centered">
                                              {mealPlan[week].meals[idx].name}
                                            </h2>
                                            <button
                                              className="delete"
                                              aria-label="close"
                                              onClick={handleCloseQuickView}
                                            ></button>
                                          </header>
                                          <section className="modal-card-body">
                                            {mealOptions.map((option, idx) => (
                                              <div className="pb-6" key-idx>
                                                <RecipeModalBody
                                                  item={
                                                    mealPlan[week].meals[idx][
                                                      option
                                                    ]
                                                  }
                                                  type="Planner"
                                                />
                                              </div>
                                            ))}
                                          </section>
                                          <footer className="modal-card-foot pt-4 is-flex-direction-column">
                                            <div className="buttons">
                                              <Button
                                                onClick={handlePrint}
                                                buttonText="Print"
                                              />
                                              <Button
                                                onClick={handleCloseQuickView}
                                                buttonText="Close"
                                              />
                                            </div>
                                          </footer>
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      className="button modal-trigger mb-2 is-fullwidth has-background-success-80"
                                      id={`model-trigger-${idx}-${day}-${week}`}
                                      data-target={`modal-${idx}-${day}-${week}`}
                                      onClick={(e) => handleShowQuickView(e)}
                                    >
                                      {`${day}: ${mealPlan[week].meals[idx].name}`}
                                    </button>
                                  </div>
                                ))}
                                <div className="container">
                                  <div className="content">
                                    <div
                                      className={`modal ${
                                        activeModal === `modal-${index}-${week}`
                                          ? "is-active"
                                          : ""
                                      }`}
                                      id={`modal-${index}-${week}`}
                                    >
                                      <div
                                        className="modal-background"
                                        onClick={handleCloseQuickView}
                                      ></div>
                                      <div className="modal-card">
                                        <header className="modal-card-head has-background-primary">
                                          <h2 className="mb-0 has-text-weight-extrabold modal-card-title has-text-white has-text-centered">
                                            {`Week ${index + 1} Grocery List`}
                                          </h2>
                                        </header>
                                        <section className="modal-card-body">
                                          <div className="box">
                                            <div className="subtitle is-5 has-text-centered is-underlined">
                                              Shopping List
                                            </div>
                                            <ul>
                                              {mealPlan[week].list.map(
                                                (item, idx) => (
                                                  <li key={idx}>{item}</li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        </section>
                                        <footer className="modal-card-foot pt-4 is-flex-direction-column">
                                          <div className="buttons">
                                            <Button
                                              onClick={handleCloseQuickView}
                                              buttonText="Close"
                                            />
                                            <Button
                                              onClick={handlePrint}
                                              buttonText="Print"
                                            />
                                          </div>
                                        </footer>
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    className="button modal-trigger is-fullwidth has-background-primary-85"
                                    id={`model-trigger-${index}-${week}`}
                                    data-target={`modal-${index}-${week}`}
                                    onClick={(e) => handleShowQuickView(e)}
                                  >
                                    View Grocery List
                                  </button>
                                </div>
                              </>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="buttons is-centered">
                        <Button
                          onClick={deleteMealPlan}
                          buttonText="Delete Meal Plan"
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MealPlan;
