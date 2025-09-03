// const MealModalBody = ({ item }) => {
//     return (
<>
  <div className="columns">
    <div className="column is-one-third">
      <QuickViewCard
        item={recipe}
        onClick={(e) => handleShowQuickView(e)}
        id={`modal-trigger-${idx}`}
        target={`modal-${idx}`}
        buttonText="Go to Recipe"
        link={`/recipes/${recipe._id}`}
      />
    </div>
    <div className="column is-one-third">
      <QuickViewCard
        item={recipe}
        onClick={(e) => handleShowQuickView(e)}
        id={`modal-trigger-${idx}`}
        target={`modal-${idx}`}
        buttonText="Go to Recipe"
        link={`/recipes/${recipe._id}`}
      />
    </div>
    <div className="column is-one-third">
      <QuickViewCard
        item={recipe}
        onClick={(e) => handleShowQuickView(e)}
        id={`modal-trigger-${idx}`}
        target={`modal-${idx}`}
        buttonText="Go to Recipe"
        link={`/recipes/${recipe._id}`}
      />
    </div>
  </div>

  <section className="modal-card-body pb-2">
    <h3 className="subtitle is-4 has-text-weight-bold is-underlined">
      {item.name}
    </h3>
    <div className="has-text-left pl-4">
      <div className="mb-2">
        <span className="has-text-weight-semibold">Main Dish: </span>
        {meal.main ? (
          <Link
            key={meal.main._id}
            to={`/recipes/${meal.main._id}`}
            className="has-text-link"
          >
            {meal.main.name}
          </Link>
        ) : (
          <span className="has-text-grey-light">
            Recipe is no longer available.
          </span>
        )}
      </div>
      <div className="mb-2">
        <span className="has-text-weight-semibold">Side Dish: </span>
        {meal.side1 ? (
          <Link
            key={meal.side1._id}
            to={`/recipes/${meal.side1._id}`}
            className="has-text-link"
          >
            {meal.side1.name}
          </Link>
        ) : (
          <span className="has-text-grey-light">
            Recipe is no longer available.
          </span>
        )}
      </div>
      <div className="mb-2">
        <span className="has-text-weight-semibold">Side Dish: </span>
        {meal.side2 ? (
          <Link
            key={meal.side2._id}
            to={`/recipes/${meal.side2._id}`}
            className="has-text-link"
          >
            {meal.side2.name}
          </Link>
        ) : (
          <span className="has-text-grey-light">
            Recipe is no longer available.
          </span>
        )}
      </div>
    </div>
  </section>
</>;
//     );
// };

// export default MealModalBody
