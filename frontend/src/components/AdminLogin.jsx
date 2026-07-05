function AdminLogin({ loginForm, setLoginForm, handleLogin, setPage }) {
  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <div className="auth-logo" style={{ background: "linear-gradient(135deg, #dc2626, #7c3aed)" }}>
          <div className="auth-logo-dots">
            <div className="auth-logo-dot" />
            <div className="auth-logo-dot" />
            <div className="auth-logo-dot" />
          </div>
        </div>

        <span className="auth-admin-badge">🔐 Restricted Access</span>
        <h2 className="auth-title">Admin Login</h2>
        <p className="auth-subtitle">System administrators only</p>

        <div className="auth-form-group">
          <label className="auth-label">Admin Email</label>
          <input
            className="auth-input"
            type="email"
            placeholder="admin@nairobievents.com"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value, role: "admin" })
            }
            required
          />
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Admin Password</label>
          <input
            className="auth-input"
            type="password"
            placeholder="••••••••"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value, role: "admin" })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="auth-submit"
          style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}
        >
          Login as Admin
        </button>

        <p className="auth-footer">
          Not an admin?{" "}
          <span onClick={() => setPage("login")}>Back to user login</span>
        </p>
      </form>
    </section>
  );
}

export default AdminLogin;
