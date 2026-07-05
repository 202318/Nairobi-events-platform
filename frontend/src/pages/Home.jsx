import EventCard from "../components/EventCard";
import Footer from "../components/Footer";

function Home({
  searchInput,
  setSearchInput,
  handleSearch,
  clearSearch,
  selectedCategory,
  setSelectedCategory,
  filteredEvents,
  openEventDetails,
}) {
  const categories = [
    "All",
    "Technology",
    "Business",
    "Education",
    "Music",
    "Sports",
    "Art",
    "Culture",
    "Food & Drink",
    "Fashion",
    "Community & Charity",
  ];

  return (
    <>
      <section className="hero">
        <h1>Discover Nairobi’s Best Events</h1>
        <p>
          Browse concerts, conferences, sports events, festivals and community
          activities happening near you.
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, location, date or category..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <button onClick={handleSearch}>Search</button>
          <button onClick={clearSearch}>Clear</button>
        </div>

        <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "active-category" : ""}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="events-section">
        <h2>Featured Events</h2>

        {filteredEvents.length === 0 ? (
          <p>No events found. Try another search or category.</p>
        ) : (
          <div className="event-grid">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                openEventDetails={openEventDetails}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

export default Home;