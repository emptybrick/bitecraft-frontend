import { useState } from "react";

const CommentForm = ({
  handleAddComment,
  onCancel,
  buttonText = "Submit",
  initialText = '',
}) => {
  const [formData, setFormData] = useState({ text: initialText });
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event, commentId, recipeId) => {
    console.log("comment form handle submit comment Id", commentId)
    event.preventDefault();
    handleAddComment(formData, commentId, recipeId);
    setFormData({ text: "" });
  };

  return (
      <form onSubmit={handleSubmit}>
        <label htmlFor="text-input">Your comment:</label>
        <textarea
          name="text"
          id="text-input"
          value={formData.text}
          onChange={handleChange}
          required
          placeholder="Enter your comment here"
        ></textarea>
        <button type="submit">{buttonText}</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
  );
};

export default CommentForm;
