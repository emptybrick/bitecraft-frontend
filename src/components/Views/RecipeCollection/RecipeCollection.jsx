import { useState, useEffect, useContext } from "react";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";
import Message from "../../Component/Message/Message";
import PageHeader from "../../Component/Header/PageHeader";
import Filter from "../../Component/Filter/Filter";

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

  if (!user || isLoading) return <ProgressBar />;

  return (
    <div className="section">
      <PageHeader userName={user.username} headerText={"Recipes Collection"} />
      <div className="container">
        {recipes.length > 0 ? (
          <Filter items={recipes} type={"Recipe"} setItems={setRecipes} itemCollection={recipes} />
        ) : (
          <Message itemName={"Recipe"} />
        )}
      </div>
    </div>
  );
};

export default RecipeCollection;