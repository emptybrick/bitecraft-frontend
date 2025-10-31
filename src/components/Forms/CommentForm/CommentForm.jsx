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
      <div className="field">
        <label htmlFor="text-input"></label>
        <div className="control">
          <textarea
            className="textarea is-success"
            name="text"
            id="text-input"
            value={formData.text}
            onChange={handleChange}
            required
            placeholder="Enter your comment here"
          ></textarea>
        </div>
      </div>
      <div className="field is-grouped is-grouped-center">
        <Button
          type="submit"
          buttonText={buttonText}
        />
        <Button
          type="button"
          onClick={onCancel}
          buttonText="Cancel"
        />
      </div>
    </form>
  );
};

export default CommentForm;
