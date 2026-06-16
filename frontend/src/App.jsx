import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [bookings, setBookings] = useState([]);

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const events = [
    {
      id: 1,
      name: "Nairobi Tech Summit",
      date: "10 August 2026",
      location: "KICC",
      price: "KES 1,500",
      description:
        "A technology networking event bringing together developers, startups, students and innovators in Nairobi.",
    },
    {
      id: 2,
      name: "Blankets & Wine",
      date: "15 August 2026",
      location: "Carnivore Grounds",
      price: "KES 3,000",
      description:
        "A lifestyle and music event featuring live performances, food, fashion and outdoor entertainment.",
    },
    {
      id: 3,
      name: "Nairobi Marathon",
      date: "20 September 2026",
      location: "Nyayo Stadium",
      price: "KES 800",
      description:
        "A sports event for professional runners, fitness lovers and community participants across Nairobi.",
    },
  ];

  function getNumericPrice(price) {
    return parseInt(price.replace("KES ", "").replace(",", ""));
  }

  function handleRegister(e) {
    e.preventDefault();

    const existingUser = users.find((user) => user.email === registerForm.email);

    if (existingUser) {
      alert("An account with this email already exists.");
      return;
    }

    setUsers([...users, registerForm]);
    alert("Account created successfully. You can now log in.");

    setRegisterForm({ name: "", email: "", password: "" });
    setPage("login");
  }

  function handleLogin(e) {
    e.preventDefault();

    const foundUser = users.find(
      (user) =>
        user.email === loginForm.email && user.password === loginForm.password
    );

    if (foundUser) {
      setLoggedInUser(foundUser);
      alert(`Welcome, ${foundUser.name}`);
      setPage("home");
    } else {
      alert("Invalid email or password.");
    }

    setLoginForm({ email: "", password: "" });
  }

  function handleLogout() {
    setLoggedInUser(null);
    setSelectedEvent(null);
    setPage("home");
  }

  function openEventDetails(event) {
    setSelectedEvent(event);
    setTicketQuantity(1);
    setPage("details");
  }

  function handleBooking() {
    if (!loggedInUser) {
      alert("Please log in before booking a ticket.");
      setPage("login");
      return;
    }

    const newBooking = {
      id: bookings.length + 1,
      userEmail: loggedInUser.email,
      eventName: selectedEvent.name,
      eventDate: selectedEvent.date,
      eventLocation: selectedEvent.location,
      quantity: ticketQuantity,
      totalAmount: getNumericPrice(selectedEvent.price) * ticketQuantity,
    };

    setBookings([...bookings, newBooking]);
    alert("Ticket booked successfully!");

    setTicketQuantity(1);
    setPage("bookings");
  }

  const userBookings = loggedInUser
    ? bookings.filter((booking) => booking.userEmail === loggedInUser.email)
    : [];

  return (
    <div>
      <nav className="navbar">
        <h2>Nairobi Events</h2>

        <div>
          <button
            onClick={() => {
              setSelectedEvent(null);
              setPage("home");
            }}
          >
            Home
          </button>

          {loggedInUser && (
            <button onClick={() => setPage("bookings")}>My Bookings</button>
          )}

          {loggedInUser ? (
            <>
              <span className="welcome-text">Hi, {loggedInUser.name}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setPage("login")}>Login</button>
              <button onClick={() => setPage("register")}>Register</button>
            </>
          )}
        </div>
      </nav>

      {page === "home" && (
        <>
          <section className="hero">
            <h1>Discover Amazing Events Across Nairobi</h1>
            <p>
              Find concerts, festivals, conferences, sports and community events
              near you.
            </p>

            <div className="search-box">
              <input type="text" placeholder="Search events..." />
              <button>Search</button>
            </div>
          </section>

          <section className="events-section">
            <h2>Featured Events</h2>

            <div className="event-grid">
              {events.map((event) => (
                <div className="event-card" key={event.id}>
                  <h3>{event.name}</h3>
                  <p>
                    <strong>Date:</strong> {event.date}
                  </p>
                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>
                  <p>
                    <strong>Price:</strong> {event.price}
                  </p>

                  <button onClick={() => openEventDetails(event)}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {page === "details" && selectedEvent && (
        <section className="event-details">
          <div className="details-card">
            <h2>{selectedEvent.name}</h2>

            <p>
              <strong>Date:</strong> {selectedEvent.date}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <p>
              <strong>Ticket Price:</strong> {selectedEvent.price}
            </p>
            <p>
              <strong>Description:</strong> {selectedEvent.description}
            </p>

            <div className="booking-box">
              <h3>Book Tickets</h3>

              <p>
                <strong>Quantity:</strong>
              </p>

              <button
                onClick={() =>
                  ticketQuantity > 1 && setTicketQuantity(ticketQuantity - 1)
                }
              >
                -
              </button>

              <span className="ticket-count">{ticketQuantity}</span>

              <button onClick={() => setTicketQuantity(ticketQuantity + 1)}>
                +
              </button>

              <p>
                <strong>Total:</strong> KES{" "}
                {getNumericPrice(selectedEvent.price) * ticketQuantity}
              </p>

              <button onClick={handleBooking}>Book Ticket</button>
            </div>

            <button
              onClick={() => {
                setSelectedEvent(null);
                setPage("home");
              }}
            >
              Back to Events
            </button>
          </div>
        </section>
      )}

      {page === "bookings" && (
        <section className="events-section">
          <h2>My Bookings</h2>

          {!loggedInUser ? (
            <p>Please log in to view your bookings.</p>
          ) : userBookings.length === 0 ? (
            <p>You have not booked any events yet.</p>
          ) : (
            <div className="event-grid">
              {userBookings.map((booking) => (
                <div className="event-card" key={booking.id}>
                  <h3>{booking.eventName}</h3>
                  <p>
                    <strong>Date:</strong> {booking.eventDate}
                  </p>
                  <p>
                    <strong>Location:</strong> {booking.eventLocation}
                  </p>
                  <p>
                    <strong>Tickets:</strong> {booking.quantity}
                  </p>
                  <p>
                    <strong>Total Paid:</strong> KES {booking.totalAmount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {page === "login" && (
        <section className="login-page">
          <form className="login-card" onSubmit={handleLogin}>
            <h2>Login</h2>
            <p>Access your Nairobi Events account</p>

            <input
              type="email"
              placeholder="Email address"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              required
            />

            <button type="submit">Login</button>

            <small>
              Don’t have an account?{" "}
              <span onClick={() => setPage("register")}>Register here</span>
            </small>
          </form>
        </section>
      )}

      {page === "register" && (
        <section className="login-page">
          <form className="login-card" onSubmit={handleRegister}>
            <h2>Create Account</h2>
            <p>Join Nairobi Events Platform</p>

            <input
              type="text"
              placeholder="Full name"
              value={registerForm.name}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, name: e.target.value })
              }
              required
            />

            <input
              type="email"
              placeholder="Email address"
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, email: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, password: e.target.value })
              }
              required
            />

            <button type="submit">Create Account</button>

            <small>
              Already have an account?{" "}
              <span onClick={() => setPage("login")}>Login here</span>
            </small>
          </form>
        </section>
      )}
    </div>
  );
}

export default App;