function Navbar({ setPage, loggedInUser, handleLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => setPage("home")}>
        <div className="navbar-logo">
          <div className="navbar-logo-dots">
            <div className="navbar-logo-dot" />
            <div className="navbar-logo-dot" />
            <div className="navbar-logo-dot" />
          </div>
        </div>
        <h2>Nairobi Events</h2>
      </div>

      <div className="navbar-links">
        {!loggedInUser && (
          <>
            <button onClick={() => setPage("home")}>Home</button>
            <button onClick={() => setPage("login")}>Login</button>
            <button onClick={() => setPage("register")}>Register</button>
          </>
        )}

        {loggedInUser && loggedInUser.role !== "admin" && (
          <>
            <button onClick={() => setPage("home")}>Home</button>
            <button onClick={() => setPage("bookings")}>My Bookings</button>
            {loggedInUser.organizer_status === "approved" && (
              <button onClick={() => setPage("organizer")}>Dashboard</button>
            )}
            <button onClick={() => setPage("profile")}>Profile</button>
          </>
        )}

        {loggedInUser?.role === "admin" && (
          <>
            <button onClick={() => setPage("admin")}>Admin</button>
            <button onClick={() => setPage("profile")}>Profile</button>
          </>
        )}

        {loggedInUser && (
          <>
            <span className="welcome-text">Hi, {loggedInUser.name}</span>
            <button className="navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
