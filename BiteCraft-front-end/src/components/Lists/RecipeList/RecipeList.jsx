import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";
import PageHeader from "../../Component/Header/PageHeader";

const RecipeList = () => {
  const { user } = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchAllRecipes = async () => {
      const recipesData = await biteCraftService.Index("Recipe");
      setRecipes(recipesData);
    };
    if (user) fetchAllRecipes();
  }, [user]);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesName = recipe.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      recipe.category && recipe.category.includes(category);
    return matchesName && matchesCategory;
  });

  if (!user || !recipes) return <ProgressBar />;

  return (
    <div className="section">
      <div className="container">
        <PageHeader headerText={"List of all Recipes"} />
        <div className="columns is-centered mb-3">
          <div className="column is-half">
            <input
              className="input is-small"
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="column is-half">
            <div className="select is-small is-fullwidth">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value={"Main"}>Main</option>
                <option value={"Side"}>Side</option>
              </select>
            </div>
          </div>
        </div>
        <div className="table-container">
          <table className="table is-hoverable is-fullwidth">
            <thead className="has-background-primary">
              <tr>
                <th>Name</th>
                <th>Author</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipes.map((recipe) => (
                <tr key={recipe._id}>
                  <td>
                    <Link
                      to={`/recipes/${recipe._id}`}
                      className="has-text-info-40 has-text-weight-bold"
                    >
                      {recipe.name}
                    </Link>
                  </td>
                  <td>{recipe.author.username}</td>
                  <td>{new Date(recipe.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecipeList;
