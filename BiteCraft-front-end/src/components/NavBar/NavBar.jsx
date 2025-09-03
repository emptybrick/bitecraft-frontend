import { useState, useContext, useEffect } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isHoverable, setIsHoverable] = useState("is-hoverable");

  useEffect(() => {
    setTimeout(() => {
      setIsHoverable("is-hoverable");
    }, 100);
  }, [isHoverable]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
    setTimeout(() => {
      setIsHoverable("");
    }, 150);
  };

  return (
    <nav
      className="navbar has-background-primary-25"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand" onClick={() => toggleDropdown("brand")}>
          <Link to="/" className="navbar-item has-text-weight-bold is-size-4">
            BiteCraft
          </Link>
        </div>
        {user ? (
          <div id="navbarMenu" className="navbar-menu is-active">
            <div className="navbar-start">
              <div
                className={`navbar-item has-dropdown ${isHoverable} ${
                  activeDropdown === "collections" ? "is-active" : ""
                }`}
              >
                <a
                  className="navbar-link"
                  onClick={() => toggleDropdown("collections")}
                >
                  Collections
                </a>
                <div className="navbar-dropdown">
                  <Link
                    to={`/${user._id}/recipes-collection`}
                    className="navbar-item"
                    onClick={closeDropdown}
                  >
                    Recipes Collection
                  </Link>
                  <Link
                    to={`/${user._id}/meals-collection`}
                    className="navbar-item"
                    onClick={closeDropdown}
                  >
                    Meals Collection
                  </Link>
                </div>
              </div>
              <div
                className={`navbar-item has-dropdown ${isHoverable} ${
                  activeDropdown === "view" ? "is-active" : ""
                }`}
              >
                <a
                  className="navbar-link"
                  onClick={() => toggleDropdown("view")}
                >
                  View
                </a>
                <div className="navbar-dropdown">
                  <Link
                    to="/recipes"
                    className="navbar-item"
                    onClick={closeDropdown}
                  >
                    All Recipes
                  </Link>
                  <Link
                    to="/meals"
                    className="navbar-item"
                    onClick={closeDropdown}
                  >
                    All Meals
                  </Link>
                  <Link
                    to={`/${user._id}/planner`}
                    className="navbar-item"
                    onClick={closeDropdown}
                  >
                    Meal Planner
                  </Link>
                </div>
              </div>
              <div
                className={`navbar-item has-dropdown ${isHoverable} ${
                  activeDropdown === "create" ? "is-active" : ""
                }`}
              >
                <a
                  className="navbar-link"
                  onClick={() => toggleDropdown("create")}
                >
                  Create
                </a>
                <div className="navbar-dropdown">
                  <Link
                    to={`/recipes/new`}
                    className="navbar-item"
                    onClick={closeDropdown}
                  >
                    Create New Recipe
                  </Link>
                  <Link
                    to={`/meals/new`}
                    className="navbar-item"
                    onClick={closeDropdown}
                  >
                    Create New Meal
                  </Link>
                </div>
              </div>
            </div>
            <div className="navbar-end is-active">
              <Link to="/" className="navbar-item" onClick={handleSignOut}>
                Sign Out
              </Link>
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
