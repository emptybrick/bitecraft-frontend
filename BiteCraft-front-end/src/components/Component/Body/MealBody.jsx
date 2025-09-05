import { useState } from "react";
import QuickViewCard from "../QuickViewCard/QuickViewCard";
import ModalFooter from "../Footer/ModalFooter";
import ModalHeader from "../Header/ModalHeader";
import RecipeBody from "./RecipeBody";

const MealBody = ({ item }) => {
  const mealOptions = ["main", "side1", "side2"];
  const [activeModal, setActiveModal] = useState(null);

  const handleCloseQuickView = (e) => {
    e.preventDefault();
    setActiveModal(null);
  };

  const handleShowQuickView = (e) => {
    e.preventDefault();
    const modal = e.target.dataset.target;
    setActiveModal(modal);
  };

  console.log(item)

  return (
    <section className="modal-card-body pt-5 pb-5`">
      <h2 className="title is-4">Recipes</h2>
      <div className="columns is-multiline is-centered">
        {mealOptions.map((option, idx) => (
          <div className="column is-full" key={idx}>
            <div
              className={`modal ${
                activeModal === `modal-${idx}` ? "is-active" : ""
              }`}
              id={`modal-${idx}`}
            >
              <div
                className=""
                onClick={handleCloseQuickView}
              ></div>
              <div className="modal-card">
                <ModalHeader itemName={item[option].name} />
                <RecipeBody recipe={item[option]} isModal={true} />
                <ModalFooter
                  item={item[option]}
                  type={"Meal"}
                  collection={"MealCollection"}
                  closeQuickView={handleCloseQuickView}
                  setActiveModal={ setActiveModal }
                  mealBody={true}
                />
              </div>
            </div>
            <QuickViewCard
              item={item[option]}
              onClick={(e) => handleShowQuickView(e)}
              id={`modal-trigger-${idx}`}
              target={`modal-${idx}`}
              buttonText="Go to Recipe"
              link={ `/recipes/${ item[ option ]._id }` }
              MealBody={true}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MealBody;
