import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Mern Customer Crud App</Link>
      </div>
    </nav>
  );
}

export default Navbar;
