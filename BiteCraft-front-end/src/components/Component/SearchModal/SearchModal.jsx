import Button from "../Button/Button";

const SearchModal = ({ items, search, submit, cancel }) => {
  return (
    <div className="modal is-active" id="search-modal">
      <div className="modal-background" onClick={cancel}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            Similar ingredient(s) found, Please select an ingredient or confirm
            create new ingredient
          </p>
        </header>
        <section className="modal-card-body">
          <h1>{items.map((item) => item)}</h1>
          <h1>{search}</h1>
        </section>
        <footer className="modal-card-foot">
          <div className="buttons">
            <Button buttonText="Submit" />
            <Button buttonText="Cancel" onClick={cancel} />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SearchModal;
