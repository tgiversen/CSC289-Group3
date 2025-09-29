import { Outlet, Link } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ padding: 16 }}>
        <Outlet Login Register/>
      </main>
      <Footer />
    </>
  );
}
