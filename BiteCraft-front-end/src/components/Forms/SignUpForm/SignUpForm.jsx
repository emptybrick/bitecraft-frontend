import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { signUp } from "../../../services/authService";
import { UserContext } from "../../../contexts/UserContext";
import Button from "../../Component/Button/Button";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConf: "",
  });

  const { username, password, passwordConf } = formData;

  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newUser = await signUp(formData);
      setUser(newUser);
      navigate("/");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf);
  };

  return (
    <main className="section">
      <div className="container">
        <div className="box">
          <h1 className="title is-3 has-text-centered">Sign Up</h1>
          {message && (
            <div className="notification is-danger is-light">{message}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="username" className="label">
                Username
              </label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  id="name"
                  value={username}
                  name="username"
                  onChange={handleChange}
                  required
                  placeholder="Enter your username"
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  id="password"
                  value={password}
                  name="password"
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="confirm" className="label">
                Confirm Password
              </label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  id="confirm"
                  value={passwordConf}
                  name="passwordConf"
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                />
              </div>
            </div>
            <div className="field is-grouped is-grouped-centered">
              <div className="control">
                <Button
                  disabled={isFormInvalid()}
                  type="submit"
                  buttonText="Sign Up"
                />
              </div>
              <div className="control">
                <Button onClick={() => navigate("/")} buttonText="Cancel" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SignUpForm;
