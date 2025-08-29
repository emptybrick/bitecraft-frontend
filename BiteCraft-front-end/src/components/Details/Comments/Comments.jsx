import { useEffect, useState, useContext } from "react";
import * as biteCraftService from "../../../services/BiteCraftService";
import CommentForm from "../../Forms/CommentForm/CommentForm";
import { UserContext } from "../../../contexts/UserContext";
import Footer from "../../Component/Footer/Footer";
import Button from "../../Component/Button/Button";

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
    newComment.createdAt = newComment.updatedAt = new Date().toISOString();
    const updatedComments = [...comments, newComment];
    const sortedComments = updatedComments.sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );
    console.log("sort:", sortedComments);
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
    <section>
      <div className="container">
        <div className="box">
          <h2 className="subtitle is-4 has-text-centered has-text-weight-bold is-underlined">
            Comments
          </h2>
          <div className="content">
            {comments.map((comment, idx) => (
              <article className="media ml-5 mr-5" key={idx}>
                <div className="media-content ml-2 mr-2">
                  <div className="box has-background-light">
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
                      {!visibleForm &&
                        !editState.isEditing &&
                        !comment.reply &&
                        comment.author._id !== user._id && (
                          <Button
                            className="button is-small is-info is-light mt-4"
                            onClick={() => toggleForm(comment._id)}
                            buttonText="Reply"
                          />
                        )}
                      {comment.author._id === user._id &&
                        !editState.isEditing &&
                        !visibleForm && (
                          <div className="level is-align-items-center mt-6">
                            <div className="level-left">
                              <div className="buttons mb-0">
                                <Button
                                  className="button is-small is-danger is-light"
                                  onClick={() =>
                                    handleDeleteComment(comment._id)
                                  }
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
                                  className="button is-small is-warning is-light"
                                  buttonText="Edit"
                                />
                              </div>
                            </div>
                            <div className="level-right">
                              <Footer item={comment} />
                            </div>
                          </div>
                        )}
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
                              </div>
                            )}
                            {comment.reply.author._id === user._id &&
                              !editState.isEditing &&
                              !visibleForm && (
                                <div className="level is-align-items-center mt-4">
                                  <div className="level-left">
                                    <div className="buttons mb-0">
                                      <Button
                                        className="button is-small is-danger is-light"
                                        onClick={() =>
                                          handleDeleteReply(comment._id)
                                        }
                                        buttonText="Delete"
                                      />
                                      <Button
                                        className="button is-small is-warning is-light"
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
                                    <Footer item={comment.reply} />
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
                      className="button is-medium is-info"
                    />
                  </div>
                )}
                {visibleForm === itemId && (
                  <div className="box has-background-light">
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
      </div>
    </section>
  );
};

export default CommentsAndReplies;
