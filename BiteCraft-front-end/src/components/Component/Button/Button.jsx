const Button = ({ onClick, buttonText = "Submit", type = "button" }) => {
  const addButtons = [
    "Add Step",
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
  if (addButtons.includes(buttonText)) {
    return (
      <button className="button is-primary" onClick={onClick} type={type}>
        {buttonText}
      </button>
    );
  } else if (deleteButtons.includes(buttonText)) {
    return (
      <button className="button is-danger" onClick={onClick} type={type}>
        {buttonText}
      </button>
    );
  } else if (editButtons.includes(buttonText)) {
        return (
    <button className="button is-warning" onClick={onClick} type={type}>
      {buttonText}
          </button>
        );
  } else {
        return (
    <button className="button is-success" onClick={onClick} type={type}>
      {buttonText}
          </button>
      );
  }
};

// need to figure out CSS stuff
// button text options
//   Reply, "Comment",

export default Button;
