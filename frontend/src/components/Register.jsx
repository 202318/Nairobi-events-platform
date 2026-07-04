function Register({ registerForm, setRegisterForm, handleRegister, setPage }) {
  return (
    <section className="login-page">
      <form className="login-card" onSubmit={handleRegister}>
<<<<<<< HEAD
        <h2><b>Create Account</b></h2>
        <p>Fill in the details below to create your account</p>
        
=======
        <h2>Create Account</h2>
        <p>Register as a user or event organizer</p>

        <select
          value={registerForm.role}
          onChange={(e) =>
            setRegisterForm({ ...registerForm, role: e.target.value })
          }
          required
        >
          <option value="user">User</option>
          <option value="organizer">Organizer</option>
          </select>

>>>>>>> 55993db44569a010506591843e6472aab44c9f1f
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