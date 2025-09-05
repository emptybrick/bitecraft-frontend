import { useNavigate } from "react-router";
import Button from "../Button/Button";

const Message = ({ itemName, itemType }) => {
  const navigate = useNavigate();

  const handleNavigation = (type) => {
    const lowerCaseItem = itemName.toLowerCase();
    if (type === "Create") {
      navigate(`/${lowerCaseItem}s/new`);
    }
    if (type === "View") {
      navigate(`/${lowerCaseItem}s`);
    }
  };

  return (
    <div className="content">
      <article className="message is-medium">
        <div className="message-header has-background-info-30">
          <span className="icon-text">
            <span className="icon">
              <i className="fas fa-exclamation-triangle"></i>
            </span>
            {itemType === "createMeal" ? (
              <span className="has-text-light is-size-4">
                Not enough Recipes found!
              </span>
            ) : (
              <span className="has-text-light is-size-4">{`There are no ${itemName}s in your collection!`}</span>
            )}
          </span>
        </div>
        <div className="message-body has-text-centered pt-6">
          {itemType === "createMeal" && (
            <p className="text is-size-5">
              You need at least <strong>1 Main</strong> and{" "}
              <strong>1 Side</strong> Recipe in your collection to create a
              Meal.
            </p>
          )}
          <p className="text is-size-5">
            <span role="img" aria-label="chef">
              👨‍🍳
            </span>{" "}
            {`Add ${itemName}s from other users or create your own to get started!`}
          </p>
          <div className="buttons pt-4 pb-4 is-centered are-medium is-gap-6">
            <Button
              onClick={() => handleNavigation("Create")}
              buttonText={`Create New ${itemName}`}
            />
            <Button
              onClick={() => handleNavigation("View")}
              buttonText={`View All ${itemName}s`}
            />
          </div>
        </div>
      </article>
    </div>
  );
};

export default Message;
