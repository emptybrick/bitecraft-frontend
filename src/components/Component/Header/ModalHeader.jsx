const ModalHeader = ({ itemName }) => {
    return (
      <header className="modal-card-head">
        <h2 className="title is-2 py-2 modal-card-title">
          {itemName}
        </h2>
      </header>
    );
};

export default ModalHeader