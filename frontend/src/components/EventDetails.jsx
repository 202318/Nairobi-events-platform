import { useEffect, useState } from "react";
import API from "../api";

function EventDetails({
  selectedEvent,
  ticketQuantity,
  setTicketQuantity,
  getNumericPrice,
  handleBooking,
  setPage,
  loggedInUser,
}) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [selectedEvent.id]);

  async function fetchReviews() {
    try {
      const response = await API.get(`/reviews/event/${selectedEvent.id}`);
      setReviews(response.data);
    } catch (err) {
      console.log("Failed to load reviews", err);
    }
  }

  async function handlePay() {
    if (!phone.match(/^2547\d{8}$/)) {
      alert("Enter a valid Safaricom number in format 2547XXXXXXXX");
      return;
    }
    setPaying(true);
    try {
      const amount = getNumericPrice(selectedEvent.price) * ticketQuantity;
      await API.post("/mpesa/stk-push", {
        phone,
        amount,
        bookingId: selectedEvent.id,
      });
      alert("✅ M-Pesa prompt sent — check your phone to complete payment.");
      await handleBooking();
    } catch {
      alert("Payment request failed. Try again.");
    }
    setPaying(false);
  }

  async function submitReview() {
    if (!loggedInUser) {
      setPage("login");
      return;
    }
    try {
      await API.post("/reviews", {
        user_id: loggedInUser.id,
        event_id: selectedEvent.id,
        rating,
        review,
      });
      setRating(5);
      setReview("");
      fetchReviews();
    } catch {
      alert("Failed to submit review.");
    }
  }

  const total = getNumericPrice(selectedEvent.price) * ticketQuantity;

  return (
    <div className="event-details">
      {/* ── HERO IMAGE ── */}
      <div className="details-hero">
        <img
          src={selectedEvent.image}
          alt={selectedEvent.name}
          className="details-hero-img"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800";
          }}
        />
        <div className="details-hero-overlay" />
        <div className="details-hero-content">
          <span className="ecard-cat">{selectedEvent.category}</span>
          <h1 className="details-hero-title">{selectedEvent.name}</h1>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="details-body">

        {/* Left: info + reviews */}
        <div className="details-main">
          <div className="details-info-card">
            <div className="details-info-grid">
              <div className="details-info-item">
                <span className="details-info-label">📅 Date</span>
                <span className="details-info-value">
                  {selectedEvent.date
                    ? new Date(selectedEvent.date).toLocaleDateString("en-GB", {
                        day: "numeric", month: "long", year: "numeric",
                      })
                    : "Date TBC"}
                </span>
              </div>
              <div className="details-info-item">
                <span className="details-info-label">📍 Location</span>
                <span className="details-info-value">{selectedEvent.location}</span>
              </div>
              <div className="details-info-item">
                <span className="details-info-label">🎟 Ticket Price</span>
                <span className="details-info-value">{selectedEvent.price}</span>
              </div>
              <div className="details-info-item">
                <span className="details-info-label">⭐ Reviews</span>
                <span className="details-info-value">
                  {reviews.length > 0
                    ? `${reviews.length} review${reviews.length !== 1 ? "s" : ""}`
                    : "No reviews yet"}
                </span>
              </div>
            </div>

            {selectedEvent.description && (
              <p className="details-description">{selectedEvent.description}</p>
            )}
          </div>

          {/* Reviews */}
          <div className="review-section">
            <h3>Reviews</h3>
            <p className="review-subtitle">
              Share your experience and help others know what to expect.
            </p>

            <div className="review-form-row">
              <div className="review-field">
                <label>Your Rating</label>
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                  <option value="5">⭐⭐⭐⭐⭐ — Excellent</option>
                  <option value="4">⭐⭐⭐⭐ — Good</option>
                  <option value="3">⭐⭐⭐ — Average</option>
                  <option value="2">⭐⭐ — Poor</option>
                  <option value="1">⭐ — Very Poor</option>
                </select>
              </div>
              <div className="review-field">
                <label>Your Review</label>
                <textarea
                  placeholder="What was your experience like?"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
              </div>
            </div>

            <button className="review-submit-btn" onClick={submitReview}>
              Submit Review
            </button>

            <hr className="review-divider" />

            <p className="reviews-list-title">
              What people are saying
              {reviews.length > 0 && (
                <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, fontWeight: 500, color: "#9088a4", marginLeft: 8 }}>
                  ({reviews.length})
                </span>
              )}
            </p>

            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet — be the first to share your experience.</p>
            ) : (
              reviews.map((item) => (
                <div key={item.id} className="review-card">
                  <div className="review-card-header">
                    <span className="review-card-name">{item.full_name}</span>
                    <span className="review-card-stars">{"⭐".repeat(item.rating)}</span>
                  </div>
                  {item.review && (
                    <p className="review-card-text">"{item.review}"</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: booking sidebar */}
        <div className="details-sidebar">
          <div className="booking-sidebar-card">
            <p className="booking-sidebar-title">Book Tickets</p>

            <div className="ticket-selector">
              <button
                className="ticket-btn"
                onClick={() => ticketQuantity > 1 && setTicketQuantity(ticketQuantity - 1)}
              >
                −
              </button>
              <span className="ticket-count">{ticketQuantity}</span>
              <button
                className="ticket-btn"
                onClick={() => setTicketQuantity(ticketQuantity + 1)}
              >
                +
              </button>
            </div>

            <div className="booking-total">
              <span className="booking-total-label">Total</span>
              <span className="booking-total-value">
                KES {total.toLocaleString()}
              </span>
            </div>

            {/* M-Pesa */}
            <input
              className="mpesa-input"
              type="tel"
              placeholder="M-Pesa number e.g. 2547XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              className="mpesa-btn"
              onClick={handlePay}
              disabled={paying}
            >
              {paying ? (
                "Sending prompt…"
              ) : (
                <>
                  <span>💚</span> Pay with M-Pesa
                </>
              )}
            </button>

            <div className="or-divider">or</div>

            <button className="book-direct-btn" onClick={handleBooking}>
              Book without payment
            </button>
          </div>

          <button className="back-btn" onClick={() => setPage("home")}>
            ← Back to Events
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
