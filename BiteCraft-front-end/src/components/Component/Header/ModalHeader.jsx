const ModalHeader = ({ itemName }) => {
    return (
      <header className="modal-card-head has-background-primary-30">
        <h2 className="title is-2 py-2 has-text-white modal-card-title">
          {itemName}
        </h2>
      </header>
    );
};

export default ModalHeader