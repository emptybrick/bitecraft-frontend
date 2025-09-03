import { useContext } from "react";
import Button from "../Button/Button";
import { UserContext } from "../../../contexts/UserContext";
import { useParams } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";

const ModalFooter = ({
  item,
  type,
  collection,
  closeQuickView,
  setActiveModal,
  items,
  setItems,
}) => {
  const { user } = useContext(UserContext);
  const params = useParams();

  const handleDelete = async (itemId) => {
    try {
      await biteCraftService.Delete(type, itemId, user._id);
      const filteredItem = items.filter((item) => item._id !== itemId);
      setItems(filteredItem);
      setActiveModal(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCollection = async (itemId) => {
    try {
      await biteCraftService.Add(collection, itemId, user._id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFromCollection = async (itemId) => {
    try {
      await biteCraftService.RemoveFromCollection(type, itemId, user._id);
      const filteredItem = items.filter((item) => item._id !== itemId);
      setItems(filteredItem);
      setActiveModal(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <footer className="modal-card-foot pt-1 pb-3 is-flex-direction-column has-background-grey-lighter">
      <div className="level mb-2 is-gap-8">
        <p className="has-text-left pt-2 mr-6 pr-6">{`Total Comments: ${item.comments.length}`}</p>
        <p className="has-text-right pt-2 ml-6 pl-6">{`${
          item.author.username
        } posted on ${new Date(item.createdAt).toLocaleDateString()}`}</p>
      </div>
      <div className="container is-flex is-justify-content-space-between">
        {type === "Recipe" ? (
          <div>
            <Button
              className="button"
              onClick={handlePrint}
              buttonText="Print"
            />
          </div>
        ) : <div></div> }
        <div className="buttons">
          <Button onClick={(e) => closeQuickView(e)} buttonText="Close" />
          {user._id === params.userId && item.author._id !== user._id ? (
            <Button
              onClick={(e) => {
                closeQuickView(e);
                handleRemoveFromCollection(item._id);
              }}
              buttonText="Remove from Collection"
            />
          ) : (
            <>
              {user._id === params.userId && item.author._id === user._id ? (
                <Button
                  onClick={(e) => {
                    closeQuickView(e);
                    handleDelete(item._id);
                  }}
                  buttonText="Delete"
                />
              ) : (
                <Button
                  onClick={(e) => {
                    closeQuickView(e);
                    handleAddToCollection(item._id);
                  }}
                  buttonText="Add to Collection"
                />
              )}
            </>
          )}
        </div>
      </div>
    </footer>
  );
};

export default ModalFooter;
