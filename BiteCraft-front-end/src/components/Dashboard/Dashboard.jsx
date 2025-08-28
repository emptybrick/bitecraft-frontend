import { useEffect, useState, useContext } from "react";

import { UserContext } from "../../contexts/UserContext";

import * as userService from "../../services/userService";

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
  }, [user]);

  return (
    <main className="section">
      <div className="container">
        <div className="box has-text-centered">
          <h1 className="title is-2 mb-3">
            Welcome to BiteCraft!
          </h1>
          <p className="subtitle is-5 mb-5">
            This is the dashboard page where you can see a list of all the
            users.
          </p>
          <div className="card">
            <header className="card-header">
              <p className="card-header-title">All Users</p>
            </header>
            <div className="card-content">
              <div className="content">
                <ul>
                  {users.map((user) => (
                    <li key={user._id} className="mb-2">
                      <span className="tag is-info is-medium">
                        {user.username}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
