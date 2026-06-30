import { useEffect, useState } from "react";
import "./App.css";

import API from "./api";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import Login from "./components/Login";
import Register from "./components/Register";
import EventDetails from "./components/EventDetails";

import Home from "./pages/Home";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import OrganizerDashboard from "./pages/OrganizerDashboard";

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

  useEffect(() => {
    fetchEvents();
  }, []);

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

      setLoginForm({
        email: "",
        password: "",
        role: "user",
      });

      if (loggedUser.role === "organizer") {
  await fetchOrganizerEvents(loggedUser.id);
  setPage("organizer");
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
        />
      )}

      {page === "profile" && (
        <Profile loggedInUser={loggedInUser} bookings={bookings} />
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
    </div>
  );
}

export default App;