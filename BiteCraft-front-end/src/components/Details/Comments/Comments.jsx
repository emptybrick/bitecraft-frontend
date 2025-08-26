import { useEffect, useState, useContext } from "react";
import * as biteCraftService from "../../../services/BiteCraftService";
import CommentForm from "../../Forms/CommentForm/CommentForm";
import { UserContext } from "../../../contexts/UserContext";
import Footer from "../../Component/Footer/Footer";

const CommentsAndReplies = ({ item, itemId, type }) => {
  const [visibleForm, setVisibleForm] = useState(null);
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editState, setEditState] = useState({
    isEditing: false,
    type: null,
    itemId: null,
    commentId: null,
    data: null,
  });

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setComments(item.comments);
      setIsLoading(false);
    };
    getData();
  }, [itemId]);

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

  const toggleForm = (id) => {
    setVisibleForm((prev) => (prev === id ? null : id));
  };

  // comment handlers
  const handleAddComment = async (commentFormData) => {
    const newComment = await biteCraftService.Create(
      `${type}Comment`,
      commentFormData,
      itemId
    );
    newComment.author = user;
    newComment.createdAt = new Date().toISOString();
    const updatedComments = [ ...comments, newComment ];
    const sortedComments = updatedComments.sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );
    console.log("sort:", sortedComments)
    setComments(sortedComments);
  };

  const handleUpdateComment = async (formData) => {
    try {
      if (editState.type === "Comment") {
        await biteCraftService.Update(
          `${type}Comment`,
          formData,
          itemId,
          editState.itemId
        );
        setComments(
          comments.map((comment) =>
            comment._id === editState.itemId
              ? { ...comment, text: formData.text }
              : comment
          )
        );
        toggleEditMode();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await biteCraftService.Delete(`${type}Comment`, itemId, commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.log(error);
    }
  };

  // reply handlers
  const handleAddReply = async (commentFormData, commentId) => {
    const newReply = await biteCraftService.Create(
      `${type}Reply`,
      commentFormData,
      itemId,
      commentId
    );
    newReply.author = user;
    newReply.createdAt = new Date();
    setComments(
      comments.map((comment) =>
        comment._id === commentId ? { ...comment, reply: newReply } : comment
      )
    );
  };

  const handleUpdateReply = async (formData, commentId) => {
    try {
      if (editState.type === "Reply" && editState.itemId === commentId) {
        await biteCraftService.Update(
          `${type}Reply`,
          formData,
          itemId,
          commentId
        );
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  reply: { ...comment.reply, text: formData.text },
                }
              : comment
          )
        );
        toggleEditMode();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteReply = async (commentId) => {
    try {
      await biteCraftService.Delete(`${type}Reply`, itemId, commentId);
      setComments(
        comments.map((comment) =>
          comment._id === commentId ? { ...comment, reply: null } : comment
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (!item || isLoading) {
    console.log(comments);
    return <main>Loading...</main>;
  }

  return (
    <section>
      <h2>Comments</h2>
      {item.author._id !== user._id && (
        <>
          {!visibleForm && !editState.isEditing && (
            <button onClick={() => toggleForm(itemId)}>Comment</button>
          )}
          {visibleForm === itemId && (
            <CommentForm
              handleAddComment={(formData) => {
                handleAddComment(formData);
                setVisibleForm(null);
              }}
              onCancel={() => toggleForm(itemId)}
            />
          )}
        </>
      )}
      {comments.map((comment, idx) => (
        <article key={idx}>
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
            <div>
              <p>{comment.text}</p>
              <Footer item={comment} />
            </div>
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
          {item.author._id === user._id && (
            <>
              {!visibleForm && !editState.isEditing && !comment.reply && (
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
                <div>
                  <p>{comment.reply.text}</p>
                  <Footer item={comment.reply} />
                </div>
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
  );
};

export default CommentsAndReplies;
