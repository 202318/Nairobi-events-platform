function Profile({
  loggedInUser,
  bookings,
  deleteAccount,
  setPage,
}) {
  if (!loggedInUser) {
    return (
      <div className="events-section">
        <h2>Please login first.</h2>
      </div>
    );
  }

  const totalTickets = bookings.reduce(
    (sum, booking) => sum + Number(booking.quantity || 0),
    0
  );

  const totalSpent = bookings.reduce(
    (sum, booking) =>
      sum + Number(booking.totalAmount || booking.total_amount || 0),
    0
  );

  return (
    <section className="profile-page-clean">
      <div className="profile-clean-card">
        <div className="profile-title-row">
          <span className="profile-purple-icon">👤</span>
          <h1>{loggedInUser.name}</h1>
        </div>

        <p className="profile-info">
          <strong>Email:</strong> {loggedInUser.email}
        </p>

        <p className="profile-info">
          <strong>Status:</strong>{" "}
          {loggedInUser.organizer_status === "approved"
            ? "Approved Organizer"
            : loggedInUser.organizer_status === "pending"
            ? "Organizer Application Pending"
            : "Normal User"}
        </p>

        <hr className="profile-line" />

        <p className="profile-stat">
          <strong>Total Bookings:</strong> {bookings.length}
        </p>

        <p className="profile-stat">
          <strong>Total Tickets:</strong> {totalTickets}
        </p>

        <p className="profile-stat">
          <strong>Total Amount Spent:</strong> KES {totalSpent}
        </p>

        {loggedInUser.organizer_status === "none" && (
          <button onClick={() => setPage("organizer-application")}>
            Apply to Become Organizer
          </button>
        )}

        {loggedInUser.organizer_status === "pending" && (
          <p className="profile-info">
            Your organizer application is awaiting admin approval.
          </p>
        )}

        {loggedInUser.organizer_status === "approved" && (
          <button onClick={() => setPage("organizer")}>
            Go to Organizer Dashboard
          </button>
        )}

        {loggedInUser.role !== "admin" && (
          <div className="delete-box-clean">
            <button className="delete-btn-clean" onClick={deleteAccount}>
              Delete My Account
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Profile;