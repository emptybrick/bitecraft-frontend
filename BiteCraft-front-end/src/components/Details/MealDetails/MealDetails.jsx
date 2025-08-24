import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import CommentForm from "../../Forms/CommentForm/CommentForm";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import { Link } from 'react-router'

const MealDetails = () => {
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
  const [meal, setMeal] = useState(null);
  const mealId = params.mealId;
  const [visibleForm, setVisibleForm] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const mealToShow = await biteCraftService.Show("Meal", mealId);
      setMeal(mealToShow);
      setEditState((prev) => ({
        ...prev,
        data: prev.type === "Meal" ? mealToShow : prev.data,
      }));
    };
    if (!editState.isEditing) {
      getData();
    }
  }, [mealId, editState.isEditing]);

  const toggleEditMode = (
    type = null,
    data = null,
    itemId = null,
    commentId = null
  ) => {
    console.log("trying to toggle edit mode")
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
  };

  const toggleForm = (itemId) => {
    if (!itemId) {
      setVisibleForm((prev) => (prev === mealId ? null : mealId));
    } else {
      setVisibleForm((prev) => (prev === itemId ? null : itemId));
    }
  };

  const handleChange = (event) => {
    setEditState((prev) => ({
      ...prev,
      data: { ...prev.data, [event.target.name]: event.target.value },
    }));
  };

  // comment handlers
  const handleAddComment = async (commentFormData) => {
    const newComment = await biteCraftService.Create(
      "MealComment",
      commentFormData,
      mealId
    );
    setMeal({ ...meal, comments: [meal.comments, newComment] });
  };

  const handleUpdateComment = async (event, commentId) => {
    event.preventDefault();
    try {
      if (editState.type === "Comment" && editState.itemId === commentId) {
        await biteCraftService.Update(
          "MealComment",
          editState.data,
          mealId,
          commentId
        );
        setMeal({
          ...meal,
          comments: meal.comments.map((comment) => {
            comment._id === commentId
              ? { ...comment, text: editState.data.text }
              : comment;
          }),
        });
        toggleEditMode();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await biteCraftService.Delete("MealComment", mealId, commentId);
      setMeal({
        ...meal,
        comments: meal.comments.filter((comment) => comment._id !== commentId),
      });
    } catch (error) {
      console.log(error);
    }
  };

  // reply handlers
  const handleAddReply = async (commentFormData, commentId) => {
    const newReply = await biteCraftService.Create(
      "MealReply",
      commentFormData,
      mealId,
      commentId
    );
    setMeal({
      ...meal,
      comments: meal.comments.map((comment) => {
        comment._id === commentId
          ? { ...comment, reply: [...(comment.reply || []), newReply] }
          : comment;
      }),
    });
  };

  const handleUpdateReply = async (event, commentId, replyId) => {
    event.preventDefault();
    try {
      if (editState.type === "Reply" && editState.itemId === replyId) {
        await biteCraftService.Update(
          "MealReply",
          editState.data,
          mealId,
          commentId,
          replyId
        );
        setMeal({
          ...meal,
          comments: meal.comments.map((comment) => {
            comment._id === commentId
              ? {
                  ...comment,
                  reply: comment.reply.map((rep) => {
                    rep._id === replyId
                      ? { ...rep, text: editState.data.text }
                      : rep;
                  }),
                }
              : comment;
          }),
        });
        toggleEditMode();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      await biteCraftService.Delete("MealReply", mealId, commentId, replyId);
      setMeal({
        ...meal,
        comments: meal.comments.map((comment) => {
          comment._id === commentId
            ? {
                ...comment,
                reply: comment.reply.filter((rep) => {
                  rep._id !== replyId;
                }),
              }
            : comment;
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  // meal handlers
  const handleUpdateMeal = async (event) => {
    event.preventDefault();
    try {
      if (editState.type === "Meal") {
        await biteCraftService.Update("Meal", editState.data, mealId);
        setMeal(editState.data);
        toggleEditMode();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMeal = async () => {
    try {
      await biteCraftService.Delete("Meal", mealId);
      navigate(`/collections/${user._id}/meals-collection`);
    } catch (error) {
      console.log(error);
    }
  };

  if (!meal) return <main>Loading...</main>;

  return (
    <main>
      <section>
        {editState.type === "Meal" && editState.isEditing ? (
          <form onSubmit={handleUpdateMeal}>
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
            <label htmlFor="main-input">Main Dish:</label>
            <select
              required
              name="main"
              id="main-input"
              value={editState.data.main}
              onChange={handleChange}
            >
              <option value="" disabled selected>
                Select a Recipe
              </option>
              {mainRecipes.map((recipe) => {
                <option value={recipe._id}>{recipe.name}</option>;
              })}
            </select>
            <label htmlFor="side1-input">Side Dish 1:</label>
            <select
              required
              name="side1"
              id="side1-input"
              value={editState.data.side1}
              onChange={handleChange}
            >
              <option value="" disabled selected>
                Select a Recipe
              </option>
              {sideRecipes.map((recipe) => {
                <option value={recipe._id}>{recipe.name}</option>;
              })}
            </select>
            <label htmlFor="side2-input">Side Dish 2:</label>
            <select
              required
              name="side2"
              id="side2-input"
              value={editState.data.side2}
              onChange={handleChange}
            >
              <option value="" disabled selected>
                Select a Recipe
              </option>
              {sideRecipes.map((recipe) => {
                <option value={recipe._id}>{recipe.name}</option>;
              })}
            </select>
            <button type="Submit">Save</button>
            <button type="button" onClick={() => toggleEditMode()}>
              Cancel
            </button>
          </form>
        ) : (
          <>
            <header>
              <h2>{meal.name}</h2>
              <p>{`${meal.author.username} posted on ${new Date(
                meal.createdAt
              ).toLocaleDateString()}`}</p>
              <p>{meal.details}</p>
            </header>
            <h3>Recipes:</h3>
            <div>
              <Link key={meal.main._id} to={`/recipes/${meal.main._id}`}>
                Main Dish: {meal.main.name}
              </Link>
              <p>Author: {meal.main.author.username}</p>
              <h4>Details:</h4>
              <p>{meal.main.details}</p>
            </div>
            <div>
              <Link key={meal.side1._id} to={`/recipes/${meal.side1._id}`}>
                Side Dish: {meal.side1.name}
              </Link>
              <p>Author: {meal.side1.author.username}</p>
              <h4>Details:</h4>
              <p>{meal.side1.details}</p>
            </div>
            {meal.side2 ? (
              <div>
                <Link key={meal.side2._id} to={`/recipes/${meal.side2._id}`}>
                  Side Dish: {meal.side2.name}
                </Link>
                <p>Author: {meal.side2.author.username}</p>
                <h4>Details:</h4>
                <p>{meal.side2.details}</p>
              </div>
            ) : (
              <></>
            )}
            {meal.author._id === user._id && (
              <>
                <button onClick={handleDeleteMeal}>Delete</button>
                <button onClick={() => toggleEditMode("Meal", meal, mealId)}>
                  Edit
                </button>
              </>
            )}
          </>
        )}
      </section>
      <section>
        <h2>Comments</h2>
        {meal.author._id !== user._id && (
          <>
            <button onClick={() => toggleForm(mealId)}>Comment</button>
            {visibleForm === mealId && (
              <CommentForm
                handleAddComment={(formData) => {
                  handleAddComment(formData);
                  setVisibleForm(null);
                }}
                onCancel={() => toggleForm(mealId)}
              />
            )}
          </>
        )}
        {meal.comments.map((comment) => (
          <article key={comment._id}>
            <header>
              <p>
                {`${comment.author.username} posted on
                ${new Date(comment.createdAt).toLocaleDateString()}`}
              </p>
            </header>
            {editState.isEditing &&
            editState.type === "Comment" &&
            editState.id === comment._id &&
            comment.author._id === user._id ? (
              <div>
                <CommentForm
                  initialText={editState.data.text}
                  handleAddComment={(e) => handleUpdateComment(e, comment._id)}
                  buttonText="Save"
                />
                <button type="button" onClick={() => toggleEditMode()}>
                  Cancel
                </button>
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
                    toggleEditMode("Comment", editState.data, comment._id)
                  }
                >
                  Edit
                </button>
              </>
            )}
            {meal.author._id === user._id && (
              <>
                <button onClick={() => toggleForm(comment._id)}>Reply</button>
                {visibleForm === comment._id && (
                  <CommentForm
                    handleAddComment={(formData) => {
                      handleAddReply(formData);
                      setVisibleForm(null);
                    }}
                    onCancel={() => toggleForm(comment._id)}
                  />
                )}
              </>
            )}
            {comment.reply && comment.reply.length > 0 && (
              <div>
                {comment.reply.map((rep) => (
                  <article key={rep._id}>
                    <header>
                      <p>{`${rep.author.username} posted on ${new Date(
                        rep.createdAt
                      ).toLocaleDateString()}`}</p>
                    </header>
                    {editState.isEditing &&
                    editState.type === "Reply" &&
                    editState.id === rep._id &&
                    comment.author._id === user._id ? (
                      <div>
                        <CommentForm
                          initialText={editState.data.text}
                          handleAddComment={(e) =>
                            handleUpdateReply(e, comment._id, rep._id)
                          }
                          buttonText="Save"
                        />
                        <button type="button" onClick={() => toggleEditMode()}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p>{rep.text}</p>
                    )}
                    {rep.author._id === user._id && (
                      <>
                        <button onClick={() => handleDeleteReply(rep._id)}>
                          Delete
                        </button>
                        <button
                          onClick={() =>
                            toggleEditMode(
                              "Reply",
                              editState.data,
                              rep._id,
                              comment._id
                            )
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

export default MealDetails;
