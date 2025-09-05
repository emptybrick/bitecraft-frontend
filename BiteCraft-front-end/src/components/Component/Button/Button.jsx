const Button = ({
  onClick,
  buttonText = "Submit",
  type = "button",
  className = "",
}) => {
  const addButtons = [
    "Add Ingredient",
    "Add",
    "Add to Collection",
    "Create New Recipe",
    "Create New Meal",
    "Submit",
    "Save",
    "Sign In",
  ];
  const editButtons = ["Edit", "Close"];
  const deleteButtons = [
    "Delete",
    "Remove",
    "Cancel",
    "Remove from Collection",
  ];
  if (addButtons.includes(buttonText) && !className) {
    return (
      <button
        className="button has-background-success-55"
        onClick={onClick}
        type={type}
      >
        {buttonText}
      </button>
    );
  } else if (deleteButtons.includes(buttonText) && !className) {
    return (
      <button
        className="button has-background-danger-80"
        onClick={onClick}
        type={type}
      >
        {buttonText}
      </button>
    );
  } else if (editButtons.includes(buttonText) && !className) {
    return (
      <button
        className="button has-background-warning-80"
        onClick={onClick}
        type={type}
      >
        {buttonText}
      </button>
    );
  } else if (buttonText === "Print") {
    return (
      <button
        className="button has-background-primary-90"
        onClick={onClick}
        type={type}
      >
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

// need to figure out CSS stuff
// button text options
//   Reply, "Comment",

export default Button;
