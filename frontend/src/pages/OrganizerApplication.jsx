function OrganizerApplication({
  organizerApplication,
  setOrganizerApplication,
  submitOrganizerApplication,
  setPage,
}) {
  function updateField(field, value) {
    setOrganizerApplication({ ...organizerApplication, [field]: value });
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <span className="page-eyebrow">🎪 Apply</span>
          <h1 className="page-title">Organizer Application</h1>
          <p className="page-subtitle">
            Tell us about the event you want to host. Our team reviews all applications within 48 hours.
          </p>
        </div>
      </div>

      <div className="page-body">
        <div className="form-card">
          <p className="form-title">Event Details</p>
          <p className="form-subtitle">
            Provide as much detail as possible — complete applications are approved faster.
          </p>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Organizer / Organization Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Savannah Productions"
                value={organizerApplication.organizer_name}
                onChange={(e) => updateField("organizer_name", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Event Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Nairobi Jazz Festival"
                value={organizerApplication.event_title}
                onChange={(e) => updateField("event_title", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={organizerApplication.event_category}
                onChange={(e) => updateField("event_category", e.target.value)}
              >
                <option value="">Select a category</option>
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
              <label className="form-label">Proposed Date</label>
              <input
                className="form-input"
                type="date"
                value={organizerApplication.proposed_date}
                onChange={(e) => updateField("proposed_date", e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Event Description</label>
            <textarea
              className="form-textarea"
              placeholder="Describe the event, what attendees can expect, performers, activities…"
              value={organizerApplication.event_description}
              onChange={(e) => updateField("event_description", e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Event Location</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Uhuru Gardens, Nairobi"
                value={organizerApplication.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Expected Ticket Price (KES)</label>
              <input
                className="form-input"
                type="number"
                placeholder="e.g. 1500"
                value={organizerApplication.expected_price}
                onChange={(e) => updateField("expected_price", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Young professionals, 25–40"
                value={organizerApplication.target_audience}
                onChange={(e) => updateField("target_audience", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Expected Attendance</label>
              <input
                className="form-input"
                type="number"
                placeholder="e.g. 500"
                value={organizerApplication.expected_attendance}
                onChange={(e) => updateField("expected_attendance", e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Sponsors (optional)</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Safaricom, KCB Bank"
              value={organizerApplication.sponsors}
              onChange={(e) => updateField("sponsors", e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button onClick={submitOrganizerApplication}>Submit Application</button>
            <button
              className="danger-button"
              onClick={() => setPage("profile")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrganizerApplication;
