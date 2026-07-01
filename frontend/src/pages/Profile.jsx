function Profile({ loggedInUser, bookings, deleteAccount, applyToBecomeOrganizer }) {
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
          <strong>Role:</strong> {loggedInUser.role}
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
        
        {loggedInUser.role === "user" &&
  loggedInUser.organizer_status !== "pending" && (
    <button onClick={applyToBecomeOrganizer}>
      Apply to Become Organizer
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