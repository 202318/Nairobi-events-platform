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

  const totalEvents = organizerEvents.length;
  const upcomingEvents = organizerEvents.filter(
    (e) => new Date(e.date) >= new Date()
  ).length;

  function updateField(field, value) {
    if (isEditing) {
      setEditEvent({ ...editEvent, [field]: value });
    } else {
      setNewEvent({ ...newEvent, [field]: value });
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <span className="page-eyebrow">🎪 Organizer</span>
          <h1 className="page-title">Organizer Dashboard</h1>
          <p className="page-subtitle">Manage your events, track attendance, and grow your audience.</p>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-card-icon">📅</span>
            <span className="stat-card-label">Total Events</span>
            <span className="stat-card-value">{totalEvents}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-icon">⏳</span>
            <span className="stat-card-label">Upcoming</span>
            <span className="stat-card-value">{upcomingEvents}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-icon">🎫</span>
            <span className="stat-card-label">Tickets Sold</span>
            <span className="stat-card-value" style={{ fontSize: 22, color: "#9088a4" }}>
              Soon
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card-icon">💰</span>
            <span className="stat-card-label">Revenue</span>
            <span className="stat-card-value" style={{ fontSize: 22, color: "#9088a4" }}>
              Soon
            </span>
          </div>
        </div>

        {/* Form */}
        <h2 className="section-heading">
          {isEditing ? "Edit Event" : "Add New Event"}
        </h2>

        <div className="form-card">
          <p className="form-title">{isEditing ? `Editing: ${activeEvent.name}` : "Create an Event"}</p>
          <p className="form-subtitle">
            {isEditing
              ? "Update the event details below."
              : "Fill in the details and your event will appear on the platform."}
          </p>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Event Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Nairobi Tech Summit"
                value={activeEvent.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                value={activeEvent.date}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Sarit Centre, Westlands"
                value={activeEvent.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ticket Price (KES)</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. 2500"
                value={activeEvent.price}
                onChange={(e) => updateField("price", e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={activeEvent.category}
              onChange={(e) => updateField("category", e.target.value)}
            >
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Education">Education</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Art">Art</option>
              <option value="Culture">Culture</option>
              <option value="Food & Drink">Food & Drink</option>
              <option value="Fashion">Fashion</option>
              <option value="Community & Charity">Community & Charity</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Tell attendees what to expect…"
              value={activeEvent.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <div className="form-actions">
            {isEditing ? (
              <>
                <button onClick={updateOrganizerEvent}>Update Event</button>
                <button
                  className="danger-button"
                  onClick={() => setEditEvent(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={addOrganizerEvent}>Add Event</button>
            )}
          </div>
        </div>

        {/* Events list */}
        <h2 className="section-heading">My Events</h2>

        {organizerEvents.length === 0 ? (
          <div className="page-empty">
            <span className="page-empty-icon">📭</span>
            <h3>No events yet</h3>
            <p>Use the form above to create your first event.</p>
          </div>
        ) : (
          <div className="data-grid">
            {organizerEvents.map((event) => {
              const isPast = new Date(event.date) < new Date();
              return (
                <div className="data-card" key={event.id}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #f0eae0" }}>
                    <p className="data-card-title" style={{ margin: 0, border: "none", padding: 0 }}>{event.name}</p>
                    <span className={`badge ${isPast ? "badge-gray" : "badge-green"}`}>
                      {isPast ? "Past" : "Upcoming"}
                    </span>
                  </div>

                  <div className="data-card-row">
                    <span className="data-card-key">Date</span>
                    <span className="data-card-val">
                      {new Date(event.date).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="data-card-row">
                    <span className="data-card-key">Location</span>
                    <span className="data-card-val">{event.location}</span>
                  </div>
                  <div className="data-card-row">
                    <span className="data-card-key">Price</span>
                    <span className="data-card-val">KES {event.price}</span>
                  </div>
                  <div className="data-card-row">
                    <span className="data-card-key">Category</span>
                    <span className="data-card-val">
                      <span className="badge badge-purple">{event.category}</span>
                    </span>
                  </div>

                  <div className="data-card-actions">
                    <button onClick={() => setEditEvent(event)}>Edit</button>
                    <button
                      className="danger-button"
                      onClick={() => deleteOrganizerEvent(event.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default OrganizerDashboard;
