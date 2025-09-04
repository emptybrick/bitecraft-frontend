import { useState } from "react";
import { Link } from "react-router";

const Filter = ({items, type }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filtered = items.filter((item) => {
    const matchesName = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      item.category && item.category.includes(category);
    return matchesName && matchesCategory;
  });

    return (
      <div className="container">
        <div className="columns is-centered mb-3">
          <div className="column">
            <input
              className="input"
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="column">
            <div className="select is-fullwidth">
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
          <div className="column is-third">
            <div className="select is-fullwidth">
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
            <thead className="has-background-info-30">
              <tr>
                <th>Name</th>
                <th>Author</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item._id}>
                  <td>
                    <Link
                      to={`/${type}/${item._id}`}
                      className="has-text-info-40 has-text-weight-bold"
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td>{item.author.username}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};

export default Filter;
