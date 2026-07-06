function Register({ registerForm, setRegisterForm, handleRegister, setPage }) {
  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleRegister}>
        <div className="auth-logo">
          <div className="auth-logo-dots">
            <div className="auth-logo-dot" />
            <div className="auth-logo-dot" />
            <div className="auth-logo-dot" />
          </div>
        </div>

        <span className="auth-eyebrow">Join Nairobi Events</span>
        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Start discovering and booking events near you</p>

        <div className="auth-form-group">
          <label className="auth-label">Full name</label>
          <input
            className="auth-input"
            type="text"
            placeholder="Jane Mwangi"
            value={registerForm.name}
            onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
            required
          />
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Email address</label>
          <input
            className="auth-input"
            type="email"
            placeholder="you@example.com"
            value={registerForm.email}
            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            required
          />
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type="password"
            placeholder="••••••••"
            value={registerForm.password}
            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="auth-submit">Create Account</button>

        <p className="auth-footer">
          Already have an account?{" "}
          <span onClick={() => setPage("login")}>Login here</span>
        </p>
      </form>
    </section>
  );
}

export default Register;
