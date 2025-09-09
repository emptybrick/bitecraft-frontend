import { useEffect, useState, useContext } from "react";
import * as biteCraftService from "../../../services/BiteCraftService";
import { UserContext } from "../../../contexts/UserContext";
import CommentsFooter from "../Footer/CommentsFooter";
import Button from "../Button/Button";
import CommentForm from "../../Forms/CommentForm/CommentForm";

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

  const handleAddComment = async (commentFormData) => {
    const newComment = await biteCraftService.Create(
      `${type}Comment`,
      commentFormData,
      itemId
    );
    newComment.author = user;
    newComment.createdAt = newComment.updatedAt = new Date().toISOString();
    const updatedComments = [...comments, newComment];
    const sortedComments = updatedComments.sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );
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

  const handleAddReply = async (commentFormData, commentId) => {
    const newReply = await biteCraftService.Create(
      `${type}Reply`,
      commentFormData,
      itemId,
      commentId
    );
    newReply.author = user;
    newReply.createdAt = newReply.updatedAt = new Date().toISOString();
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
    <div className="box mt-4">
      <h2 className="subtitle is-4 has-text-centered has-text-weight-bold">
        Comments
      </h2>
      <div className="content">
        {comments.map((comment, idx) => (
          <article className="media" key={idx}>
            <div className="media-content">
              <div className="box">
                <div className="box">
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
                      <p className="has-text-weight-bold">
                        {comment.author.username}
                      </p>
                      <p>{comment.text}</p>
                    </div>
                  )}
                  <div className="level is-align-items-center mt-4">
                    <div className="level-left">
                      <div className="buttons mb-0">
                        {!visibleForm &&
                          !editState.isEditing &&
                          !comment.reply &&
                          comment.author._id !== user._id && (
                            <Button
                              onClick={() => toggleForm(comment._id)}
                              buttonText="Reply"
                            />
                          )}
                        {comment.author._id === user._id &&
                          !editState.isEditing &&
                          !visibleForm && (
                            <>
                              <Button
                                onClick={() => handleDeleteComment(comment._id)}
                                buttonText="Delete"
                              />
                              <Button
                                onClick={() =>
                                  toggleEditMode(
                                    "Comment",
                                    comment,
                                    comment._id
                                  )
                                }
                                buttonText="Edit"
                              />
                            </>
                          )}
                      </div>
                    </div>
                    <div className="level-right">
                      <CommentsFooter item={comment} />
                    </div>
                  </div>
                </div>
                {item.author._id === user._id && (
                  <>
                    {visibleForm === comment._id && (
                      <div className="box">
                        <CommentForm
                          handleAddComment={(formData) => {
                            handleAddReply(formData, comment._id);
                            setVisibleForm(null);
                          }}
                          onCancel={() => toggleForm(comment._id)}
                        />
                      </div>
                    )}
                  </>
                )}
                {comment.reply && (
                  <article className="media ml-6">
                    <div className="media-content ml-4">
                      <div className="box">
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
                            <p className="has-text-weight-bold">
                              {comment.reply.author.username}
                            </p>
                            <p>{comment.reply.text}</p>
                            <CommentsFooter item={comment.reply} />
                          </div>
                        )}
                        {comment.reply.author._id === user._id &&
                          !editState.isEditing &&
                          !visibleForm && (
                            <div className="level is-align-items-center mt-4">
                              <div className="level-left">
                                <div className="buttons mb-0">
                                  <Button
                                    onClick={() =>
                                      handleDeleteReply(comment._id)
                                    }
                                    buttonText="Delete"
                                  />
                                  <Button
                                    onClick={() =>
                                      toggleEditMode(
                                        "Reply",
                                        comment.reply,
                                        comment._id
                                      )
                                    }
                                    buttonText="Edit"
                                  />
                                </div>
                              </div>
                              <div className="level-right">
                                <CommentsFooter item={comment.reply} />
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </article>
                )}
              </div>
            </div>
          </article>
        ))}
        {item.author._id !== user._id && (
          <>
            {!visibleForm && !editState.isEditing && (
              <div className="has-text-centered">
                <Button
                  onClick={() => toggleForm(itemId)}
                  buttonText="Add New Comment"
                />
              </div>
            )}
            {visibleForm === itemId && (
              <div className="box">
                <CommentForm
                  handleAddComment={(formData) => {
                    handleAddComment(formData);
                    setVisibleForm(null);
                  }}
                  onCancel={() => toggleForm(itemId)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentsAndReplies;
