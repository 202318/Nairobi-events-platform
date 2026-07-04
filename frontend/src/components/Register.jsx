function Register({ registerForm, setRegisterForm, handleRegister, setPage }) {
  return (
    <section className="login-page">
      <form className="login-card" onSubmit={handleRegister}>
        <h2><b>Create Account</b></h2>
        <p>Fill in the details below to create your account</p>
        
        <input
          type="text"
          placeholder="Full name"
          value={registerForm.name}
          onChange={(e) =>
            setRegisterForm({ ...registerForm, name: e.target.value })
          }
          required
        />

        <input
          type="email"
          placeholder="Email address"
          value={registerForm.email}
          onChange={(e) =>
            setRegisterForm({ ...registerForm, email: e.target.value })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={registerForm.password}
          onChange={(e) =>
            setRegisterForm({ ...registerForm, password: e.target.value })
          }
          required
        />

        <button type="submit" >Create Account</button>

        <div>
        <small>
          Already have an account?{" "}
          <span onClick={() => setPage("login")}>Login here</span>
        </small>
        </div>
      </form>
    </section>
  );
}

export default Register;