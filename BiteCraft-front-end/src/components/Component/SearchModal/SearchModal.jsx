import Select from "react-select";
import Button from "../Button/Button";
import { useState } from "react";

const SearchModal = ({ items, search, submit, cancel }) => {
  const [formData, setFormData] = useState(search);

  const handleChange = (event) => {
    setFormData(event.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData === search) {
      submit(formData);
    } else {
      cancel()
    }
  };

  const defaultOption = search ? { label: search, value: search } : null;
  const existingOptions = items.map((ing) => ({
    label: ing,
    value: ing,
  }));
  const allOptions = [defaultOption, ...existingOptions];

  return (
    <div className="modal is-active" id="search-modal">
      <div className="modal-background" onClick={cancel}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Similar ingredient(s) found!</p>
        </header>
        <section className="modal-card-body">
          <Select
            onChange={handleChange}
            className="basic-single"
            name="ing"
            id="ing-search"
            defaultValue={defaultOption}
            options={allOptions}
            menuIsOpen={true}
            isClearable
            styles={{
              menu: (provided) => ({
                ...provided,
                position: "static", 
                maxHeight: "400px", 
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: "280px", 
                overflow: "auto",
              }),
            }}
          />
        </section>
        <footer className="modal-card-foot">
          <div className="buttons">
            <Button buttonText="Submit" onClick={handleSubmit} />
            <Button buttonText="Cancel" onClick={cancel} />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SearchModal;
