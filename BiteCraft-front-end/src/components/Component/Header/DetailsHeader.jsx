const DetailsHeader = ({ item }) => {
  return (
    <header>
      <div className="card">
        <div className="card-header has-background-primary-30 is-justify-content-center">
          <h2 className="title is-2 py-2 has-text-white">{item.name}</h2>
        </div>
        <div className="level is-flex is-align-items-flex-start m-4 pb-4">
          <div>
            <div className="hero">
              {item.category ? (
                <h2 className="subtitle is-4 mb-2">{item.category} Dish</h2>
              ) : null}
              <p className="subtitle is-size-5">{item.details}</p>
            </div>
          </div>
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
      </div>
    </header>
  );
};

export default DetailsHeader;
