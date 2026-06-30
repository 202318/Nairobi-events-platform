function EventCard({ event, openEventDetails }) {
  return (
    <div className="event-card">
      <img src={event.image} alt={event.name} className="event-photo" />

      <span className="event-category">{event.category}</span>

      <h3>{event.name}</h3>

      <p>
  <strong>Date:</strong>{" "}
  {new Date(event.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}
</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Price:</strong> {event.price}</p>

      <button onClick={() => openEventDetails(event)}>View Details</button>
    </div>
  );
}

export default EventCard;