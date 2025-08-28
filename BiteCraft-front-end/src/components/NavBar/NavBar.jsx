import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  // const dropdownRef = useRef(null);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const handleSelected = () => {
    console.log(dropdownRef.current.classList);
    // if (dropdownRef.current) {
    //   dropdownRef.current.classList.remove("is-active");
    // }
  };

  return (
    <nav
      className="navbar is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        {user ? (
          <div className="navbar-menu is-active" style={{ width: "100%" }}>
            <div className="navbar-start">
              <Link to="/" className="navbar-item">
                Dashboard
              </Link>
            </div>
            <div className="navbar-end">
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">Collections</a>
                <div className="navbar-dropdown">
                  <div className="navbar-item">
                    <Link
                      to={`/${user._id}/recipes-collection`}
                    >
                      Recipes Collection
                    </Link>
                  </div>
                  <div className="navbar-item">
                    <Link
                      to={`/${user._id}/meals-collection`}
                    >
                      Meals Collection
                    </Link>
                  </div>
                </div>
              </div>
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">View</a>
                <div className="navbar-dropdown">
                  <div className="navbar-item">
                    <Link
                      to="/recipes"
                    >
                      All Recipes
                    </Link>
                  </div>
                  <div className="navbar-item">
                    <Link
                      to="/meals"
                    >
                      All Meals
                    </Link>
                  </div>
                  <div className="navbar-item">
                    <Link
                      to={`/${user._id}/planner`}
                    >
                      Meal Planner
                    </Link>
                  </div>
                </div>
              </div>
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">Create</a>
                <div className="navbar-dropdown">
                  <div className="navbar-item">
                    <Link
                      to={`/recipes/new`}
                    >
                      Create New Recipe
                    </Link>
                  </div>
                  <div className="navbar-item">
                    <Link
                      to={`/meals/new`}
                    >
                      Create New Meal
                    </Link>
                  </div>
                </div>
              </div>
              <Link to="/" className="navbar-item" onClick={handleSignOut}>
                Sign Out
              </Link>
            </div>
          </div>
        ) : (
          <div className="navbar-menu is-active" style={{ width: "100%" }}>
            <div className="navbar-start">
              <div className="navbar-item">
                <Link
                  to="/"
                >
                  Home
                </Link>
              </div>
              <div className="navbar-item">
                <Link
                  to="/sign-in"
                >
                  Sign In
                </Link>
              </div>
              <div className="navbar-item">
                <Link
                  to="/sign-up"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
