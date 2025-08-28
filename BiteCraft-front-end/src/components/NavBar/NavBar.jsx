import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav
      className="navbar is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item has-text-weight-bold is-size-4">
            BiteCraft
          </Link>
        </div>
        {user ? (
          <div id="navbarMenu" className="navbar-menu is-active">
            <div className="navbar-start">
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">Collections</a>
                <div className="navbar-dropdown">
                  <Link
                    to={`/${user._id}/recipes-collection`}
                    className="navbar-item"
                  >
                    Recipes Collection
                  </Link>
                  <Link
                    to={`/${user._id}/meals-collection`}
                    className="navbar-item"
                  >
                    Meals Collection
                  </Link>
                </div>
              </div>
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">View</a>
                <div className="navbar-dropdown">
                  <Link
                    to="/recipes"
                    className="navbar-item"
                  >
                    All Recipes
                  </Link>
                  <Link
                    to="/meals"
                    className="navbar-item"
                  >
                    All Meals
                  </Link>
                  <Link
                    to={`/${user._id}/planner`}
                    className="navbar-item"
                  >
                    Meal Planner
                  </Link>
                </div>
              </div>
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">Create</a>
                <div className="navbar-dropdown">
                  <Link
                    to={`/recipes/new`}
                    className="navbar-item"
                  >
                    Create New Recipe
                  </Link>
                  <Link
                    to={`/meals/new`}
                    className="navbar-item"
                  >
                    Create New Meal
                  </Link>
                </div>
              </div>
            </div>
            <div className="navbar-end is-active">
              <a className="navbar-item"
                  onClick={handleSignOut}>
                 Sign Out
              </a>
            </div>
          </div>
        ) : (
          <div id="navbarMenu" className="navbar-menu is-active">
            <div className="navbar-end">
              <Link to="/sign-in" className="navbar-item">
                <span>Sign In</span>
              </Link>
              <Link to="/sign-up" className="navbar-item">
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
