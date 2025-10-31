const Landing = () => {
  return (
    <main className="section">
      <div className="container has-text-centered">
        <img src="/bitecraft_logo.png" alt="logo" />
        <p className="subtitle is-5 mb-2">
          BiteCraft helps you discover, share, and manage your favorite recipes
          with ease.
        </p>  <p className="subtitle is-5 mb-5">Join our community to save your culinary creations, explore new
          dishes, and connect with fellow food lovers!
        </p>
        <div className="buttons is-centered pt-3">
          <a href="/sign-up" className="button is-link is-medium">
            Sign Up
          </a>
          <a
            href="/sign-in"
            className="button is-primary is-medium"
          >
            Sign In
          </a>
        </div>
      </div>
    </main>
  );
};

export default Landing;
