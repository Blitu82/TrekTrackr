import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="navbar-logo">TrekTrackr</h1>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">
          Home
        </Link>
        <Link to="/itineraries" className="navbar-link">
          Itineraries
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
