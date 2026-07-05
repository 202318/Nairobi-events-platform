function Bookings({ loggedInUser, userBookings, removeBooking }) {
  if (!loggedInUser) {
    return (
      <>
        <div className="page-header">
          <div className="page-header-inner">
            <span className="page-eyebrow">🎟 Tickets</span>
            <h1 className="page-title">My Bookings</h1>
          </div>
        </div>
        <div className="page-body">
          <div className="page-empty">
            <span className="page-empty-icon">🔒</span>
            <h3>You're not logged in</h3>
            <p>Please log in to view your bookings.</p>
          </div>
        </div>
      </>
    );
  }

  const totalSpent = userBookings.reduce(
    (sum, b) => sum + Number(b.totalAmount || b.total_amount || 0), 0
  );
  const totalTickets = userBookings.reduce(
    (sum, b) => sum + Number(b.quantity || 0), 0
  );

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <span className="page-eyebrow">🎟 Tickets</span>
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">
            {userBookings.length === 0
              ? "No events booked yet — discover something happening near you."
              : `${userBookings.length} booking${userBookings.length !== 1 ? "s" : ""} across ${totalTickets} ticket${totalTickets !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      <div className="page-body">
        {userBookings.length === 0 ? (
          <div className="page-empty">
            <span className="page-empty-icon">🎫</span>
            <h3>No bookings yet</h3>
            <p>Head back to the homepage and grab tickets to your first event.</p>
          </div>
        ) : (
          <>
            <div className="stats-grid" style={{ marginBottom: 36 }}>
              <div className="stat-card">
                <span className="stat-card-icon">🎟</span>
                <span className="stat-card-label">Events Booked</span>
                <span className="stat-card-value">{userBookings.length}</span>
              </div>
              <div className="stat-card">
                <span className="stat-card-icon">🪑</span>
                <span className="stat-card-label">Total Tickets</span>
                <span className="stat-card-value">{totalTickets}</span>
              </div>
              <div className="stat-card">
                <span className="stat-card-icon">💳</span>
                <span className="stat-card-label">Total Spent</span>
                <span className="stat-card-value" style={{ fontSize: 26 }}>
                  KES {totalSpent.toLocaleString()}
                </span>
              </div>
            </div>

            <h2 className="section-heading">Your Events</h2>

            <div className="data-grid">
              {userBookings.map((booking) => (
                <div className="booking-card" key={booking.id}>
                  <div className="booking-card-header">
                    <p className="booking-card-title">
                      {booking.eventName || booking.event_name || "Event"}
                    </p>
                    <p className="booking-card-cat">Confirmed booking</p>
                  </div>

                  <div className="booking-card-body">
                    <div className="booking-card-meta">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      {booking.eventDate
                        ? new Date(booking.eventDate).toLocaleDateString("en-GB", {
                            day: "numeric", month: "long", year: "numeric",
                          })
                        : "Date TBC"}
                    </div>

                    <div className="booking-card-meta">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      {booking.eventLocation || booking.location || "Location TBC"}
                    </div>

                    <div className="booking-card-meta">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                      </svg>
                      {booking.quantity} ticket{booking.quantity !== 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="booking-card-footer">
                    <span className="booking-price">
                      KES {Number(booking.totalAmount || booking.total_amount || 0).toLocaleString()}
                    </span>
                    <button
                      className="danger-button"
                      style={{ padding: "9px 16px", fontSize: 13, borderRadius: 10 }}
                      onClick={() => removeBooking(booking.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Bookings;
