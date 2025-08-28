import { useEffect, useState, useContext } from "react";
import { Link } from "react-router";

import { UserContext } from "../../contexts/UserContext";

import * as userService from "../../services/userService";
import ProgressBar from "../Component/ProgressBar/ProgressBar";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.index();
        setUsers(fetchedUsers);
      } catch (err) {
        console.log(err);
      }
    };
    if (user) fetchUsers();
  }, [ user ]);
  
  if (!user) return <ProgressBar />;
  
  return (
    <main className="section">
      <div className="container">
        <div className="box has-text-centered">
          <h1 className="title is-2 mb-3">Welcome, {user?.username}!</h1>
          <p className="subtitle is-5 mb-5">
            This is your dashboard. Here’s what you can do:
          </p>
          <div className="columns is-centered">
            <div className="column is-half">
              <div className="card">
                <div className="card-content">
                  <h2 className="title is-5 mb-4">Recipes</h2>
                  <div className="buttons is-flex is-flex-direction-column">
                    <Link
                      to="/recipes"
                      className="button is-primary is-fullwidth mb-3"
                    >
                      Browse Recipes
                    </Link>
                    <Link
                      to="/recipes/new"
                      className="button is-success is-fullwidth mb-3"
                    >
                      Add New Recipe
                    </Link>
                    <Link
                      to={`/${user._id}/recipes-collection`}
                      className="button is-info is-fullwidth"
                    >
                      My Recipe Collection
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="card">
                <div className="card-content">
                  <h2 className="title is-5 mb-4">Meals</h2>
                  <div className="buttons is-flex is-flex-direction-column">
                    <Link
                      to="/meals"
                      className="button is-primary is-fullwidth mb-3"
                    >
                      Browse Meals
                    </Link>
                    <Link
                      to="/meals/new"
                      className="button is-success is-fullwidth mb-3"
                    >
                      Create New Meal
                    </Link>
                    <Link
                      to={`/${user._id}/meals-collection`}
                      className="button is-info is-fullwidth"
                    >
                      My Meal Collection
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
