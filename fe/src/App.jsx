import { Outlet, Link } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import "./App.css";

export default function App() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Navbar />
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
