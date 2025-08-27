import { useState } from "react";
import Button from "../../Component/Button/Button";

const CommentForm = ({
  handleAddComment,
  onCancel,
  buttonText = "Submit",
  initialText = "",
}) => {
  const [formData, setFormData] = useState({ text: initialText });
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event, commentId, recipeId) => {
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
      <Button type="submit" buttonText={buttonText} />
      <Button type="button" onClick={onCancel} buttonText="Cancel" />
    </form>
  );
};

export default CommentForm;
