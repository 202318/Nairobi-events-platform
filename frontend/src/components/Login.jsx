function Login({ loginForm, setLoginForm, handleLogin, setPage }) {
  return (
    <section className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <h2><b>Login</b></h2>
        <p>Enter your credentials to access your account</p>

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

        <div>
          <small>
          Don’t have an account?{" "}
          <span onClick={() => setPage("register")}>Register here</span>
        </small>
        </div>
      </form>
    </section>
  );
}

export default Login;