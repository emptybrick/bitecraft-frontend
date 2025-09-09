import { useState, useEffect, useContext } from "react";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";
import PageHeader from "../../Component/Header/PageHeader";
import Filter from "../../Component/Filter/Filter";

const RecipeList = () => {
  const { user } = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);
  const [ recipesInCollection, setRecipesInCollection ] = useState([]);
  
  useEffect(() => {
    const fetchAllRecipes = async () => {
      const recipesData = await biteCraftService.Index("Recipe");
      setRecipes(recipesData);
      const collectionData = await biteCraftService.Index(
        "RecipeCollection",
        user._id
      );
      if (collectionData) setRecipesInCollection(collectionData);
    };
    if (user) fetchAllRecipes();
  }, [user]);

  if (!user || !recipes) return <ProgressBar />;

  return (
    <div className="section">
      <div className="container">
        <PageHeader headerText={"List of all Recipes"} />
        <Filter
          items={recipes}
          type={"Recipe"}
          setItems={setRecipes}
          itemCollection={recipesInCollection}
        />
      </div>
    </div>
  );
};

export default RecipeList;
