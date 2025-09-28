import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #eee" }}>
      <Link to="/">Home</Link> | <Link to="/game">Game</Link> |{" "}
      <Link to="/login">Login</Link>
    </nav>
  );
}
export default Navbar;
