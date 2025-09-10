import Button from "../Button/Button";

const SearchModal = ({items}) => {
  return (
    <div className="modal is-active" id="search-modal">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
                  <p className="modal-card-title">Similar ingredient(s) found, Please select an ingredient or confirm create new ingredient</p>
        </header>
        <section className="modal-card-body">
          <h1>TEST MODAL</h1>
        </section>
        <footer className="modal-card-foot">
                  <div className="buttons">
            <Button buttonText="Submit"/>
            <Button buttonText="Cancel"/>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SearchModal;
