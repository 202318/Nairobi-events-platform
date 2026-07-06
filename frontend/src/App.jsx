import { useEffect, useState } from "react";
import "./App.css";

import API from "./api";

import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminLogin from "./components/AdminLogin";
import EventDetails from "./components/EventDetails";

import Home from "./pages/Home";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import OrganizerApplication from "./pages/OrganizerApplication";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  // ── ROUTING ──
  const [page, setPage] = useState("home");

  // ── AUTH ──
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  // ── EVENTS ──
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ── BOOKINGS ──
  const [bookings, setBookings] = useState([]);

  // ── ORGANIZER ──
  const [organizerEvents, setOrganizerEvents] = useState([]);

  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    location: "",
    price: "",
    category: "Technology",
    description: "",
  });

  const [editEvent, setEditEvent] = useState(null);

  const [organizerApplication, setOrganizerApplication] = useState({
    organizer_name: "",
    event_title: "",
    event_category: "",
    event_description: "",
    sponsors: "",
    target_audience: "",
    expected_attendance: "",
    proposed_date: "",
    location: "",
    expected_price: "",
  });

  // ── TOAST ──
  const [message, setMessage] = useState({ text: "", type: "" });

  // ── ON MOUNT ──
  useEffect(() => {
    fetchEvents();
  }, []);

  // ─────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────

  function showMessage(text, type = "success") {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3500);
  }

  function getNumericPrice(price) {
    if (!price) return 0;
    return Number(price.toString().replace(/KES\s?/, "").replace(/,/g, ""));
  }

  // ─────────────────────────────────────────
  // EVENTS
  // ─────────────────────────────────────────

  async function fetchEvents() {
    try {
      const response = await API.get("/events");
      const mapped = response.data.map((e) => ({
        id: e.id,
        name: e.title ?? e.name,
        date: e.event_date ?? e.date,
        location: e.location,
        price: e.price
          ? `KES ${Number(e.price).toLocaleString()}`
          : e.price,
        category: e.category_name ?? e.category ?? "General",
        description: e.description,
        image:
          e.image ||
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
      }));
      setEvents(mapped);
    } catch {
      showMessage("Failed to load events.", "error");
    }
  }

  const filteredEvents = events.filter((event) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      event.name?.toLowerCase().includes(search) ||
      event.location?.toLowerCase().includes(search) ||
      event.date?.toString().toLowerCase().includes(search) ||
      event.category?.toLowerCase().includes(search);
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  function handleSearch() {
    setSearchTerm(searchInput);
  }

  function clearSearch() {
    setSearchInput("");
    setSearchTerm("");
    setSelectedCategory("All");
  }

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        full_name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
      });

      setRegisterForm({
        name: "",
        email: "",
        password: "",
      });

      setPage("verify-email");
      showMessage(
  "Account created. Please check your email and verify your account before logging in.",
  "success"
);
    } catch (error) {
      console.log("REGISTER ERROR:", error.response?.data || error.message);
      showMessage(error.response?.data?.message || "Registration failed.", "error");
    }
  }

 async function handleLogin(e) {
  e.preventDefault();

  try {
    const response = await API.post("/auth/login", {
      email: loginForm.email,
      password: loginForm.password,
    });

    const user = response.data.user;

    const loggedUser = {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: user.role,
      organizer_status: user.organizer_status,
    };

    const isAdminLoginPage = window.location.pathname === "/admin-login";

    if (isAdminLoginPage && loggedUser.role !== "admin") {
      showMessage("Only admin can login from this page.", "error");
      return;
    }

    if (!isAdminLoginPage && loggedUser.role === "admin") {
      showMessage("Please use the admin login URL.", "warning");
      return;
    }

    setLoggedInUser(loggedUser);
    localStorage.setItem("loggedInUser", JSON.stringify(loggedUser));

    setLoginForm({
      email: "",
      password: "",
    });

    if (loggedUser.role === "admin") {
      setPage("admin");
    } else {
      setPage("home");
      fetchUserBookings(loggedUser.id);
    }

    showMessage(`Welcome, ${loggedUser.name}. Login successful.`, "success");
  } catch (error) {
    showMessage("Invalid email or password.", "error");
  }
}
 function handleLogout() {
  setLoggedInUser(null);
  localStorage.removeItem("loggedInUser");
  setSelectedEvent(null);
  setBookings([]);

  if (window.location.pathname === "/admin-login") {
    setPage("admin-login");
  } else {
    setPage("home");
  }

  showMessage("You have logged out successfully.", "info");
}

  function openEventDetails(event) {
    setSelectedEvent(event);
    setTicketQuantity(1);
    setPage("details");
  }

  // ─────────────────────────────────────────
  // AUTH
  // ─────────────────────────────────────────

  async function handleRegister(e) {
    e.preventDefault();
    try {
      await API.post("/auth/register", {
        full_name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        role: registerForm.role,
      });
      setRegisterForm({ name: "", email: "", password: "", role: "user" });
      setPage("login");
      showMessage("Account created — you can now log in.", "success");
    } catch {
      showMessage("Registration failed. Email may already be in use.", "error");
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await API.post("/auth/login", {
        email: loginForm.email,
        password: loginForm.password,
        role: loginForm.role,
      });

      const user = response.data.user;
      const loggedUser = {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        organizer_status: user.organizer_status ?? "none",
      };

      setLoggedInUser(loggedUser);
      setLoginForm({ email: "", password: "", role: "user" });
      showMessage(`Welcome back, ${loggedUser.name}!`, "success");

      // ── ROUTE BY ROLE ──
      if (loggedUser.role === "admin") {
        setPage("admin");
      } else if (loggedUser.role === "organizer") {
        await fetchOrganizerEvents(loggedUser.id);
        setPage("organizer");
      } else {
        await fetchUserBookings(loggedUser.id);
        setPage("home");
      }
    } catch {
      showMessage("Invalid email, password or role.", "error");
    }
  }

  function handleLogout() {
    setLoggedInUser(null);
    setSelectedEvent(null);
    setBookings([]);
    setOrganizerEvents([]);
    setPage("home");
    showMessage("You have been logged out.", "info");
  }

  async function deleteAccount() {
    if (!window.confirm("Delete your account? This cannot be undone.")) return;
    try {
      await API.delete(`/admin/users/${loggedInUser.id}`);
      handleLogout();
      showMessage("Your account has been deleted.", "info");
    } catch {
      showMessage("Failed to delete account.", "error");
    }
  }

  // ─────────────────────────────────────────
  // BOOKINGS
  // ─────────────────────────────────────────

  async function fetchUserBookings(userId) {
    try {
      const response = await API.get(`/bookings/user/${userId}`);
      setBookings(response.data);
    } catch {
      showMessage("Failed to load bookings.", "error");
    }
  }

  async function handleBooking() {
    if (!loggedInUser) {
      setPage("login");
      showMessage("Please log in before booking.", "warning");
      return;
    }
    try {
      await API.post("/bookings", {
        user_id: loggedInUser.id,
        event_id: selectedEvent.id,
        quantity: ticketQuantity,
        total_amount: getNumericPrice(selectedEvent.price) * ticketQuantity,
      });
      await fetchUserBookings(loggedInUser.id);
      setTicketQuantity(1);
      setPage("bookings");
      showMessage("Ticket booked successfully.", "success");
    } catch {
      showMessage("Booking failed. Please try again.", "error");
    }
  }

  async function removeBooking(bookingId) {
    try {
      await API.delete(`/bookings/${bookingId}`);
      setBookings(bookings.filter((b) => b.id !== bookingId));
      showMessage("Booking removed.", "info");
    } catch {
      showMessage("Failed to remove booking.", "error");
    }
  }

  // ─────────────────────────────────────────
  // ORGANIZER
  // ─────────────────────────────────────────

  async function fetchOrganizerEvents(organizerId) {
    try {
      const response = await API.get(`/events/organizer/${organizerId}`);
      const mapped = response.data.map((e) => ({
        id: e.id,
        name: e.title ?? e.name,
        date: e.event_date ?? e.date,
        location: e.location,
        price: e.price,
        category: e.category_name ?? e.category ?? "General",
        description: e.description,
        image: e.image,
      }));
      setOrganizerEvents(mapped);
    } catch {
      showMessage("Failed to load your events.", "error");
    }
  }

  const CATEGORY_MAP = {
    Technology: 1, Music: 2, Sports: 3, Business: 4, Education: 5,
    Art: 6, Culture: 7, "Food & Drink": 8, Fashion: 9, "Community & Charity": 10,
  };

  async function addOrganizerEvent() {
    if (!loggedInUser || loggedInUser.role !== "organizer") {
      showMessage("Only organizers can add events.", "warning");
      return;
    }
    if (!newEvent.name || !newEvent.date || !newEvent.location || !newEvent.price) {
      showMessage("Please fill in all required fields.", "warning");
      return;
    }
    try {
      await API.post("/events", {
        title: newEvent.name,
        description: newEvent.description,
        event_date: newEvent.date,
        location: newEvent.location,
        price: Number(newEvent.price.toString().replace(/[^0-9.]/g, "")),
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
        tickets_available: 100,
        category_id: CATEGORY_MAP[newEvent.category] ?? 1,
        organizer_id: loggedInUser.id,
      });
      setNewEvent({ name: "", date: "", location: "", price: "", category: "Technology", description: "" });
      await fetchOrganizerEvents(loggedInUser.id);
      await fetchEvents();
      showMessage("Event added successfully.", "success");
    } catch {
      showMessage("Failed to add event.", "error");
    }
  }

  async function updateOrganizerEvent() {
    if (!editEvent) return;
    try {
      await API.put(`/events/${editEvent.id}`, {
        title: editEvent.name,
        description: editEvent.description,
        event_date: editEvent.date,
        location: editEvent.location,
        price: Number(editEvent.price.toString().replace(/[^0-9.]/g, "")),
        category_id: CATEGORY_MAP[editEvent.category] ?? 1,
      });
      setEditEvent(null);
      await fetchOrganizerEvents(loggedInUser.id);
      await fetchEvents();
      showMessage("Event updated successfully.", "success");
    } catch {
      showMessage("Failed to update event.", "error");
    }
  }

  async function deleteOrganizerEvent(id) {
    try {
      await API.delete(`/events/${id}`);
      await fetchOrganizerEvents(loggedInUser.id);
      await fetchEvents();
      showMessage("Event deleted.", "info");
    } catch {
      showMessage("Failed to delete event.", "error");
    }
  }

  async function submitOrganizerApplication() {
    if (!loggedInUser) {
      setPage("login");
      return;
    }
    try {
      await API.post("/organizer/apply", {
        ...organizerApplication,
        user_id: loggedInUser.id,
      });
      setOrganizerApplication({
        organizer_name: "", event_title: "", event_category: "",
        event_description: "", sponsors: "", target_audience: "",
        expected_attendance: "", proposed_date: "", location: "", expected_price: "",
      });
      setPage("profile");
      showMessage("Application submitted — we'll review it within 48 hours.", "success");
    } catch {
      showMessage("Failed to submit application.", "error");
    }
  }

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────

  return (
    <div>
      <Toast message={message} setMessage={setMessage} />

      <Navbar
        setPage={setPage}
        loggedInUser={loggedInUser}
        handleLogout={handleLogout}
      />
      {page === "verify-email" && (
        <VerifyEmailNotice setPage={setPage} />
         )}

      {page === "home" && (
        <Home
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          filteredEvents={filteredEvents}
          openEventDetails={openEventDetails}
          setPage={setPage}
        />
      )}

      {page === "details" && selectedEvent && (
        <EventDetails
          selectedEvent={selectedEvent}
          ticketQuantity={ticketQuantity}
          setTicketQuantity={setTicketQuantity}
          getNumericPrice={getNumericPrice}
          handleBooking={handleBooking}
          setPage={setPage}
          loggedInUser={loggedInUser}
        />
      )}

      {page === "bookings" && (
        <Bookings
          loggedInUser={loggedInUser}
          userBookings={bookings}
          removeBooking={removeBooking}
        />
      )}

      {page === "profile" && (
        <Profile
          loggedInUser={loggedInUser}
          bookings={bookings}
          deleteAccount={deleteAccount}
          setPage={setPage}
        />
      )}

      {page === "organizer" && (
        <OrganizerDashboard
          organizerEvents={organizerEvents}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          addOrganizerEvent={addOrganizerEvent}
          deleteOrganizerEvent={deleteOrganizerEvent}
          editEvent={editEvent}
          setEditEvent={setEditEvent}
          updateOrganizerEvent={updateOrganizerEvent}
        />
      )}

      {page === "organizer-application" && (
        <OrganizerApplication
          organizerApplication={organizerApplication}
          setOrganizerApplication={setOrganizerApplication}
          submitOrganizerApplication={submitOrganizerApplication}
          setPage={setPage}
        />
      )}

      {page === "admin" && loggedInUser?.role === "admin" && (
        <AdminDashboard />
      )}

      {page === "login" && (
        <Login
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          handleLogin={handleLogin}
          setPage={setPage}
        />
      )}

      {page === "register" && (
        <Register
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
          handleRegister={handleRegister}
          setPage={setPage}
        />
      )}

      {page === "admin-login" && (
        <AdminLogin
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          handleLogin={handleLogin}
          setPage={setPage}
        />
      )}
    </div>
  );
}

export default App;
