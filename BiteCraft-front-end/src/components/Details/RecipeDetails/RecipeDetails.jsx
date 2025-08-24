import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, data } from "react-router";
import CommentForm from "../../Forms/CommentForm/CommentForm";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";

CommentForm;
const RecipeDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useContext(UserContext);
  const [editState, setEditState] = useState({
    isEditing: false,
    type: null,
    itemId: null,
    commentId: null,
    data: null,
  });
  const [recipe, setRecipe] = useState(null);
  const recipeId = params.recipeId;
  const [visibleForm, setVisibleForm] = useState(null);
  const [addNewComment, setAddNewComment] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const recipeToShow = await biteCraftService.Show("Recipe", recipeId);
      setRecipe(recipeToShow);
      setEditState((prev) => ({
        ...prev,
        data: prev.type === "Recipe" ? recipeToShow : prev.data,
      }));
    };
    if (!editState.isEditing) {
      getData();
    }
  }, [recipeId, editState.isEditing, addNewComment]);

  const toggleNewComment = () => {
    setAddNewComment(!addNewComment);
  };

  const toggleEditMode = (
    type = null,
    data = null,
    itemId = null,
    commentId = null
  ) => {
    setEditState({
      isEditing:
        !editState.isEditing ||
        editState.type !== type ||
        editState.itemId !== itemId,
      type,
      data,
      itemId,
      commentId,
    });
    console.log("edit mode on, edit state is: ", editState);
  };

  const toggleForm = (itemId) => {
    setVisibleForm((prev) => (prev === itemId ? null : itemId));
  };

  const handleChange = (event) => {
    setEditState((prev) => ({
      ...prev,
      data: { ...prev.data, [event.target.name]: event.target.value },
    }));
  };

  // comment handlers
  const handleAddComment = async (commentFormData) => {
    console.log("add comment data", commentFormData);
    const newComment = await biteCraftService.Create(
      "RecipeComment",
      commentFormData,
      recipeId
    );
    toggleNewComment();
    console.log(addNewComment);
    console.log("new comment", newComment);
    console.log("new comment id", newComment._id);
    setRecipe({ ...recipe, comments: [...recipe.comments, newComment] });
  };

  const handleUpdateComment = async (formData) => {
    try {
      if (editState.type === "Comment") {
        await biteCraftService.Update(
          "RecipeComment",
          formData,
          recipeId,
          editState.itemId
        );
        setRecipe({
          ...recipe,
          comments: recipe.comments.map((comment) =>
            comment._id === editState.itemId
              ? { ...comment, text: formData.text }
              : comment
          ),
        });
        toggleEditMode();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await biteCraftService.Delete("RecipeComment", recipeId, commentId);
      setRecipe({
        ...recipe,
        comments: recipe.comments.filter(
          (comment) => comment._id !== commentId
        ),
      });
    } catch (error) {
      console.log(error);
    }
  };

  // reply handlers
  const handleAddReply = async (commentFormData, commentId) => {
    console.log("addreply recipe details:", commentFormData, commentId);
    const newReply = await biteCraftService.Create(
      "RecipeReply",
      commentFormData,
      recipeId,
      commentId
    );
    toggleNewComment();
    setRecipe({
      ...recipe,
      comments: recipe.comments.map((comment) =>
        comment._id === commentId
          ? { ...comment, reply: [...(comment.reply || []), newReply] }
          : comment
      ),
    });
  };

  const handleUpdateReply = async (formData, commentId, replyId) => {
    console.log("form data", formData);
    console.log("commentID", commentId);
    console.log("replyId", replyId);
    try {
      if (editState.type === "Reply" && editState.itemId === replyId) {
        await biteCraftService.Update(
          "RecipeReply",
          formData,
          recipeId,
          commentId,
          replyId
        );
        setRecipe({
          ...recipe,
          comments: recipe.comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  reply: comment.reply.map((rep) =>
                    rep._id === replyId ? { ...rep, text: formData.text } : rep
                  ),
                }
              : comment
          ),
        });
        toggleEditMode();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    console.log("handle delete reply id", replyId);
    try {
      await biteCraftService.Delete(
        "RecipeReply",
        recipeId,
        commentId,
        replyId
      );
      setRecipe({
        ...recipe,
        comments: recipe.comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                reply: comment.reply.filter((rep) => {
                  rep._id !== replyId;
                }),
              }
            : comment
        ),
      });
    } catch (error) {
      console.log(error);
    }
  };

  // recipe handlers
  const handleUpdateRecipe = async (event) => {
    event.preventDefault();
    try {
      if (editState.type === "Recipe") {
        await biteCraftService.Update("Recipe", editState.data, recipeId);
        setRecipe(editState.data);
        toggleEditMode();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRecipe = async () => {
    try {
      await biteCraftService.Delete("Recipe", recipeId);
      navigate("/recipes");
      // navigate(`/collections/${user._id}/recipes-collection`);
    } catch (error) {
      console.log(error);
    }
  };

  if (!recipe) return <main>Loading...</main>;

  return (
    <main>
      <section>
        {editState.type === "Recipe" && editState.isEditing ? (
          <form onSubmit={handleUpdateRecipe}>
            <label htmlFor="category-input">Category:</label>
            <select
              required
              name="category"
              id="category-input"
              value={editState.data.category}
              onChange={handleChange}
            >
              <option value="Main">Main Dish</option>
              <option value="Side">Side Dish</option>
            </select>
            <label htmlFor="name-input">Name:</label>
            <input
              required
              type="text"
              name="name"
              id="name-input"
              value={editState.data.name}
              onChange={handleChange}
            />
            <label htmlFor="details-input">Details:</label>
            <textarea
              type="text"
              name="details"
              id="details-input"
              value={editState.data.details}
              onChange={handleChange}
              required
            ></textarea>
            <label htmlFor="instructions-input">Instructions:</label>
            <textarea
              type="text"
              name="instructions"
              id="instructions-input"
              value={editState.data.instructions}
              onChange={handleChange}
              required
            ></textarea>
            <label htmlFor="ingredients-input">Ingredients:</label>
            <textarea
              type="text"
              name="ingredients"
              id="ingredients-input"
              value={editState.data.ingredients}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit">Save</button>
            <button type="button" onClick={() => toggleEditMode()}>
              Cancel
            </button>
          </form>
        ) : (
          <>
            <header>
              <h2>{recipe.category} Dish</h2>
              <h2>{recipe.name}</h2>
              <p>{`${recipe.author.username} posted on ${new Date(
                recipe.createdAt
              ).toLocaleDateString()}`}</p>
              <p>{recipe.details}</p>
            </header>
            <h4>Instructions:</h4>
            <p>{recipe.instructions}</p>
            <h4>Ingredients:</h4>
            <p>{recipe.ingredients}</p>
            {recipe.author._id === user._id && (
              <>
                <button onClick={handleDeleteRecipe}>Delete</button>
                <button
                  onClick={() => toggleEditMode("Recipe", recipe, recipeId)}
                >
                  Edit
                </button>
              </>
            )}
          </>
        )}
      </section>
      <section>
        <h2>Comments</h2>
        {recipe.author._id !== user._id && (
          <>
            <button onClick={() => toggleForm(recipeId)}>Comment</button>
            {visibleForm === recipeId && (
              <CommentForm
                handleAddComment={(formData) => {
                  handleAddComment(formData);
                  setVisibleForm(null);
                }}
                onCancel={() => toggleForm(recipeId)}
              />
            )}
          </>
        )}
        {recipe.comments.map((comment, idx) => (
          <article key={idx}>
            <header>
              <p>
                {`${comment.author.username} posted on
                ${new Date(comment.createdAt).toLocaleDateString()}`}
              </p>
            </header>
            {editState.isEditing &&
            editState.type === "Comment" &&
            editState.itemId === comment._id &&
            comment.author._id === user._id ? (
              <div>
                <CommentForm
                  initialText={editState.data.text}
                  handleAddComment={(formData, commentId) => {
                    handleUpdateComment(formData, commentId);
                  }}
                  buttonText="Save"
                  onCancel={() => toggleEditMode()}
                />
              </div>
            ) : (
              <p>{comment.text}</p>
            )}
            {comment.author._id === user._id && (
              <>
                <button onClick={() => handleDeleteComment(comment._id)}>
                  Delete
                </button>
                <button
                  onClick={() =>
                    toggleEditMode("Comment", comment, comment._id)
                  }
                >
                  Edit
                </button>
              </>
            )}
            {recipe.author._id === user._id && (
              <>
                <button onClick={() => toggleForm(comment._id)}>Reply</button>
                {visibleForm === comment._id && (
                  <CommentForm
                    handleAddComment={(formData) => {
                      handleAddReply(formData, comment._id);
                      setVisibleForm(null);
                    }}
                    onCancel={() => toggleForm(comment._id)}
                  />
                )}
              </>
            )}
            {comment.reply && comment.reply.length > 0 && (
              <div>
                {comment.reply.map((rep, idx) => (
                  <article key={idx}>
                    <header>
                      <p>{`${rep.author.username} posted on ${new Date(
                        rep.createdAt
                      ).toLocaleDateString()}`}</p>
                    </header>
                    {editState.isEditing &&
                    editState.type === "Reply" &&
                    editState.itemId === rep._id &&
                    rep.author._id === user._id ? (
                      <div>
                        <CommentForm
                          initialText={editState.data.text}
                          handleAddComment={(formData) =>
                            handleUpdateReply(formData, comment._id, rep._id)
                          }
                          buttonText="Save"
                          onCancel={() => toggleEditMode()}
                        />
                      </div>
                    ) : (
                      <p>{rep.text}</p>
                    )}
                    {rep.author._id === user._id && (
                      <>
                        <button
                          onClick={() =>
                            handleDeleteReply(comment._id, rep._id)
                          }
                        >
                          Delete
                        </button>
                        <button
                          onClick={() =>
                            toggleEditMode("Reply", rep, rep._id, comment._id)
                          }
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </article>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>
    </main>
  );
};

export default RecipeDetails;
