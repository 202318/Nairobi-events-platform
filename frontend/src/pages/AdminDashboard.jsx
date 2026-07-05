import { useEffect, useState } from "react";
import API from "../api";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("stats");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  async function fetchAllAdminData() {
    const statsRes = await API.get("/admin/stats");
    const usersRes = await API.get("/admin/users");
    const eventsRes = await API.get("/admin/events");
    const bookingsRes = await API.get("/admin/bookings");
    const appsRes = await API.get("/organizer/pending");
    const reviewsRes = await API.get("/reviews");

    setStats(statsRes.data);
    setUsers(usersRes.data);
    setEvents(eventsRes.data);
    setBookings(bookingsRes.data);
    setPendingApplications(appsRes.data);
    setReviews(reviewsRes.data);
  }

  async function approveApplication(applicationId) {
    try {
      await API.put(`/organizer/approve/${applicationId}`);
      await fetchAllAdminData();
      alert("Organizer application approved successfully.");
    } catch {
      alert("Failed to approve organizer application.");
    }
  }

  async function deleteUser(userId) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/admin/users/${userId}`);
      await fetchAllAdminData();
      alert("User deleted successfully.");
    } catch {
      alert("Failed to delete user.");
    }
  }

  return (
    <section className="events-section">
      <h2>Admin Dashboard</h2>

      <div className="admin-tabs">
        <button onClick={() => setActiveTab("stats")}>Stats</button>
        <button onClick={() => setActiveTab("users")}>Users</button>
        <button onClick={() => setActiveTab("applications")}>Applications</button>
        <button onClick={() => setActiveTab("events")}>Events</button>
        <button onClick={() => setActiveTab("bookings")}>Bookings</button>
        <button onClick={() => setActiveTab("reviews")}>Reviews</button>
      </div>

      {activeTab === "stats" && (
        <div className="event-grid">
          <div className="event-card"><h3>Total Users</h3><p>{stats.totalUsers}</p></div>
          <div className="event-card"><h3>Total Organizers</h3><p>{stats.totalOrganizers}</p></div>
          <div className="event-card"><h3>Total Events</h3><p>{stats.totalEvents}</p></div>
          <div className="event-card"><h3>Total Bookings</h3><p>{stats.totalBookings}</p></div>
          <div className="event-card"><h3>Total Revenue</h3><p>KES {stats.totalRevenue}</p></div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="event-grid">
          {users.map((user) => (
            <div className="event-card" key={user.id}>
              <h3>{user.full_name}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Organizer Status:</strong> {user.organizer_status}</p>

              {user.role !== "admin" && (
                <button className="danger-button" onClick={() => deleteUser(user.id)}>
                  Delete User
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "applications" && (
        pendingApplications.length === 0 ? (
          <p>No pending organizer applications.</p>
        ) : (
          <div className="event-grid">
            {pendingApplications.map((application) => (
              <div className="event-card" key={application.id}>
                <h3>{application.organizer_name}</h3>
                <p><strong>Applicant:</strong> {application.full_name}</p>
                <p><strong>Email:</strong> {application.email}</p>
                <p><strong>Event:</strong> {application.event_title}</p>
                <p><strong>Category:</strong> {application.event_category}</p>
                <p><strong>Description:</strong> {application.event_description}</p>
                <p><strong>Sponsors:</strong> {application.sponsors || "None"}</p>
                <p><strong>Target Audience:</strong> {application.target_audience || "Not specified"}</p>
                <p><strong>Expected Attendance:</strong> {application.expected_attendance || "Not specified"}</p>
                <p><strong>Location:</strong> {application.location}</p>
                <p><strong>Expected Price:</strong> KES {application.expected_price}</p>

                <button onClick={() => approveApplication(application.id)}>
                  Approve Application
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === "events" && (
        <div className="event-grid">
          {events.map((event) => (
            <div className="event-card" key={event.id}>
              <h3>{event.title}</h3>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Price:</strong> KES {event.price}</p>
              <p><strong>Category:</strong> {event.category}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="event-grid">
          {bookings.map((booking) => (
            <div className="event-card" key={booking.id}>
              <h3>{booking.event_name}</h3>
              <p><strong>User:</strong> {booking.full_name}</p>
              <p><strong>Email:</strong> {booking.email}</p>
              <p><strong>Quantity:</strong> {booking.quantity}</p>
              <p><strong>Total:</strong> KES {booking.total_amount}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "reviews" && (
        reviews.length === 0 ? (
          <p>No reviews submitted yet.</p>
        ) : (
          <div className="event-grid">
            {reviews.map((review) => (
              <div className="event-card" key={review.id}>
                <h3>{review.event_name}</h3>
                <p><strong>User:</strong> {review.full_name}</p>
                <p><strong>Rating:</strong> {"⭐".repeat(review.rating)}</p>
                <p><strong>Review:</strong> {review.review}</p>
              </div>
            ))}
          </div>
        )
      )}
    </section>
  );
}

export default AdminDashboard;