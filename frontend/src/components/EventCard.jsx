function EventCard({ event, openEventDetails }) {
  const dateStr = event.date
    ? new Date(event.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date TBC";

  // Extract just day + month for the badge
  const dateParts = event.date ? new Date(event.date) : null;
  const day = dateParts ? dateParts.getDate() : "—";
  const month = dateParts
    ? dateParts.toLocaleDateString("en-GB", { month: "short" }).toUpperCase()
    : "";

  return (
    <article className="ecard" onClick={() => openEventDetails(event)}>
      {/* Image area */}
      <div className="ecard-img-wrap">
        <img
          src={event.image}
          alt={event.name}
          className="ecard-img"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800";
          }}
        />

        {/* Date badge */}
        <div className="ecard-date-badge">
          <span className="ecard-date-day">{day}</span>
          <span className="ecard-date-month">{month}</span>
        </div>

        {/* Category pill over image */}
        <span className="ecard-cat">{event.category}</span>
      </div>

      {/* Body */}
      <div className="ecard-body">
        <h3 className="ecard-title">{event.name}</h3>

        <div className="ecard-meta">
          <span className="ecard-meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {event.location}
          </span>
          <span className="ecard-meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {dateStr}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="ecard-footer">
        <span className="ecard-price">{event.price}</span>
        <span className="ecard-cta">
          Get tickets
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </span>
      </div>
    </article>
  );
}

export default EventCard;
