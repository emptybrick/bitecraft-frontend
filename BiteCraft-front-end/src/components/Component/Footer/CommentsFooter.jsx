const CommentsFooter = ({ item }) => {
  return (
    <div>
      <p className="has-text-right has-text-grey mb-0">
        {`Posted on
                ${new Date(item.createdAt).toLocaleDateString()}`}
      </p>
      <p className="has-text-right has-text-grey">
        {`Last Updated on
                ${new Date(item.updatedAt).toLocaleDateString()}`}
      </p>
    </div>
  );
};

export default CommentsFooter;
