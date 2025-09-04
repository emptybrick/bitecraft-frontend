import { useState } from "react";
import QuickViewCard from "../../Component/QuickViewCard/QuickViewCard";
import RecipeBody from "../../Component/Body/RecipeBody";
import MealBody from "../../Component/Body/MealBody";
import ModalFooter from "../../Component/Footer/ModalFooter";
import ModalHeader from "../../Component/Header/ModalHeader";

const Card = ({ items, itemType, isModal, setItems }) => {
  const collection = `${itemType}Collection`;
  const linkType = `${itemType.toLowerCase()}s`;
    const [ activeModal, setActiveModal ] = useState(null);

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
              {itemType === "Recipe" ? (
                <RecipeBody recipe={item} isModal={isModal} />
              ) : (
                <MealBody meal={item} isModal={isModal} />
              )}
              <ModalFooter
                item={item}
                type={itemType}
                collection={collection}
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
            buttonText={`Go to ${itemType}`}
            link={`/${linkType}/${item._id}`}
          />
        </div>
      ))}
    </div>
  );
};

export default Card;
