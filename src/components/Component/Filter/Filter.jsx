import { useState } from "react";
import Card from "../Card/Card";

const Filter = ({ items, type, setItems, itemCollection }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filtered = items.filter((item) => {
    const matchesName = item.name.toLowerCase().includes(search.toLowerCase());
    if (type === "Recipe") {
      const matchesCategory = item.category && item.category.includes(category);
      return matchesName && matchesCategory;
    } else return matchesName;
  });

  return (
    <div className="container">
      <div className="columns is-centered mb-3">
        <div className="column">
          <input
            className="input is-primary"
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {type === "Recipe" && (
          <div className="column">
            <div className="select is-fullwidth is-primary">
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
        )}
      </div>
      <div className="container">
        <Card items={filtered} type={type} setItems={setItems} itemCollection={itemCollection} />
      </div>
    </div>
  );
};

export default Filter;
