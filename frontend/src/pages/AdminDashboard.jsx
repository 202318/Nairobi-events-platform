import { useEffect, useState } from "react";
import API from "../api";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState({
    totalUsers: 0, totalOrganizers: 0,
    totalEvents: 0, totalBookings: 0, totalRevenue: 0,
  });
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => { fetchAllAdminData(); }, []);

  // Fetch each endpoint independently so one failure doesn't wipe everything
  async function fetchAllAdminData() {
  const errs = {};

  try {
    const res = await API.get("/admin/stats");
    setStats(res.data);
  } catch (e) { errs.stats = true; console.error("stats failed:", e.response?.data || e.message); }

  try {
    const res = await API.get("/admin/users");
    setUsers(res.data);
  } catch (e) { errs.users = true; console.error("users failed:", e.response?.data || e.message); }

  try {
    const res = await API.get("/admin/events");
    setEvents(res.data);
  } catch (e) { errs.events = true; console.error("events failed:", e.response?.data || e.message); }

  try {
    const res = await API.get("/admin/bookings");
    setBookings(res.data);
  } catch (e) { errs.bookings = true; console.error("bookings failed:", e.response?.data || e.message); }

  try {
    const res = await API.get("/organizer/pending");
    setPendingApplications(res.data);
  } catch (e) { errs.applications = true; console.error("applications failed:", e.response?.data || e.message); }

  try {
    const res = await API.get("/reviews");
    setReviews(res.data);
  } catch (e) { errs.reviews = true; console.error("reviews failed:", e.response?.data || e.message); }

  setErrors(errs);
}

  async function approveApplication(applicationId) {
    try {
      await API.put(`/organizer/approve/${applicationId}`);
      await fetchAllAdminData();
    } catch {
      alert("Failed to approve organizer application.");
    }
  }

  async function deleteUser(userId) {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      await fetchAllAdminData();
    } catch {
      alert("Failed to delete user.");
    }
  }

  const TABS = [
    { key: "stats",        label: "Overview",      icon: "📊" },
    { key: "users",        label: "Users",         icon: "👥" },
    { key: "applications", label: "Applications",  icon: "📋" },
    { key: "events",       label: "Events",        icon: "📅" },
    { key: "bookings",     label: "Bookings",      icon: "🎟" },
    { key: "reviews",      label: "Reviews",       icon: "⭐" },
  ];

  function ErrorBanner({ section }) {
    if (!errors[section]) return null;
    return (
      <div style={{
        background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 12,
        padding: "14px 18px", marginBottom: 20, color: "#b91c1c",
        fontFamily: "'Manrope', sans-serif", fontSize: 14,
      }}>
        ⚠️ Could not load {section} data — the <code>/api/{section}</code> endpoint may be missing or returning an error.
        Check your backend terminal for details.
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <span className="page-eyebrow">🔐 Admin</span>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Manage users, events, bookings and organizer applications.</p>
        </div>
      </div>

      <div className="page-body">
        <div className="page-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? "tab-btn-active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} {tab.label}
              {tab.key === "applications" && pendingApplications.length > 0 && (
                <span style={{
                  background: "#ff5722", color: "white",
                  fontSize: 10, fontWeight: 800,
                  padding: "1px 6px", borderRadius: 20, marginLeft: 6,
                }}>
                  {pendingApplications.length}
                </span>
              )}
              {errors[tab.key] && (
                <span style={{ marginLeft: 6, fontSize: 12 }}>⚠️</span>
              )}
            </button>
          ))}
        </div>

        {/* STATS */}
        {activeTab === "stats" && (
          <>
            <ErrorBanner section="stats" />
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-card-icon">👥</span>
                <span className="stat-card-label">Total Users</span>
                <span className="stat-card-value">{stats.totalUsers}</span>
              </div>
              <div className="stat-card">
                <span className="stat-card-icon">🎪</span>
                <span className="stat-card-label">Organizers</span>
                <span className="stat-card-value">{stats.totalOrganizers}</span>
              </div>
              <div className="stat-card">
                <span className="stat-card-icon">📅</span>
                <span className="stat-card-label">Total Events</span>
                <span className="stat-card-value">{stats.totalEvents}</span>
              </div>
              <div className="stat-card">
                <span className="stat-card-icon">🎟</span>
                <span className="stat-card-label">Bookings</span>
                <span className="stat-card-value">{stats.totalBookings}</span>
              </div>
              <div className="stat-card">
                <span className="stat-card-icon">💰</span>
                <span className="stat-card-label">Total Revenue</span>
                <span className="stat-card-value" style={{ fontSize: 24 }}>
                  KES {Number(stats.totalRevenue || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <>
            <ErrorBanner section="users" />
            <h2 className="section-heading">All Users ({users.length})</h2>
            {users.length === 0 && !errors.users && (
              <div className="page-empty">
                <span className="page-empty-icon">👥</span>
                <h3>No users yet</h3>
                <p>Users will appear here once people register.</p>
              </div>
            )}
            <div className="data-grid">
              {users.map((user) => (
                <div className="data-card" key={user.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #f0eae0" }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: "linear-gradient(135deg, #7c3aed, #ff5722)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontFamily: "'Fraunces', serif", fontWeight: 700,
                      fontSize: 16, flexShrink: 0,
                    }}>
                      {user.full_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="data-card-title" style={{ margin: 0, border: "none", padding: 0, fontSize: 15 }}>
                        {user.full_name}
                      </p>
                      <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: "#9088a4", margin: 0 }}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="data-card-row">
                    <span className="data-card-key">Role</span>
                    <span className="data-card-val">
                      <span className={`badge ${user.role === "admin" ? "badge-purple" : user.role === "organizer" ? "badge-green" : "badge-gray"}`}>
                        {user.role}
                      </span>
                    </span>
                  </div>
                  <div className="data-card-row">
                    <span className="data-card-key">Verified</span>
                    <span className="data-card-val">
                      <span className={`badge ${user.is_verified ? "badge-green" : "badge-orange"}`}>
                        {user.is_verified ? "Yes" : "Pending"}
                      </span>
                    </span>
                  </div>
                  <div className="data-card-row">
                    <span className="data-card-key">Organizer Status</span>
                    <span className="data-card-val">{user.organizer_status || "—"}</span>
                  </div>
                  {user.role !== "admin" && (
                    <div className="data-card-actions">
                      <button className="danger-button" onClick={() => deleteUser(user.id)}>
                        Delete User
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* APPLICATIONS */}
        {activeTab === "applications" && (
          <>
            <ErrorBanner section="applications" />
            <h2 className="section-heading">Pending Applications ({pendingApplications.length})</h2>
            {pendingApplications.length === 0 && !errors.applications ? (
              <div className="page-empty">
                <span className="page-empty-icon">✅</span>
                <h3>All clear</h3>
                <p>No pending organizer applications right now.</p>
              </div>
            ) : (
              <div className="data-grid">
                {pendingApplications.map((app) => (
                  <div className="data-card" key={app.id}>
                    <p className="data-card-title">{app.organizer_name}</p>
                    <div className="data-card-row">
                      <span className="data-card-key">Applicant</span>
                      <span className="data-card-val">{app.full_name}</span>
                    </div>
                    <div className="data-card-row">
                      <span className="data-card-key">Email</span>
                      <span className="data-card-val" style={{ fontSize: 12 }}>{app.email}</span>
                    </div>
                    <div className="data-card-row">
                      <span className="data-card-key">Event</span>
                      <span className="data-card-val">{app.event_title}</span>
                    </div>
                    <div className="data-card-row">
                      <span className="data-card-key">Category</span>
                      <span className="data-card-val">
                        <span className="badge badge-purple">{app.event_category}</span>
                      </span>
                    </div>
                    <div className="data-card-row">
                      <span className="data-card-key">Location</span>
                      <span className="data-card-val">{app.location}</span>
                    </div>
                    <div className="data-card-row">
                      <span className="data-card-key">Expected Price</span>
                      <span className="data-card-val">KES {Number(app.expected_price || 0).toLocaleString()}</span>
                    </div>
                    <div className="data-card-row">
                      <span className="data-card-key">Attendance</span>
                      <span className="data-card-val">{app.expected_attendance || "—"}</span>
                    </div>
                    {app.sponsors && (
                      <div className="data-card-row">
                        <span className="data-card-key">Sponsors</span>
                        <span className="data-card-val">{app.sponsors}</span>
                      </div>
                    )}
                    <div className="data-card-actions">
                      <button onClick={() => approveApplication(app.id)}>✓ Approve</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* EVENTS */}
        {activeTab === "events" && (
          <>
            <ErrorBanner section="events" />
            <h2 className="section-heading">All Events ({events.length})</h2>
            <div className="data-grid">
              {events.map((event) => (
                <div className="data-card" key={event.id}>
                  <p className="data-card-title">{event.title ?? event.name}</p>
                  <div className="data-card-row">
                    <span className="data-card-key">Category</span>
                    <span className="data-card-val">
                      <span className="badge badge-purple">{event.category}</span>
                    </span>
                  </div>
                  <div className="data-card-row">
                    <span className="data-card-key">Location</span>
                    <span className="data-card-val">{event.location}</span>
                  </div>
                  <div className="data-card-row">
                    <span className="data-card-key">Price</span>
                    <span className="data-card-val">KES {Number(event.price || 0).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* BOOKINGS */}
        {activeTab === "bookings" && (
          <>
            <ErrorBanner section="bookings" />
            <h2 className="section-heading">All Bookings ({bookings.length})</h2>
            {bookings.length === 0 && !errors.bookings && (
              <div className="page-empty">
                <span className="page-empty-icon">🎟</span>
                <h3>No bookings yet</h3>
                <p>Bookings will appear here once users start purchasing tickets.</p>
              </div>
            )}
            <div className="data-grid">
              {bookings.map((booking) => (
                <div className="data-card" key={booking.id}>
                  <p className="data-card-title">{booking.event_name}</p>
                  <div className="data-card-row">
                    <span className="data-card-key">User</span>
                    <span className="data-card-val">{booking.full_name}</span>
                  </div>
                  <div className="data-card-row">
                    <span className="data-card-key">Email</span>
                    <span className="data-card-val" style={{ fontSize: 12 }}>{booking.email}</span>
                  </div>
                  <div className="data-card-row">
                    <span className="data-card-key">Tickets</span>
                    <span className="data-card-val">{booking.quantity}</span>
                  </div>
                  <div className="data-card-row">
                    <span className="data-card-key">Total</span>
                    <span className="data-card-val" style={{ color: "#7c3aed", fontWeight: 800 }}>
                      KES {Number(booking.total_amount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <>
            <ErrorBanner section="reviews" />
            <h2 className="section-heading">All Reviews ({reviews.length})</h2>
            {reviews.length === 0 && !errors.reviews ? (
              <div className="page-empty">
                <span className="page-empty-icon">⭐</span>
                <h3>No reviews yet</h3>
                <p>Reviews will appear here once users start rating events.</p>
              </div>
            ) : (
              <div className="data-grid">
                {reviews.map((review) => (
                  <div className="data-card" key={review.id}>
                    <p className="data-card-title">{review.event_name}</p>
                    <div className="data-card-row">
                      <span className="data-card-key">User</span>
                      <span className="data-card-val">{review.full_name}</span>
                    </div>
                    <div className="data-card-row">
                      <span className="data-card-key">Rating</span>
                      <span className="data-card-val">{"⭐".repeat(review.rating)}</span>
                    </div>
                    {review.review && (
                      <p style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: 13.5, color: "#4b4560",
                        marginTop: 12, lineHeight: 1.55, fontStyle: "italic",
                      }}>
                        "{review.review}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default AdminDashboard;