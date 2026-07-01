import { useEffect, useState } from "react";
import "./App.css";

import API from "./api";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import Login from "./components/Login";
import Register from "./components/Register";
import EventDetails from "./components/EventDetails";
import AdminLogin from "./components/AdminLogin";

import Home from "./pages/Home";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [page, setPage] = useState("home");
  const [events, setEvents] = useState([]);
  const [organizerEvents, setOrganizerEvents] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [bookings, setBookings] = useState([]);

  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    location: "",
    price: "",
    category: "Technology",
    description: "",
  });

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const [editEvent, setEditEvent] = useState(null);

  useEffect(() => {
  const savedUser = localStorage.getItem("loggedInUser");

  if (savedUser) {
    const user = JSON.parse(savedUser);
    setLoggedInUser(user);

    if (user.role === "organizer") {
      fetchOrganizerEvents(user.id);
      setPage("organizer");
    } else if (user.role === "admin") {
      setPage("admin");
    } else {
      fetchUserBookings(user.id);
      setPage("home");
    }
  }

  fetchEvents();
}, []);

useEffect(() => {
  if (!loggedInUser) return;

  let logoutTimer;

  function resetTimer() {
    clearTimeout(logoutTimer);

    logoutTimer = setTimeout(() => {
      localStorage.removeItem("loggedInUser");
      setLoggedInUser(null);
      setBookings([]);
      setPage("home");
      showMessage("You were logged out due to inactivity.", "warning");
    }, 15 * 60 * 1000);
  }

  window.addEventListener("mousemove", resetTimer);
  window.addEventListener("keydown", resetTimer);
  window.addEventListener("click", resetTimer);

  resetTimer();

  return () => {
    clearTimeout(logoutTimer);
    window.removeEventListener("mousemove", resetTimer);
    window.removeEventListener("keydown", resetTimer);
    window.removeEventListener("click", resetTimer);
  };
}, [loggedInUser]);

  async function fetchEvents() {
    try {
      const response = await API.get("/events");
      setEvents(response.data);
    } catch (error) {
      showMessage("Failed to load events from database.", "error");
    }
  }

  function showMessage(text, type = "success") {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
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

  function getNumericPrice(price) {
    return Number(price.toString().replace("KES ", "").replace(",", ""));
  }

  function handleSearch() {
    setSearchTerm(searchInput);
    showMessage("Search completed.", "info");
  }

  function clearSearch() {
    setSearchInput("");
    setSearchTerm("");
    setSelectedCategory("All");
    showMessage("Search cleared.", "info");
  }

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        full_name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        role: registerForm.role,
      });

      setRegisterForm({
        name: "",
        email: "",
        password: "",
        role: "user",
      });

      setPage("login");
      showMessage("Account created successfully. You can now log in.", "success");
    } catch (error) {
      showMessage("Registration failed. Email may already exist.", "error");
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
      };

      setLoggedInUser(loggedUser);
      localStorage.setItem("loggedInUser", JSON.stringify(loggedUser));

      setLoginForm({
        email: "",
        password: "",
        role: "user",
      });

     if (loggedUser.role === "organizer") {
  await fetchOrganizerEvents(loggedUser.id);
  setPage("organizer");
} else if (loggedUser.role === "admin") {
  setPage("admin");
} else {
  setPage("home");
  fetchUserBookings(loggedUser.id);
}

      showMessage(`Welcome, ${loggedUser.name}. Login successful.`, "success");
    } catch (error) {
      showMessage("Invalid email, password, or role.", "error");
    }
  }

  function handleLogout() {
    setLoggedInUser(null);
    localStorage.removeItem("loggedInUser");
    setSelectedEvent(null);
    setBookings([]);
    setPage("home");
    showMessage("You have logged out successfully.", "info");
  }

  function openEventDetails(event) {
    setSelectedEvent(event);
    setTicketQuantity(1);
    setPage("details");
  }

  async function handleBooking() {
    if (!loggedInUser) {
      setPage("login");
      showMessage("Please log in before booking a ticket.", "warning");
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
    } catch (error) {
      showMessage("Booking failed.", "error");
    }
  }

  async function fetchUserBookings(userId) {
    try {
      const response = await API.get(`/bookings/user/${userId}`);
      setBookings(response.data);
    } catch (error) {
      showMessage("Failed to load bookings.", "error");
    }
  }

  async function removeBooking(bookingId) {
    try {
      await API.delete(`/bookings/${bookingId}`);
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
      showMessage("Booking removed successfully.", "success");
    } catch (error) {
      showMessage("Failed to remove booking.", "error");
    }
  }

  async function addOrganizerEvent() {
    if (!loggedInUser || loggedInUser.role !== "organizer") {
      showMessage("Only organizers can add events.", "warning");
      return;
    }

    if (!newEvent.name || !newEvent.date || !newEvent.location || !newEvent.price) {
      showMessage("Please fill in all required fields.", "warning");
      return;
    }

    const categoryMap = {
      Technology: 1,
      Music: 2,
      Sports: 3,
      Business: 4,
      Education: 5,
    };

    try {
      await API.post("/events", {
        title: newEvent.name,
        description: newEvent.description,
        event_date: newEvent.date,
        location: newEvent.location,
        price: Number(newEvent.price.replace("KES", "").replace(",", "")),
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
        tickets_available: 100,
        category_id: categoryMap[newEvent.category],
        organizer_id: loggedInUser.id,
      });

      const createdEvent = {
        id: Date.now(),
        name: newEvent.name,
        date: newEvent.date,
        location: newEvent.location,
        price: newEvent.price,
        category: newEvent.category,
        description: newEvent.description,
      };

      setOrganizerEvents([...organizerEvents, createdEvent]);

      setNewEvent({
        name: "",
        date: "",
        location: "",
        price: "",
        category: "Technology",
        description: "",
      });

      await fetchEvents();
      showMessage("Event added successfully.", "success");
    } catch (error) {
      showMessage("Failed to add event.", "error");
    }
     await fetchOrganizerEvents(loggedInUser.id);
  }

  async function deleteOrganizerEvent(id) {
    try {
      await API.delete(`/events/${id}`);
      setOrganizerEvents(organizerEvents.filter((event) => event.id !== id));
      await fetchEvents();
      showMessage("Event deleted successfully.", "info");
    } catch (error) {
      showMessage("Failed to delete event.", "error");
    }
    await fetchOrganizerEvents(loggedInUser.id);
  }

  async function fetchOrganizerEvents(organizerId) {
  try {
    const response = await API.get(`/events/organizer/${organizerId}`);
    setOrganizerEvents(response.data);
  } catch (error) {
    showMessage("Failed to load organizer events.", "error");
  }
}

async function updateOrganizerEvent() {
  const categoryMap = {
    Technology: 1,
    Music: 2,
    Sports: 3,
    Business: 4,
    Education: 5,
  };

  try {
    await API.put(`/events/${editEvent.id}`, {
      title: editEvent.name,
      description: editEvent.description,
      event_date: editEvent.date,
      location: editEvent.location,
      price: Number(editEvent.price),
      category_id: categoryMap[editEvent.category],
    });

    setEditEvent(null);
    await fetchEvents();
    await fetchOrganizerEvents(loggedInUser.id);

    showMessage("Event updated successfully.", "success");
  } catch (error) {
    showMessage("Failed to update event.", "error");
  }
}
async function deleteAccount() {
  if (!loggedInUser) return;

  const confirmDelete = window.confirm(
    "Are you sure you want to delete your account? This cannot be undone."
  );

  if (!confirmDelete) return;

  try {
    await API.delete(`/auth/user/${loggedInUser.id}`);

    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    setBookings([]);
    setPage("home");

    showMessage("Account deleted successfully.", "success");
  } catch (error) {
    showMessage("Failed to delete account.", "error");
  }
}

    async function applyToBecomeOrganizer() {
  if (!loggedInUser) return;

  try {
    await API.put(`/auth/apply-organizer/${loggedInUser.id}`);

    const updatedUser = {
      ...loggedInUser,
      organizer_status: "pending",
    };

    setLoggedInUser(updatedUser);
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

    showMessage("Organizer application submitted successfully.", "success");
  } catch (error) {
    showMessage("Failed to submit organizer application.", "error");
  }
}
  return (
    <div>
      <Toast message={message} setMessage={setMessage} />

      <Navbar
        setPage={setPage}
        loggedInUser={loggedInUser}
        handleLogout={handleLogout}
      />

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
        />
      )}

      {page === "bookings" && (
        <Bookings
          loggedInUser={loggedInUser}
          userBookings={bookings}
          removeBooking={removeBooking}
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
      {page === "profile" && (
        <Profile
  loggedInUser={loggedInUser}
  bookings={bookings}
  deleteAccount={deleteAccount}
   applyToBecomeOrganizer={applyToBecomeOrganizer}
/>
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

      {page === "admin" && (
  <AdminDashboard
    events={events}
    bookings={bookings}
  />
)}
    </div>
  );
}

export default App;