import { useEffect, useState } from "react";
import API from "../api";

function EventDetails({
  selectedEvent,
  ticketQuantity,
  setTicketQuantity,
  getNumericPrice,
  handleBooking,
  setPage,
}) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [selectedEvent.id]);

  async function fetchReviews() {
    try {
      const response = await API.get(`/reviews/event/${selectedEvent.id}`);
      setReviews(response.data);
    } catch (error) {
      console.log("Failed to load reviews", error);
    }
  }

  async function submitReview() {
    const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!savedUser) {
      setPage("login");
      return;
    }

    try {
      await API.post("/reviews", {
        user_id: savedUser.id,
        event_id: selectedEvent.id,
        rating,
        review,
      });

      setRating(5);
      setReview("");
      fetchReviews();
      alert("Review submitted successfully.");
    } catch (error) {
      alert("Failed to submit review.");
    }
  }

  return (
    <section className="event-details">
      <div className="details-card">
        <img
          src={selectedEvent.image}
          alt={selectedEvent.name}
          className="event-photo-large"
        />

        <span className="event-category">{selectedEvent.category}</span>

        <h2>{selectedEvent.name}</h2>

        <p>
          <strong>Date:</strong>{" "}
          {new Date(selectedEvent.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <p><strong>Location:</strong> {selectedEvent.location}</p>
        <p><strong>Ticket Price:</strong> KES {selectedEvent.price}</p>
        <p><strong>Description:</strong> {selectedEvent.description}</p>

        <div className="booking-box">
          <h3>Book Tickets</h3>

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

        <div className="review-section">
          <h3>Leave a Review</h3>
          <p className="review-subtitle">
            Share your experience and help others know what to expect.
          </p>

          <div className="review-form-row">
            <div className="review-field">
              <label>Your Rating</label>
              <select value={rating} onChange={(e) => setRating(e.target.value)}>
                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                <option value="4">⭐⭐⭐⭐ Good</option>
                <option value="3">⭐⭐⭐ Average</option>
                <option value="2">⭐⭐ Poor</option>
                <option value="1">⭐ Very Poor</option>
              </select>
            </div>

            <div className="review-field review-textarea">
              <label>Your Review</label>
              <textarea
                placeholder="Write your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>
          </div>

          <button className="review-submit-btn" onClick={submitReview}>
            Submit Review
          </button>

          <hr />

          <h3>What people are saying</h3>

          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.map((item) => (
              <div key={item.id} className="review-card">
                <p>
                  <strong>{item.full_name}</strong> — {"⭐".repeat(item.rating)}
                </p>
                <p>{item.review}</p>
              </div>
            ))
          )}
        </div>

        <button onClick={() => setPage("home")}>Back to Events</button>
      </div>
    </section>
  );
}

export default EventDetails;