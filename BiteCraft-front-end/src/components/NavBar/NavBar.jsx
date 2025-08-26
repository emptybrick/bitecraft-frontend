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
    <nav>
      {user ? (
        <ul>
          <li>Welcome, {user.username}</li>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to={`/${user._id}/planner`}>Meal Plan</Link>
          </li>
          <li>
            <Link to={`/${user._id}/recipes-collection`}>
              Recipes Collection
            </Link>
          </li>
          <li>
            <Link to={`/${user._id}/meals-collection`}>
              Meals Collection
            </Link>
          </li>
          <li>
            <Link to="/recipes">All Recipes</Link>
          </li>
          <li>
            <Link to="/meals">All Meals</Link>
          </li>
          <li>
            <Link to="/" onClick={handleSignOut}>
              Sign Out
            </Link>
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/sign-in">Sign In</Link>
          </li>
          <li>
            <Link to="/sign-up">Sign Up</Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
