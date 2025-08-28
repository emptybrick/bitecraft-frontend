const Header = ({ item }) => {
  return (
    <header className="container">
      <div className="box has-background-primary mt-4">
        <div className="hero has-text-centered has-background-primary">
          <h2 className="title is-1 has-text-light mb-3">{item.name}</h2>
        </div>
        <div className="level is-flex is-align-items-flex-end m-4">
          <div>
            <div className="hero has-background-primary">
              {item.category ? (
                <h2 className="subtitle is-4 has-text-light mb-2">
                  {item.category} Dish
                </h2>
              ) : null}
              <p className="subtitle is-size-5 has-text-light mt-4">{item.details}</p>
            </div>
          </div>
          <div className="level-right pl-6">
            <div>
              <p className="is-size-6 has-text-light mb-1">
                {`${item.author.username} posted on ${new Date(
                  item.createdAt
                ).toLocaleDateString()}`}
              </p>

              <p className="is-size-6 has-text-light">
                {`Last updated on ${new Date(
                  item.updatedAt
                ).toLocaleDateString()}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
