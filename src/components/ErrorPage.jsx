const ErrorPage = ({ error, loginHander }) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="error">
      <h2>Something went wrong</h2>
      <p>{error}</p>
      <p>Please try again later.</p>
      <button onClick={handleRefresh}>Refresh</button>
      <button onClick={loginHander}>Log In Bilbo</button>
    </div>
  );
};

export default ErrorPage;
