function Navbar({ setPage, loggedInUser, handleLogout }) {
  return (
    <nav className="navbar">
      <h2>Nairobi Events</h2>

      <div>
        {!loggedInUser && (
          <>
            <button onClick={() => setPage("home")}>Home</button>
            <button onClick={() => setPage("login")}>Login</button>
            <button onClick={() => setPage("register")}>Register</button>
          </>
        )}

        {loggedInUser?.role === "user" && (
          <>
            <button onClick={() => setPage("home")}>Home</button>
            <button onClick={() => setPage("bookings")}>My Bookings</button>
            <button onClick={() => setPage("profile")}>Profile</button>
          </>
        )}

        {loggedInUser?.role === "organizer" && (
          <>
            <button onClick={() => setPage("organizer")}>
              Organizer Dashboard
            </button>
            <button onClick={() => setPage("profile")}>Profile</button>
          </>
        )}

        {loggedInUser?.role === "admin" && (
          <>
            <button onClick={() => setPage("admin")}>Admin Dashboard</button>
            <button onClick={() => setPage("profile")}>Profile</button>
          </>
        )}

        {loggedInUser && (
          <>
            <span className="welcome-text">
              Hi, {loggedInUser.name} ({loggedInUser.role})
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;