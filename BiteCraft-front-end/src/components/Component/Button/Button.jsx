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
    "Add Ingredient",
    "Add to Collection",
    "Create New Recipe",
    "Create New Meal",
    "Submit",
    "Save",
    "Sign In",
    "Add New Comment",
    "Go to Recipe",
    "Go to Meal",
    "Auto-Generate",
    "Manual Select",
    "Add Step",
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
      <button
        className="button has-background-success"
        onClick={ onClick }
        type={ type }
      >
        { buttonText }
      </button>
    );
  } else if (deleteButtons.includes(buttonText)) {
    return (
      <button
        className="button has-background-danger"
        onClick={ onClick }
        type={ type }
      >
        { buttonText }
      </button>
    );
  } else if (editButtons.includes(buttonText)) {
    return (
      <button
        className="button has-background-warning"
        onClick={ onClick }
        type={ type }
      >
        { buttonText }
      </button>
    );
  } else if (buttonText === "Print") {
    return (
      <button
        className="button has-background-primary"
        onClick={ onClick }
        type={ type }
      >
        { buttonText }
      </button>
    );
  } else if (buttonText === "Quick View") {
    return (
      <button
        className="button is-primary"
        onClick={onClick}
        target={target}
        id={id}
      >
        {buttonText}
      </button>
    );
  } else if (buttonText === "Sign Up") {
    return (
      <button
        className="button is-success"
        disabled={ disabled }
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

export default Button;
