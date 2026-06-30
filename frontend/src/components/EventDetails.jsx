function EventDetails({
  selectedEvent,
  ticketQuantity,
  setTicketQuantity,
  getNumericPrice,
  handleBooking,
  setPage,
}) {
  return (
    <section className="event-details">
      <div className="details-card">
       <img
  src={selectedEvent.image}
  alt={selectedEvent.name}
  className="event-photo-large"
/>
        <span className="event-category">{selectedEvent.category}</span>

        <h2>{selectedEvent.name}</h2>

       <p>
  <strong>Date:</strong>{" "}
  {new Date(selectedEvent.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}
</p>
        <p><strong>Location:</strong> {selectedEvent.location}</p>
        <p><strong>Ticket Price:</strong> {selectedEvent.price}</p>
        <p><strong>Description:</strong> {selectedEvent.description}</p>

        <div className="booking-box">
          <h3>Book Tickets</h3>

          <button
            onClick={() =>
              ticketQuantity > 1 && setTicketQuantity(ticketQuantity - 1)
            }
          >
            -
          </button>

          <span className="ticket-count">{ticketQuantity}</span>

          <button onClick={() => setTicketQuantity(ticketQuantity + 1)}>
            +
          </button>

          <p>
            <strong>Total:</strong> KES{" "}
            {getNumericPrice(selectedEvent.price) * ticketQuantity}
          </p>

          <button onClick={handleBooking}>Book Ticket</button>
        </div>

        <button onClick={() => setPage("home")}>Back to Events</button>
      </div>
    </section>
  );
}

export default EventDetails;