const RecipeBody = ({ recipe, type, isModal }) => {
  return (
    <section
      className={`${isModal ? "modal-card-body" : "box mb-4"}  pt-5 pb-5`}
    >
      {type === "Planner" && (
        <div className="title is-4 has-text-centered mb-4">{recipe.name}</div>
      )}
      <div className="columns is-centered">
        <div className="column box is-one-third mb-0">
          <h4 className="subtitle is-5 mb-4 has-text-weight-bold is-underlined has-text-centered">
            Ingredients
          </h4>
          <div className="content">
            <ul>
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx}>
                  <p className="mb-2 has-text-left">{`${ing.quantity} ${ing.unit} ${ing.name}`}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="column box ml-4">
          <h4 className="subtitle is-5 mb-4 has-text-weight-bold is-underlined has-text-centered">
            Instructions
          </h4>
          <ol className="pl-6">
            {recipe.instructions.map((instruction, idx) => (
              <li className="" key={idx}>
                <p className="has-text-left pl-2">{instruction}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default RecipeBody;
