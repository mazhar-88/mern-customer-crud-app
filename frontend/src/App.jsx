import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomerManagement from "./components/CustomerManagement";

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<CustomerManagement />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  )
}

export default App
