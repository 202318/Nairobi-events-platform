function VerifyEmailNotice({ setPage }) {
  return (
    <section className="events-section">
      <div className="details-card" style={{ textAlign: "center" }}>
        <h1>📧 Check Your Email</h1>

        <p style={{ fontSize: "18px", marginTop: "20px" }}>
          Your account has been created successfully.
        </p>

        <p>
          We've sent a verification email to the email address you registered
          with.
        </p>

        <p>
          Please click the verification link in your inbox before attempting to
          log in.
        </p>

        <p>
          If you don't see the email, please check your <strong>Spam</strong> or
          <strong> Junk</strong> folder.
        </p>

        <button
          style={{ marginTop: "25px" }}
          onClick={() => setPage("login")}
        >
          Go to Login
        </button>
      </div>
    </section>
  );
}

export default VerifyEmailNotice;