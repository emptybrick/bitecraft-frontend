const Footer = ({item}) => {
    return (
      <footer>
        <p>
          {`${item.author.username} posted on
                ${new Date(item.createdAt).toLocaleDateString()}`}
        </p>
      </footer>
    );
};

export default Footer