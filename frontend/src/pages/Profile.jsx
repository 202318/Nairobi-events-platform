function Profile({ loggedInUser, bookings, deleteAccount, setPage }) {
  if (!loggedInUser) {
    return (
      <>
        <div className="page-header">
          <div className="page-header-inner">
            <span className="page-eyebrow">👤 Account</span>
            <h1 className="page-title">Profile</h1>
          </div>
        </div>
        <div className="page-body">
          <div className="page-empty">
            <span className="page-empty-icon">🔒</span>
            <h3>Not logged in</h3>
            <p>Please log in to view your profile.</p>
          </div>
        </div>
      </>
    );
  }

  const totalTickets = bookings.reduce(
    (sum, b) => sum + Number(b.quantity || 0), 0
  );
  const totalSpent = bookings.reduce(
    (sum, b) => sum + Number(b.totalAmount || b.total_amount || 0), 0
  );

  const initials = loggedInUser.name
    ? loggedInUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  function statusBadge() {
    const s = loggedInUser.organizer_status;
    if (s === "approved") return <span className="badge badge-green">Approved Organizer</span>;
    if (s === "pending")  return <span className="badge badge-orange">Application Pending</span>;
    return <span className="badge badge-gray">Standard User</span>;
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <span className="page-eyebrow">👤 Account</span>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your account and track your event history.</p>
        </div>
      </div>

      <div className="page-body">
        <div className="profile-wrap">

          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-sidebar-header">
              <div className="profile-avatar">{initials}</div>
              <p className="profile-name">{loggedInUser.name}</p>
              <p className="profile-email">{loggedInUser.email}</p>
            </div>

            <div className="profile-sidebar-body">
              <div className="profile-row">
                <span className="profile-row-key">Role</span>
                <span className="profile-row-val" style={{ textTransform: "capitalize" }}>
                  {loggedInUser.role}
                </span>
              </div>
              <div className="profile-row">
                <span className="profile-row-key">Status</span>
                <span className="profile-row-val">{statusBadge()}</span>
              </div>
              <div className="profile-row">
                <span className="profile-row-key">Member since</span>
                <span className="profile-row-val">2026</span>
              </div>
            </div>

            <div className="profile-actions">
              {loggedInUser.organizer_status === "none" && (
                <button onClick={() => setPage("organizer-application")}>
                  Apply as Organizer
                </button>
              )}
              {loggedInUser.organizer_status === "approved" && (
                <button onClick={() => setPage("organizer")}>
                  Organizer Dashboard
                </button>
              )}
              {loggedInUser.organizer_status === "pending" && (
                <p style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 13,
                  color: "#9088a4",
                  textAlign: "center",
                  margin: 0,
                  padding: "8px 0",
                }}>
                  Application under review
                </p>
              )}

              {loggedInUser.role !== "admin" && (
                <div className="danger-zone" style={{ margin: 0, padding: "16px" }}>
                  <h4 style={{ fontSize: 14, marginBottom: 6 }}>Danger zone</h4>
                  <p style={{ fontSize: 12, marginBottom: 12 }}>
                    Permanently delete your account and all data.
                  </p>
                  <button
                    className="danger-button"
                    style={{ width: "100%", padding: "10px", fontSize: 13 }}
                    onClick={deleteAccount}
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main */}
          <div className="profile-main">
            <h2 className="section-heading" style={{ marginTop: 0 }}>Activity Summary</h2>

            <div className="profile-stat-grid">
              <div className="stat-card">
                <span className="stat-card-icon">🎟</span>
                <span className="stat-card-label">Events Booked</span>
                <span className="stat-card-value">{bookings.length}</span>
              </div>
              <div className="stat-card">
                <span className="stat-card-icon">🪑</span>
                <span className="stat-card-label">Total Tickets</span>
                <span className="stat-card-value">{totalTickets}</span>
              </div>
              <div className="stat-card">
                <span className="stat-card-icon">💳</span>
                <span className="stat-card-label">Total Spent</span>
                <span className="stat-card-value" style={{ fontSize: 24 }}>
                  KES {totalSpent.toLocaleString()}
                </span>
              </div>
              <div className="stat-card" style={{width:'250px', display:'-ms-flexbox'}} >
                <span className="stat-card-icon">🎊</span>
                <span className="stat-card-label">Become an Organizer</span>
              </div>
            </div>

            {bookings.length > 0 && (
              <>
                <h2 className="section-heading">Recent Bookings</h2>
                <div className="data-grid">
                  {bookings.slice(0, 4).map((b) => (
                    <div className="data-card" key={b.id}>
                      <p className="data-card-title">
                        {b.eventName || b.event_name || "Event"}
                      </p>
                      <div className="data-card-row">
                        <span className="data-card-key">Tickets</span>
                        <span className="data-card-val">{b.quantity}</span>
                      </div>
                      <div className="data-card-row">
                        <span className="data-card-key">Paid</span>
                        <span className="data-card-val">
                          KES {Number(b.totalAmount || b.total_amount || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {bookings.length > 4 && (
                  <button
                    onClick={() => setPage("bookings")}
                    style={{
                      background: "transparent",
                      border: "1.5px solid #7c3aed",
                      color: "#7c3aed",
                      marginTop: 8,
                      padding: "11px 22px",
                      borderRadius: 30,
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    View all {bookings.length} bookings →
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
