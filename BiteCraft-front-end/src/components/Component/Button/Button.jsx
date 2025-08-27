const Button = ({ onClick, buttonText = "Submit", type = "button" }) => {
//   const addButtons = ["Add", "Create", "Submit", "Save", "Comment", "Sign In"];
//   const editButtons = "Edit";
//   const deleteButtons = ["Delete", "Remove", "Cancel"];
//   if (addButtons.includes(buttonText)) {
    return (
      <button onClick={onClick} type={type}>
        {buttonText}
      </button>
    );
//   } else if (deleteButtons.includes(buttonText)) {
//     return (
//       <button onClick={onClick} type={type}>
//         {buttonText}
//       </button>
//     );
//   } else if (editButtons.includes(buttonText)) {
//     <button onClick={onClick} type={type}>
//       {buttonText}
//     </button>;
//   } else {
//           <button onClick={onClick} type={type}>
//             {buttonText}
//           </button>;
//   }
};

// need to figure out CSS stuff
// button text options
// Create New Recipe, Create New Meal, Add to Collection, Remove from Collection, Add Step, Add Ingredient, Reply

export default Button;
