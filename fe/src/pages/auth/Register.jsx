import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../stores/regSlice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, status, error } = useSelector((state) => state.reg);

  useEffect(() => {
    if (error) console.error(error);
    if (user) navigate("/login");
  }, [user, error, navigate]);

  const signupPage = (e) => {
    e.preventDefault();
    dispatch(register({ username, email, password }));
  };

  return (
    <div
      style={{
        background: "rgba(0, 0, 0, 0.7)",
        padding: "2rem",
        borderRadius: "1rem",
        width: "350px",
        textAlign: "center",
        boxShadow: "0 0 20px gold",
        alignItems: "center",
        justifyContent: "center",
        margin: "0",
      }}
    >
      <h1 style={{ color: "gold", marginBottom: "1rem" }}>🎰 SpinStorm 🎰</h1>
      <form onSubmit={signupPage}>
        <input
          style={{
            width: "90%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            fontSize: "1rem",
          }}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          style={{
            width: "90%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            fontSize: "1rem",
          }}
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={{
            width: "90%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            fontSize: "1rem",
          }}
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            border: "none",
            borderRadius: "5px",
            background: "gold",
            color: "purple",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            transform: "0.3s",
          }}
        >
          Create Account
        </button>
        <span>
          Already have an account <Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  ); //for return
} // for register

export default Register;