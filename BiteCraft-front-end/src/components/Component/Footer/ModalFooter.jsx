import { useContext, useEffect, useState } from "react";
import Button from "../Button/Button";
import { UserContext } from "../../../contexts/UserContext";
import { useNavigate, useParams } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";

const ModalFooter = ({
  item,
  type,
  closeQuickView,
  setActiveModal,
  items,
  setItems,
  mealBody,
  itemCollection = [],
}) => {
  const { user } = useContext(UserContext);
  const params = useParams();
  const navigate = useNavigate();
  const [addedToCollection, setAddedToCollection] = useState(null);

  useEffect(() => {
    setAddedToCollection(false);
  }, [addedToCollection]);

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

  const handleAddToCollection = async (item) => {
    try {
      await biteCraftService.AddToCollection(type, item, user._id);
      itemCollection.push(item)
      setAddedToCollection(true);
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

  const handleNavigate = (itemId, type) => {
    navigate(`/${type}/${itemId}`);
  };

  return (
    <footer className="modal-card-foot pt-1 pb-3 is-flex-direction-column">
      <div className="level mb-2 is-gap-8">
        <p className="has-text-left pt-2 mr-6 pr-6">{`Total Comments: ${item.comments.length}`}</p>
        <p className="has-text-right pt-2 ml-6 pl-6">{`${
          item.author.username
        } posted on ${new Date(item.createdAt).toLocaleDateString()}`}</p>
      </div>
      <div className="container is-flex is-justify-content-space-between is-align-content-center">
        {type === "Recipe" ? (
          <div className="buttons mb-0">
            <Button onClick={handlePrint} buttonText="Print" />
            <Button
              onClick={() => handleNavigate(item._id, "recipes")}
              buttonText="Go to Recipe"
            />
          </div>
        ) : (
          !mealBody && (
            <Button
              onClick={() => handleNavigate(item._id, "meals")}
              buttonText="Go to Meal"
            />
          )
        )}
        <div className="buttons">
          {user._id === params.userId &&
          item.author._id !== user._id &&
          !mealBody ? (
            <Button
              onClick={(e) => {
                closeQuickView(e);
                handleRemoveFromCollection(item._id);
              }}
              buttonText="Remove from Collection"
            />
          ) : (
            <>
              {user._id === params.userId &&
              item.author._id === user._id &&
              !mealBody ? (
                <Button
                  onClick={(e) => {
                    closeQuickView(e);
                    handleDelete(item._id);
                  }}
                  buttonText="Delete"
                />
              ) : (
                !mealBody &&
                !itemCollection.some((i) => i._id === item._id) && (
                  <Button
                    onClick={(e) => {
                      handleAddToCollection(item);
                    }}
                    buttonText="Add to Collection"
                  />
                )
              )}
            </>
          )}
          <Button onClick={(e) => closeQuickView(e)} buttonText="Close" />
        </div>
      </div>
    </footer>
  );
};

export default ModalFooter;
