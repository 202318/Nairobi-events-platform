function Login({ loginForm, setLoginForm, handleLogin, setPage }) {
  return (
    <section className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
<<<<<<< HEAD
        <h2><b>Login</b></h2>
        <p>Enter your credentials to access your account</p>
=======
        <h2>Login</h2>
        <p>Choose your account type and access your dashboard</p>

        <select
          value={loginForm.role}
          onChange={(e) =>
            setLoginForm({ ...loginForm, role: e.target.value })
          }
          required
        >
          <option value="user">User</option>
          <option value="organizer">Organizer</option>
         
        </select>
>>>>>>> 55993db44569a010506591843e6472aab44c9f1f

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

<<<<<<< HEAD
        <div>
          <small>
          Don’t have an account?{" "}
          <span onClick={() => setPage("register")}>Register here</span>
        </small>
        </div>
=======
<small>
  Don’t have an account?{" "}
  <span onClick={() => setPage("register")}>Register here</span>
</small>

<br />
<br />

<small>
  <span
    style={{ cursor: "pointer", color: "#6d28d9", fontWeight: "600" }}
    onClick={() => setPage("admin-login")}
  >
    Admin Login
  </span>
</small>
>>>>>>> 55993db44569a010506591843e6472aab44c9f1f
      </form>
    </section>
  );
}

export default Login;