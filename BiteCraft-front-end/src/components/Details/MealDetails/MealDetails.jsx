import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import CommentForm from "../../Forms/CommentForm/CommentForm";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import { Link } from "react-router";

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
  const [mealsInCollection, setMealsInCollection] = useState([]);
  const mealId = params.mealId;
  const [visibleForm, setVisibleForm] = useState(null);
  const [addNewComment, setAddNewComment] = useState(false);
  const [sideRecipes, setSideRecipes] = useState([]);
  const [mainRecipes, setMainRecipes] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const mealToShow = await biteCraftService.Show("Meal", mealId);
      setMeal(mealToShow);
      setEditState((prev) => ({
        ...prev,
        data: prev.type === "Meal" ? mealToShow : prev.data,
      }));
      if (mainRecipes.length < 1 || sideRecipes.length < 1) {
        const recipesData = await biteCraftService.Index(
          "RecipeCollection",
          user._id
        );
        if (recipesData.length >= 1) {
          const mains = [...recipesData].filter(
            (recipe) => recipe.category === "Main"
          );
          const sides = [...recipesData].filter(
            (recipe) => recipe.category === "Side"
          );
          setSideRecipes(sides);
          setMainRecipes(mains);
        }
      }
      if (mealsInCollection.length < 1) {
        const mealsToGet = await biteCraftService.Index(
          "MealCollection",
          user._id
        );
        const recipeArray = mealsToGet.map((item) => item._id);
        setMealsInCollection(recipeArray);
      }
    };
    if (!editState.isEditing) {
      getData();
    }
  }, [mealId, editState.isEditing, addNewComment]);

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
      isEditing: !editState.isEditing,
      type,
      data,
      itemId,
      commentId,
    });
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
    const newComment = await biteCraftService.Create(
      "MealComment",
      commentFormData,
      mealId
    );
    toggleNewComment();
    setMeal({ ...meal, comments: [...meal.comments, newComment] });
  };

  const handleUpdateComment = async (formData) => {
    try {
      if (editState.type === "Comment") {
        await biteCraftService.Update(
          "MealComment",
          formData,
          mealId,
          editState.itemId
        );
        setMeal({
          ...meal,
          comments: meal.comments.map((comment) =>
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
    toggleNewComment();
    setMeal({
      ...meal,
      comments: meal.comments.map((comment) =>
        comment._id === commentId ? { ...comment, reply: newReply } : comment
      ),
    });
  };

  const handleUpdateReply = async (formData, commentId) => {
    try {
      if (editState.type === "Reply" && editState.itemId === commentId) {
        await biteCraftService.Update("MealReply", formData, mealId, commentId);
        setMeal({
          ...meal,
          comments: meal.comments.map((comment) =>
            comment._id === commentId
              ? { ...comment, reply: { ...comment.reply, text: formData.text } }
              : comment
          ),
        });
        toggleEditMode();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteReply = async (commentId) => {
    try {
      await biteCraftService.Delete("MealReply", mealId, commentId);
      setMeal({
        ...meal,
        comments: meal.comments.map((comment) =>
          comment._id === commentId ? { ...comment, reply: null } : comment
        ),
      });
    } catch (error) {
      console.log(error);
    }
  };

  // meal handlers
  const handleUpdateMeal = async (event) => {
    event.preventDefault();
    if (!editState.data.main || !editState.data.side1 || !editState.data.side2)
      return;
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
      navigate(`/${user._id}/meals-collection`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCollection = async () => {
    try {
      await biteCraftService.AddToCollection("Meal", meal, user._id);
      navigate(`/${user._id}/meals-collection`);
    } catch (error) {
      console.log(error);
    }
  };

  if (!meal) return <main>Loading...</main>;

  return (
    <main>
      <section>
        {editState.type === "Meal" && editState.isEditing ? (
          mainRecipes.length < 1 || sideRecipes.length < 1 ? (
            <main>
              <h2>Not enough recipes found in your collection!</h2>
              <h3>
                Add some recipes from other users to your collection, or create
                a new recipe! Make sure you have atleast 1 Main and 1 Side recipe.
              </h3>
            </main>
          ) : (
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
                value={editState.data.main ? editState.data.main : ""}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select a Recipe
                </option>
                {mainRecipes.map((recipe, idx) => (
                  <option key={idx} value={recipe._id}>
                    {recipe.name}
                  </option>
                ))}
              </select>
              <label htmlFor="side1-input">Side Dish 1:</label>
              <select
                required
                name="side1"
                id="side1-input"
                value={editState.data.side1 ? editState.data.side1 : ""}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select a Recipe
                </option>
                {sideRecipes.map((recipe, idx) => (
                  <option key={idx} value={recipe._id}>
                    {recipe.name}
                  </option>
                ))}
              </select>
              <label htmlFor="side2-input">Side Dish 2:</label>
              <select
                required
                name="side2"
                id="side2-input"
                value={editState.data.side2 ? editState.data.side2 : ""}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select a Recipe
                </option>
                {sideRecipes.map((recipe, idx) => (
                  <option key={idx} value={recipe._id}>
                    {recipe.name}
                  </option>
                ))}
              </select>
              <button type="Submit">Save</button>
              <button type="button" onClick={() => toggleEditMode()}>
                Cancel
              </button>
            </form>
          )
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
              Main Dish:
              {meal.main ? (
                <Link key={meal.main._id} to={`/recipes/${meal.main._id}`}>
                  {meal.main.name}
                </Link>
              ) : (
                "Recipe is no longer available."
              )}
            </div>
            <div>
              Side Dish:
              {meal.side1 ? (
                <Link key={meal.side1._id} to={`/recipes/${meal.side1._id}`}>
                  {meal.side1.name}
                </Link>
              ) : (
                "Recipe is no longer available."
              )}
            </div>
            <div>
              Side Dish:
              {meal.side2 ? (
                <Link key={meal.side2._id} to={`/recipes/${meal.side2._id}`}>
                  {meal.side2.name}
                </Link>
              ) : (
                "Recipe is no longer available."
              )}
            </div>
            {meal.author._id === user._id &&
              !editState.isEditing &&
              !visibleForm && (
                <>
                  <button onClick={handleDeleteMeal}>Delete</button>
                  <button onClick={() => toggleEditMode("Meal", meal, mealId)}>
                    Edit
                  </button>
                </>
              )}
          </>
        )}
        {!mealsInCollection.includes(mealId) && (
          <button onClick={handleAddToCollection}>Add to Collection</button>
        )}
      </section>
      <section>
        <h2>Comments</h2>
        {meal.author._id !== user._id && (
          <>
            {!visibleForm && !editState.isEditing && (
              <button onClick={() => toggleForm(mealId)}>Comment</button>
            )}
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
        {meal.comments.map((comment, idx) => (
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
                  handleAddComment={(formData, commentId) =>
                    handleUpdateComment(formData, commentId)
                  }
                  buttonText="Save"
                  onCancel={() => toggleEditMode()}
                />
              </div>
            ) : (
              <p>{comment.text}</p>
            )}
            {comment.author._id === user._id &&
              !editState.isEditing &&
              !visibleForm && (
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
            {meal.author._id === user._id && (
              <>
                {!visibleForm && !editState.isEditing && (
                  <button onClick={() => toggleForm(comment._id)}>Reply</button>
                )}
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
            {comment.reply && (
              <article>
                <header>
                  <p>{`${comment.reply.author.username} posted on ${new Date(
                    comment.reply.createdAt
                  ).toLocaleDateString()}`}</p>
                </header>
                {editState.isEditing &&
                editState.type === "Reply" &&
                editState.itemId === comment._id &&
                comment.reply.author._id === user._id ? (
                  <div>
                    <CommentForm
                      initialText={editState.data.text}
                      handleAddComment={(formData) =>
                        handleUpdateReply(formData, comment._id)
                      }
                      buttonText="Save"
                      onCancel={() => toggleEditMode()}
                    />
                  </div>
                ) : (
                  <p>{comment.reply.text}</p>
                )}
                {comment.reply.author._id === user._id &&
                  !editState.isEditing &&
                  !visibleForm && (
                    <>
                      <button onClick={() => handleDeleteReply(comment._id)}>
                        Delete
                      </button>
                      <button
                        onClick={() =>
                          toggleEditMode("Reply", comment.reply, comment._id)
                        }
                      >
                        Edit
                      </button>
                    </>
                  )}
              </article>
            )}
          </article>
        ))}
      </section>
    </main>
  );
};

export default MealDetails;
