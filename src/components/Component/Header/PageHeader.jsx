const PageHeader = ({ headerText, userName }) => {
  return (
    <div>
      <h1 className="title has-text-centered pb-6">
        {userName ? `${userName}'s ${headerText}` :  headerText }
      </h1>
    </div>
  );
};

export default PageHeader;
