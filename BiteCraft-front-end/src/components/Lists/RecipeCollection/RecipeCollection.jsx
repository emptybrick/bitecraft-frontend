import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import Button from "../../Component/Button/Button";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";
import QuickViewCard from "../../Component/QuickViewCard/QuickViewCard";
import RecipeModalBody from "../../Component/ModalBody/RecipeModalBody";
import ModalFooter from "../../Component/Footer/ModalFooter";
import ModalHeader from "../../Component/Header/ModalHeader";
import Message from "../../Component/Message/Message";
import PageHeader from "../../Component/Header/PageHeader";

const RecipeCollection = () => {
  const { user } = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchAllRecipes = async () => {
      const recipesData = await biteCraftService.Index(
        "RecipeCollection",
        user._id
      );
      if (recipesData) {
        setRecipes(recipesData);
      }
      setIsLoading(false);
    };

    if (user) fetchAllRecipes();
  }, [user]);

  const handleCloseQuickView = (e) => {
    e.preventDefault();
    setActiveModal(null);
  };

  const handleShowQuickView = (e) => {
    e.preventDefault();
    const modal = e.target.dataset.target;
    setActiveModal(modal);
  };

  if (!user || isLoading) return <ProgressBar />;

  return (
    <div className="section">
      <PageHeader userName={user.username} headerText={"Recipes Collection"} />
      <div className="container">
        {recipes.length > 0 ? (
          <div className="columns is-multiline has-text-centered is-vcentered">
            {recipes.map((recipe, idx) => (
              <div className="column is-one-third" key={idx}>
                <div
                  className={`modal ${
                    activeModal === `modal-${idx}` ? "is-active" : ""
                  }`}
                  id={`modal-${idx}`}
                >
                  <div
                    className="modal-background"
                    onClick={handleCloseQuickView}
                  ></div>
                  <div className="modal-card">
                    <ModalHeader itemName={recipe.name} />
                    <RecipeModalBody recipe={recipe} />
                    <ModalFooter
                      item={recipe}
                      type={"Recipe"}
                      collection={"RecipeCollection"}
                      closeQuickView={handleCloseQuickView}
                      setActiveModal={setActiveModal}
                      items={recipes}
                      setItems={setRecipes}
                    />
                  </div>
                </div>
                <QuickViewCard
                  item={recipe}
                  onClick={(e) => handleShowQuickView(e)}
                  id={`modal-trigger-${idx}`}
                  target={`modal-${idx}`}
                  buttonText="Go to Recipe"
                  link={`/recipes/${recipe._id}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <Message itemName={"Recipe"} />
        )}
      </div>
    </div>
  );
};

export default RecipeCollection;
