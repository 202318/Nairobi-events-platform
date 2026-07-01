import { useEffect, useState } from "react";
import API from "../api";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  const [pendingOrganizers, setPendingOrganizers] = useState([]);

  useEffect(() => {
    fetchAdminStats();
    fetchPendingOrganizers();
  }, []);

  async function fetchAdminStats() {
    try {
      const response = await API.get("/admin/stats");
      setStats(response.data);
    } catch (error) {
      console.log("Failed to load admin stats", error);
    }
  }

  async function fetchPendingOrganizers() {
    try {
      const response = await API.get("/admin/pending-organizers");
      setPendingOrganizers(response.data);
    } catch (error) {
      console.log("Failed to load pending organizers", error);
    }
  }

  async function approveOrganizer(userId) {
    try {
      await API.put(`/auth/approve-organizer/${userId}`);

      await fetchAdminStats();
      await fetchPendingOrganizers();

      alert("Organizer approved successfully.");
    } catch (error) {
      alert("Failed to approve organizer.");
    }
  }

  return (
    <section className="events-section">
      <h2>Admin Dashboard</h2>

      <div className="event-grid">
        <div className="event-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>

        <div className="event-card">
          <h3>Total Organizers</h3>
          <p>{stats.totalOrganizers}</p>
        </div>

        <div className="event-card">
          <h3>Total Events</h3>
          <p>{stats.totalEvents}</p>
        </div>

        <div className="event-card">
          <h3>Total Bookings</h3>
          <p>{stats.totalBookings}</p>
        </div>

        <div className="event-card">
          <h3>Total Revenue</h3>
          <p>KES {stats.totalRevenue}</p>
        </div>
      </div>

      <h2>Pending Organizer Applications</h2>

      {pendingOrganizers.length === 0 ? (
        <p>No pending organizer applications.</p>
      ) : (
        <div className="event-grid">
          {pendingOrganizers.map((user) => (
            <div className="event-card" key={user.id}>
              <h3>{user.full_name}</h3>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Status:</strong> {user.organizer_status}
              </p>

              <button onClick={() => approveOrganizer(user.id)}>
                Approve Organizer
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminDashboard;