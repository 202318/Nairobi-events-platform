function Login({ loginForm, setLoginForm, handleLogin, setPage }) {
  return (
    <section className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Login</h2>
        <p>Access your Nairobi Events account</p>

        <input
          type="email"
          placeholder="Email address"
          value={loginForm.email}
          onChange={(e) =>
            setLoginForm({ ...loginForm, email: e.target.value })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={loginForm.password}
          onChange={(e) =>
            setLoginForm({ ...loginForm, password: e.target.value })
          }
          required
        />

        <button type="submit">Login</button>

        <small>
          Don’t have an account?{" "}
          <span onClick={() => setPage("register")}>Register here</span>
        </small>
      </form>
    </section>
  );
}

export default Login;