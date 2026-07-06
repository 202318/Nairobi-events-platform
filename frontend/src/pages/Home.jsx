import EventCard from "../components/EventCard";
import Footer from "../components/Footer";

const CATEGORY_ICONS = {
  All: "✦",
  Technology: "⚡",
  Business: "💼",
  Education: "📚",
  Music: "🎵",
  Sports: "🏃",
  Art: "🎨",
  Culture: "🏺",
  "Food & Drink": "🍽",
  Fashion: "👗",
  "Community & Charity": "🤝",
};

function NairobiSkyline() {
  return (
    <svg
      viewBox="0 0 1440 120"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className="skyline-svg"
    >
      {/* Nairobi-inspired skyline silhouette */}
      <path
        d="
          M0,120
          L0,90 L30,90 L30,70 L35,70 L35,55 L38,55 L38,40 L41,40 L41,55 L44,55 L44,70 L50,70 L50,90
          L60,90 L60,75 L80,75 L80,60 L83,60 L83,45 L86,45 L86,60 L90,60 L90,75 L110,75 L110,90
          L120,90 L120,65 L123,65 L123,50 L126,35 L129,50 L129,65 L140,65 L140,80 L160,80 L160,90
          L175,90 L175,70 L180,70 L180,55 L182,55 L182,42 L185,38 L188,42 L188,55 L190,55 L190,70 L200,70 L200,85
          L215,85 L215,60 L220,60 L220,45 L223,45 L223,30 L226,28 L229,30 L229,45 L232,45 L232,60 L240,60 L240,80
          L255,80 L255,65 L275,65 L275,50 L278,50 L278,35 L281,32 L284,35 L284,50 L290,50 L290,65 L310,65 L310,85
          L325,85 L325,70 L340,70 L340,55 L343,55 L343,40 L346,38 L349,40 L349,55 L355,55 L355,70 L370,70 L370,88
          L385,88 L385,68 L395,68 L395,52 L400,45 L405,52 L405,68 L420,68 L420,85
          L440,85 L440,65 L460,65 L460,48 L463,48 L463,34 L466,30 L469,34 L469,48 L480,48 L480,65 L500,65 L500,88
          L515,88 L515,70 L525,70 L525,55 L540,55 L540,70 L560,70 L560,85
          L575,85 L575,62 L580,62 L580,46 L583,46 L583,32 L586,28 L589,32 L589,46 L595,46 L595,62 L610,62 L610,82
          L625,82 L625,68 L640,68 L640,52 L655,52 L655,68 L675,68 L675,88
          L690,88 L690,70 L700,70 L700,54 L703,54 L703,40 L706,36 L709,40 L709,54 L720,54 L720,70 L740,70 L740,86
          L755,86 L755,64 L770,64 L770,48 L775,44 L780,48 L780,64 L800,64 L800,84
          L815,84 L815,66 L830,66 L830,50 L833,50 L833,36 L836,32 L839,36 L839,50 L850,50 L850,66 L870,66 L870,86
          L885,86 L885,70 L905,70 L905,54 L910,50 L915,54 L915,70 L935,70 L935,88
          L950,88 L950,72 L960,72 L960,56 L963,56 L963,42 L966,38 L969,42 L969,56 L980,56 L980,72 L1000,72 L1000,86
          L1015,86 L1015,65 L1030,65 L1030,50 L1045,50 L1045,65 L1060,65 L1060,84
          L1075,84 L1075,66 L1090,66 L1090,50 L1093,50 L1093,36 L1096,32 L1099,36 L1099,50 L1110,50 L1110,66 L1130,66 L1130,85
          L1145,85 L1145,70 L1165,70 L1165,55 L1168,55 L1168,42 L1171,38 L1174,42 L1174,55 L1185,55 L1185,70 L1205,70 L1205,88
          L1220,88 L1220,72 L1230,72 L1230,56 L1235,52 L1240,56 L1240,72 L1260,72 L1260,86
          L1275,86 L1275,68 L1290,68 L1290,52 L1305,52 L1305,68 L1325,68 L1325,85
          L1340,85 L1340,70 L1360,70 L1360,55 L1363,55 L1363,42 L1366,36 L1369,42 L1369,55 L1380,55 L1380,70 L1410,70 L1410,90
          L1440,90 L1440,120
          Z
        "
        fill="rgba(250,246,239,1)"
      />
    </svg>
  );
}

function StatBadge({ value, label }) {
  return (
    <div className="stat-badge">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

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
    "All","Technology","Business","Education","Music",
    "Sports","Art","Culture","Food & Drink","Fashion","Community & Charity",
  ];

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="hero-v2">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="hero-content">
          <span className="hero-eyebrow">📍 Nairobi, Kenya</span>

          <h1 className="hero-heading">
            Your city.<br />
            <em>Your events.</em>
          </h1>

          <p className="hero-sub">
            Concerts, conferences, marathons, festivals — everything happening
            in Nairobi, all in one place.
          </p>

          <div className="hero-search">
            <span className="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search events, venues, artists…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="hero-input"
            />
            <button className="hero-search-btn" onClick={handleSearch}>Search</button>
            {searchInput && (
              <button className="hero-clear-btn" onClick={clearSearch} title="Clear">✕</button>
            )}
          </div>

          <div className="hero-stats">
            <StatBadge value={`${filteredEvents.length}+`} label="Events" />
            <div className="stat-divider" />
            <StatBadge value="11" label="Categories" />
            <div className="stat-divider" />
            <StatBadge value="Free" label="to browse" />
          </div>
        </div>

        {/* Nairobi skyline — the signature motif */}
        <div className="skyline-wrap">
          <NairobiSkyline />
        </div>
      </section>

      {/* ─── CATEGORY STRIP ─── */}
      <section className="category-strip">
        <div className="category-scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`cat-pill ${selectedCategory === cat ? "cat-pill-active" : ""}`}
            >
              <span className="cat-icon">{CATEGORY_ICONS[cat]}</span>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ─── EVENTS GRID ─── */}
      <section className="events-v2">
        <div className="events-header">
          <div>
            <h2 className="events-title">
              {selectedCategory === "All" ? "Featured Events" : selectedCategory}
            </h2>
            <p className="events-count">
              {filteredEvents.length === 0
                ? "No events match — try a different search or category"
                : `${filteredEvents.length} event${filteredEvents.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          {searchInput && (
            <button className="clear-link" onClick={clearSearch}>
              Clear search ✕
            </button>
          )}
        </div>

        {filteredEvents.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🎟</span>
            <h3>Nothing here yet</h3>
            <p>Try searching something else or browsing all categories.</p>
            <button onClick={clearSearch}>Show all events</button>
          </div>
        ) : (
          <div className="event-grid-v2">
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
