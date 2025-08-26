const Header = ({item}) => {
    return (
    <header>
      {item.category ? <h2>{item.category} Dish</h2> : ""}
      <h2>{item.name}</h2>
      <p>{`${item.author.username} posted on ${new Date(
        item.createdAt
      ).toLocaleDateString()}`}</p>
      <p>{item.details}</p>
    </header>
  );
};

export default Header;
