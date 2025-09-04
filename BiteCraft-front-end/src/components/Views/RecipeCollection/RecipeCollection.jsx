import { useState, useEffect, useContext } from "react";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";
import QuickViewCard from "../../Component/QuickViewCard/QuickViewCard";
import RecipeBody from "../../Component/Body/RecipeBody";
import ModalFooter from "../../Component/Footer/ModalFooter";
import ModalHeader from "../../Component/Header/ModalHeader";
import Message from "../../Component/Message/Message";
import PageHeader from "../../Component/Header/PageHeader";
import Card from "../../Component/Card/Card";

const RecipeCollection = () => {
  const { user } = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);
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
          <Card items={recipes} itemType="Recipe" isModal={true} setItems={setRecipes} />
        ) : (
          <Message itemName={"Recipe"} />
        )}
      </div>
    </div>
  );
};

export default RecipeCollection;