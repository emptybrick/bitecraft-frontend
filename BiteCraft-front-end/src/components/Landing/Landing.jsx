// need logo and text logo to add

const Landing = () => {
  return (
    <main className="section has-background-light">
      <div className="container has-text-centered">
        {/* Logo placeholder
        <img
          src=""
          alt=""
        />
        Text logo or app name */}
        <h1 className="title is-2 has-text-primary mb-4">Welcome to BiteCraft</h1>
        <p className="subtitle is-5 has-text-grey mb-5">
          BiteCraft helps you discover, share, and manage your favorite recipes with ease.<br />
          Join our community to save your culinary creations, explore new dishes, and connect with fellow food lovers!
        </p>
        <div className="buttons is-centered">
          <a href="/signup" className="button is-primary is-medium">Sign Up</a>
          <a href="/login" className="button is-medium">Sign In</a>
        </div>
      </div>
    </main>
  );
};

export default Landing;
