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

  const [pendingApplications, setPendingApplications] = useState([]);

  useEffect(() => {
    fetchAdminStats();
    fetchPendingApplications();
  }, []);

  async function fetchAdminStats() {
    try {
      const response = await API.get("/admin/stats");
      setStats(response.data);
    } catch (error) {
      console.log("Failed to load admin stats", error);
    }
  }

  async function fetchPendingApplications() {
    try {
      const response = await API.get("/organizer/pending");
      setPendingApplications(response.data);
    } catch (error) {
      console.log("Failed to load organizer applications", error);
    }
  }

  async function approveApplication(applicationId) {
    try {
      await API.put(`/organizer/approve/${applicationId}`);

      await fetchAdminStats();
      await fetchPendingApplications();

      alert("Organizer application approved successfully.");
    } catch (error) {
      alert("Failed to approve organizer application.");
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

      {pendingApplications.length === 0 ? (
        <p>No pending organizer applications.</p>
      ) : (
        <div className="event-grid">
          {pendingApplications.map((application) => (
            <div className="event-card" key={application.id}>
              <h3>{application.organizer_name}</h3>

              <p>
                <strong>Applicant:</strong> {application.full_name}
              </p>

              <p>
                <strong>Email:</strong> {application.email}
              </p>

              <p>
                <strong>Event Name:</strong> {application.event_title}
              </p>

              <p>
                <strong>Category:</strong> {application.event_category}
              </p>

              <p>
                <strong>Description:</strong> {application.event_description}
              </p>

              <p>
                <strong>Sponsors:</strong> {application.sponsors || "None"}
              </p>

              <p>
                <strong>Target Audience:</strong>{" "}
                {application.target_audience || "Not specified"}
              </p>

              <p>
                <strong>Expected Attendance:</strong>{" "}
                {application.expected_attendance || "Not specified"}
              </p>

              <p>
                <strong>Proposed Date:</strong>{" "}
                {application.proposed_date
                  ? new Date(application.proposed_date).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "Not specified"}
              </p>

              <p>
                <strong>Location:</strong> {application.location}
              </p>

              <p>
                <strong>Expected Price:</strong> KES{" "}
                {application.expected_price}
              </p>

              <button onClick={() => approveApplication(application.id)}>
                Approve Application
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminDashboard;