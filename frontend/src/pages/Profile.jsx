function Profile({ loggedInUser, bookings }) {
  if (!loggedInUser) {
    return (
      <div className="events-section">
        <h2>Please login first.</h2>
      </div>
    );
  }

  const userBookings = bookings.filter(
    (booking) => booking.userEmail === loggedInUser.email
  );

  const totalTickets = userBookings.reduce(
    (sum, booking) => sum + booking.quantity,
    0
  );

  const totalSpent = userBookings.reduce(
    (sum, booking) => sum + booking.totalAmount,
    0
  );

  return (
    <section className="events-section">

      <h2>My Profile</h2>

      <div className="details-card">

        <h3>👤 {loggedInUser.name}</h3>

        <p>
          <strong>Email:</strong> {loggedInUser.email}
        </p>

        <hr />

        <p>
          <strong>Total Bookings:</strong> {userBookings.length}
        </p>

        <p>
          <strong>Total Tickets:</strong> {totalTickets}
        </p>

        <p>
          <strong>Total Amount Spent:</strong> KES {totalSpent}
        </p>

      </div>

    </section>
  );
}

export default Profile;