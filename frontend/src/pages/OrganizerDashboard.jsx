function OrganizerDashboard({
  organizerEvents,
  newEvent,
  setNewEvent,
  addOrganizerEvent,
  deleteOrganizerEvent,
  editEvent,
  setEditEvent,
  updateOrganizerEvent,
}) {
  const activeEvent = editEvent || newEvent;
  const isEditing = Boolean(editEvent);

  function updateField(field, value) {
    if (isEditing) {
      setEditEvent({ ...editEvent, [field]: value });
    } else {
      setNewEvent({ ...newEvent, [field]: value });
    }
  }

  return (
    <section className="events-section">
      <h2>Organizer Dashboard</h2>

      <div className="details-card">
        <h3>{isEditing ? "Edit Event" : "Add New Event"}</h3>

        <input
          type="text"
          placeholder="Event name"
          value={activeEvent.name}
          onChange={(e) => updateField("name", e.target.value)}
        />

        <input
          type="text"
          placeholder="Date e.g. 2026-08-10"
          value={activeEvent.date}
          onChange={(e) => updateField("date", e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          value={activeEvent.location}
          onChange={(e) => updateField("location", e.target.value)}
        />

        <input
          type="text"
          placeholder="Price e.g. 1500"
          value={activeEvent.price}
          onChange={(e) => updateField("price", e.target.value)}
        />

        <select
          value={activeEvent.category}
          onChange={(e) => updateField("category", e.target.value)}
        >
          <option>Technology</option>
          <option>Music</option>
          <option>Sports</option>
          <option>Business</option>
          <option>Education</option>
        </select>

        <textarea
          placeholder="Event description"
          value={activeEvent.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
        />

        {isEditing ? (
          <>
            <button onClick={updateOrganizerEvent}>Update Event</button>
            <button className="danger-button" onClick={() => setEditEvent(null)}>
              Cancel Edit
            </button>
          </>
        ) : (
          <button onClick={addOrganizerEvent}>Add Event</button>
        )}
      </div>

      <h2>My Created Events</h2>

      {organizerEvents.length === 0 ? (
        <p>No organizer events created yet.</p>
      ) : (
        <div className="event-grid">
          {organizerEvents.map((event) => (
            <div className="event-card" key={event.id}>
              <h3>{event.name}</h3>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Price:</strong> KES {event.price}</p>
              <p><strong>Category:</strong> {event.category}</p>

              <button onClick={() => setEditEvent(event)}>Edit Event</button>

              <button
                className="danger-button"
                onClick={() => deleteOrganizerEvent(event.id)}
              >
                Delete Event
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default OrganizerDashboard;