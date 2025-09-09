import { useState } from "react";
import QuickViewCard from "../../Component/QuickViewCard/QuickViewCard";
import RecipeBody from "../../Component/Body/RecipeBody";
import MealBody from "../../Component/Body/MealBody";
import ModalFooter from "../../Component/Footer/ModalFooter";
import ModalHeader from "../../Component/Header/ModalHeader";

const Card = ({ items, type, setItems, itemCollection }) => {
  const collectionType = `${type}Collection`;
  const linkType = `${type.toLowerCase()}s`;
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

  return (
    <div className="columns is-multiline has-text-centered is-vcentered">
      {items.map((item, idx) => (
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
              <ModalHeader itemName={item.name} />
              {type === "Recipe" ? (
                <RecipeBody item={item} isModal={true} />
              ) : (
                <MealBody
                  item={item}
                />
              )}
              <ModalFooter
                item={item}
                type={type}
                collection={ collectionType }
                itemCollection={itemCollection}
                closeQuickView={handleCloseQuickView}
                setActiveModal={setActiveModal}
                items={items}
                setItems={setItems}
              />
            </div>
          </div>
          <QuickViewCard
            item={item}
            onClick={(e) => handleShowQuickView(e)}
            id={`modal-trigger-${idx}`}
            target={`modal-${idx}`}
            buttonText={`Go to ${type}`}
            link={`/${linkType}/${item._id}`}
          />
        </div>
      ))}
    </div>
  );
};

export default Card;
