const ModalHeader = ({ itemName }) => {
    return (
      <header className="modal-card-head has-background-info-55">
        <h2 className="has-text-weight-extrabold modal-card-title">
          {itemName}
        </h2>
      </header>
    );
};

export default ModalHeader