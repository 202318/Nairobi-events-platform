function Bookings({ loggedInUser, userBookings, removeBooking }) {
  if (!loggedInUser) {
    return (
      <section className="events-section">
        <h2>Please log in to view your bookings.</h2>
      </section>
    );
  }

  if (userBookings.length === 0) {
    return (
      <section className="events-section">
        <h2>My Bookings</h2>
        <p>You have not booked any events yet.</p>
      </section>
    );
  }

  return (
    <section className="events-section">
      <h2>My Bookings</h2>

      <div className="event-grid">
        {userBookings.map((booking) => (
          <div className="event-card" key={booking.id}>

            <h3>{booking.eventName}</h3>

           <p>
  <strong>Date:</strong>{" "}
  {new Date(booking.eventDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}
</p>

            <p>
              <strong>Location:</strong> {booking.eventLocation}
            </p>

            <p>
              <strong>Tickets:</strong> {booking.quantity}
            </p>

            <p>
              <strong>Total Paid:</strong> KES {booking.totalAmount}
            </p>

            <button
              className="danger-button"
              onClick={() => removeBooking(booking.id)}
            >
              Remove Booking
            </button>

          </div>
        ))}
      </div>
    </section>
  );
}

export default Bookings;