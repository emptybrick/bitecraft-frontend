const RecipeBody = ({ item, type, isModal }) => {
  return (
    <section className={`${isModal ? "modal-card-body" : "container"}`}>
      <div className={`${!isModal ? "box" : ""}`}>
        {type === "Planner" ||
          (type === "Meal" && (
            <div className="level">
              <div className="title is-4">{item.name}</div>
              <div className="level-right pl-6">
                <div>
                  <p className="is-size-6 mb-1">
                    {`${item.author.username} posted on ${new Date(
                      item.createdAt
                    ).toLocaleDateString()}`}
                  </p>

                  <p className="is-size-6">
                    {`Last updated on ${new Date(
                      item.updatedAt
                    ).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        <div className="columns is-centered">
          <div className="column is-one-third">
            <h4 className="subtitle is-5 mb-4 has-text-weight-bold is-underlined has-text-centered">
              Ingredients
            </h4>
            <div className="content">
              <ul>
                {item.ingredients.map((ing, idx) => (
                  <li key={idx}>
                    <p className="mb-2 has-text-left">{`${ing.quantity} ${ing.unit} ${ing.name}`}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="column ml-4">
            <h4 className="subtitle is-5 mb-4 has-text-weight-bold is-underlined has-text-centered">
              Instructions
            </h4>
            <ol className="pl-6">
              {item.instructions.map((instruction, idx) => (
                <li className="" key={idx}>
                  <p className="has-text-left pl-2">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecipeBody;