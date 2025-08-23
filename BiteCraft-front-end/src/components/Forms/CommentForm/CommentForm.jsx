import { useState } from "react";

const CommentForm = ({ handleAddComment, onCancel, buttonText, initialText }) => {
  const [formData, setFormData] = useState({ text: "" });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddComment(formData);
    setFormData({ text: "" });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="text-input">Your comment:</label>
        <textarea
          type="text"
          name="text"
          id="text-input"
          value={formData.text}
          onChange={handleChange}
          required
        >{ initialText }</textarea>
        <button type="submit">{ buttonText ? buttonText : "Submit" }</button>
        <button type='button' onClick={onCancel}>Cancel</button>
      </form>
      
    </>
  );
};

export default CommentForm;
