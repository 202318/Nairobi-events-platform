function OrganizerApplication({
  organizerApplication,
  setOrganizerApplication,
  submitOrganizerApplication,
  setPage,
}) {
  function updateField(field, value) {
    setOrganizerApplication({
      ...organizerApplication,
      [field]: value,
    });
  }

  return (
    <section className="events-section">
      <div className="details-card">
        <h2>Organizer Application</h2>
        <p>Please provide details about the event you want to organize.</p>

        <input
          type="text"
          placeholder="Organizer / Organization Name"
          value={organizerApplication.organizer_name}
          onChange={(e) => updateField("organizer_name", e.target.value)}
        />

        <input
          type="text"
          placeholder="Event Name"
          value={organizerApplication.event_title}
          onChange={(e) => updateField("event_title", e.target.value)}
        />

        <select
          value={organizerApplication.event_category}
          onChange={(e) => updateField("event_category", e.target.value)}
        >
          <option value="">Select Event Category</option>
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

        <textarea
          placeholder="Event Description"
          value={organizerApplication.event_description}
          onChange={(e) => updateField("event_description", e.target.value)}
        />

        <input
          type="text"
          placeholder="Sponsors"
          value={organizerApplication.sponsors}
          onChange={(e) => updateField("sponsors", e.target.value)}
        />

        <input
          type="text"
          placeholder="Target Audience"
          value={organizerApplication.target_audience}
          onChange={(e) => updateField("target_audience", e.target.value)}
        />

        <input
          type="number"
          placeholder="Expected Attendance"
          value={organizerApplication.expected_attendance}
          onChange={(e) => updateField("expected_attendance", e.target.value)}
        />

        <input
          type="date"
          value={organizerApplication.proposed_date}
          onChange={(e) => updateField("proposed_date", e.target.value)}
        />

        <input
          type="text"
          placeholder="Event Location"
          value={organizerApplication.location}
          onChange={(e) => updateField("location", e.target.value)}
        />

        <input
          type="number"
          placeholder="Expected Ticket Price"
          value={organizerApplication.expected_price}
          onChange={(e) => updateField("expected_price", e.target.value)}
        />

        <button onClick={submitOrganizerApplication}>
          Submit Application
        </button>

        <button className="danger-button" onClick={() => setPage("profile")}>
          Cancel
        </button>
      </div>
    </section>
  );
}

export default OrganizerApplication;