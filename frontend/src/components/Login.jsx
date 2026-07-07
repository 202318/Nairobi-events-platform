function Login({ loginForm, setLoginForm, handleLogin, setPage }) {
  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <div className="auth-logo">
          <div className="auth-logo-dots">
            <div className="auth-logo-dot" />
            <div className="auth-logo-dot" />
            <div className="auth-logo-dot" />
          </div>
        </div>

        <span className="auth-eyebrow">Welcome back</span>
        <h2 className="auth-title">Log in</h2>
        <p className="auth-subtitle">Access your Nairobi Events account</p>

        <div className="auth-form-group">
          <label className="auth-label">Email address</label>
          <input
            className="auth-input"
            type="email"
            placeholder="you@example.com"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            required
          />
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type="password"
            placeholder="••••••••"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="auth-submit">Login</button>

        <p className="auth-footer">
          Don't have an account?{" "}
          <span onClick={() => setPage("register")}>Register here</span>
        </p>

      </form>
    </section>
  );
}

export default Login;
