function AdminLogin({ loginForm, setLoginForm, handleLogin, setPage }) {
  return (
    <section className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        <p>Restricted access for system administrators</p>

        <input
          type="email"
          placeholder="Admin email"
          value={loginForm.email}
          onChange={(e) =>
            setLoginForm({
              ...loginForm,
              email: e.target.value,
              role: "admin",
            })
          }
          required
        />

        <input
          type="password"
          placeholder="Admin password"
          value={loginForm.password}
          onChange={(e) =>
            setLoginForm({
              ...loginForm,
              password: e.target.value,
              role: "admin",
            })
          }
          required
        />

        <button type="submit">Login as Admin</button>

        <small>
          Back to normal login?{" "}
          <span onClick={() => setPage("login")}>User Login</span>
        </small>
      </form>
    </section>
  );
}

export default AdminLogin;