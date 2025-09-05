import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';

import { signIn } from '../../../services/authService';

import { UserContext } from '../../../contexts/UserContext';
import Button from '../../Component/Button/Button';

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main className="section">
      <div className="container">
        <div className="box">
          <h1 className="title has-text-centered">Sign In</h1>
          {message && (
            <div className="notification is-danger is-light">{message}</div>
          )}
          <form autoComplete="off" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label" htmlFor="username">
                Username
              </label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  autoComplete="off"
                  id="username"
                  value={formData.username}
                  name="username"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="password">
                Password
              </label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  autoComplete="off"
                  id="password"
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="field is-grouped is-grouped-centered">
              <div className="control">
                <Button type="submit" buttonText="Sign In" />
              </div>
              <div className="control">
                <Button
                  onClick={() => navigate('/')}
                  buttonText="Cancel"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SignInForm;
