const Button = ({
  onClick,
  buttonText = "Submit",
  type = "button",
  className = "",
  target,
  id,
  disabled,
}) => {
  const addButtons = [
    "Submit",
    "Save",
    "Create",
    "Sign In",
    "Go to Recipe",
    "Go to Meal",
    "Create New Recipe",
    "Create New Meal",
    "Auto-Generate",
    "Add to Collection",
  ];
  const editButtons = [
    "Edit",
    "Close",
    "View All Recipes",
    "View All Meals",
    "Manual Select",
  ];
  const deleteButtons = [
    "Delete",
    "Remove",
    "Cancel",
    "Remove from Collection",
    "Delete Meal Plan"
  ];
  const infoButtons = ["Add Ingredient", "Add New Comment", "Add Step"];

  if (addButtons.includes(buttonText)) {
    return (
      <button
        className="button has-background-success"
        onClick={onClick}
        type={type}
      >
        {buttonText}
      </button>
    );
  } else if (deleteButtons.includes(buttonText)) {
    return (
      <button
        className="button has-background-danger"
        onClick={onClick}
        type={type}
      >
        {buttonText}
      </button>
    );
  } else if (infoButtons.includes(buttonText)) {
    return (
      <button
        className="button has-background-info"
        onClick={onClick}
        type={type}
      >
        {buttonText}
      </button>
    );
  } else if (editButtons.includes(buttonText)) {
    return (
      <button
        className="button has-background-warning"
        onClick={onClick}
        type={type}
      >
        {buttonText}
      </button>
    );
  } else if (buttonText === "Print") {
    return (
      <button
        className="button has-background-link"
        onClick={onClick}
        type={type}
      >
        {buttonText}
      </button>
    );
  } else if (buttonText === "Quick View" || buttonText === "Reply") {
    return (
      <button
        className="button is-info"
        onClick={onClick}
        data-target={target}
        id={id}
      >
        {buttonText}
      </button>
    );
  } else if (buttonText === "Sign Up") {
    return (
      <button className="button is-success" disabled={disabled} type={type}>
        {buttonText}
      </button>
    );
  } else {
    return (
      <button className={className} onClick={onClick} type={type}>
        {buttonText}
      </button>
    );
  }
};

export default Button;
