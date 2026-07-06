function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>Nairobi Events</h3>
          <p>
            Your one-stop platform for discovering, booking, and enjoying
            Nairobi's best concerts, conferences, festivals and more.
          </p>
        </div>

        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li onClick={() => setPage && setPage("home")}>Browse Events</li>
            <li onClick={() => setPage && setPage("bookings")}>My Bookings</li>
            <li onClick={() => setPage && setPage("profile")}>Profile</li>
            <li onClick={() => setPage && setPage("register")}>Create Account</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Organizers</h4>
          <ul>
            <li onClick={() => setPage && setPage("organizer-application")}>Apply to Organize</li>
            <li onClick={() => setPage && setPage("organizer")}>Organizer Dashboard</li>
            <li>Help Center</li>
            <li>Contact Us</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Nairobi Events Platform. All Rights Reserved.</span>
        <span>
          Built with
          <span className="footer-flame" />
          in Nairobi, Kenya
        </span>
      </div>
    </footer>
  );
}

export default Footer;
