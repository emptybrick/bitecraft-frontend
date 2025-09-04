import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import Button from "../../Component/Button/Button";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";
import QuickViewCard from "../../Component/QuickViewCard/QuickViewCard";
import ModalFooter from "../../Component/Footer/ModalFooter";
import ModalHeader from "../../Component/Header/ModalHeader";
import Message from "../../Component/Message/Message";
import PageHeader from "../../Component/Header/PageHeader";

const MealCollection = () => {
  const { user } = useContext(UserContext);
  const [meals, setMeals] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const mealTypes = ["main", "side1", "side2"];

  useEffect(() => {
    setIsLoading(true);
    const fetchAllMeals = async () => {
      const mealsData = await biteCraftService.Index(
        "MealCollection",
        user._id
      );
      if (mealsData) {
        setMeals(mealsData);
      }
      setIsLoading(false);
    };
    if (user) fetchAllMeals();
  }, [user]);

  const handleShowQuickView = (e) => {
    e.preventDefault();
    const modal = e.target.dataset.target;
    setActiveModal(modal);
  };

  const handleCloseQuickView = (e) => {
    e.preventDefault();
    setActiveModal(null);
  };

  if (!user || isLoading) return <ProgressBar />;

  return (
    <div className="section">
      <PageHeader userName={user.username} headerText={"Meals Collection"} />
      <div className="container">
        {meals.length > 0 ? (
          <div className="columns is-multiline mt-2 has-text-centered is-vcentered">
            {meals.map((meal, idx) => (
              <div className="column is-one-third" key={idx}>
                <div
                  className={`modal ${
                    activeModal === `modal-${idx}` ? "is-active" : ""
                  }`}
                  id={`modal-${idx}`}
                >
                  <div
                    className="modal-background"
                    onClick={handleCloseQuickView}
                  ></div>
                  <div className="modal-card">
                    <ModalHeader itemName={meal.name} />
                    <section className="modal-card-body pb-2 pt-4">
                      <h3 className="subtitle is-4 has-text-weight-bold is-underlined">
                        Recipes
                      </h3>
                      <div className="container">
                        {meal.main && meal.side1 && meal.side2 ? (
                          mealTypes.map((type) => (
                            <div className="content" key={type}>
                              <QuickViewCard
                                item={meal[type]}
                                onClick={(e) => handleShowQuickView(e)}
                                id={`modal-trigger-${idx}`}
                                target={`modal-${idx}`}
                                buttonText="Go to Recipe"
                                link={`/recipes/${meal[type]._id}`}
                              />
                            </div>
                          ))
                        ) : (
                          <>
                            <Button
                              className="button has-background-link-70"
                              buttonText="Go to Meal"
                            />
                          </>
                        )}
                      </div>
                    </section>
                    <ModalFooter
                      item={meal}
                      type={"Meal"}
                      collection={"MealCollection"}
                      closeQuickView={handleCloseQuickView}
                      setActiveModal={setActiveModal}
                      items={meals}
                      setItems={setMeals}
                    />
                  </div>
                </div>
                <QuickViewCard
                  item={meal}
                  onClick={(e) => handleShowQuickView(e)}
                  id={`modal-trigger-${idx}`}
                  target={`modal-${idx}`}
                  buttonText="Go to Meal"
                  link={`/meals/${meal._id}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <Message itemName={"Meal"} />
        )}
      </div>
    </div>
  );
};

export default MealCollection;
