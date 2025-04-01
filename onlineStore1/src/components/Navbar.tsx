import { Link } from 'react-router-dom';
import { DarkModeToggle } from './DarkModeToggle';
import {useState} from 'react'; //import added to handle the menu state
export const Navbar = () => {
 const [isMenuOpen, setIsMenuOpen] = useState(false); //constant added to handle the menu toggle
 return (
 <nav className="navbar">
 <div className="container">
 <div className="navbar-brand">
 <Link to="/">E-Shop</Link>
 {/* Hamburger button for mobile */}
<button
 className="hamburger"
onClick={() => setIsMenuOpen(!isMenuOpen)}
 aria-expanded={isMenuOpen}
 aria-label="Toggle navigation"
 >
 {/* Dynamic hamburger icon */}
{isMenuOpen ? '✕' : '☰'}
 </button>
 </div>
 {/* Collapsable menu for mobile/Fixed for Desktop */}
 <div className={`nav-links ${isMenuOpen ? 'open' :
''}`}>
 <Link to="/">Home</Link>
 <Link to="/products">Products</Link>
 <Link to="/cart">
 Cart <span className="cart-count">(0)</span>
 </Link>
<Link to="/orders">Orders</Link>
 <Link to="/admin">Admin</Link>
 <div className="navbar-actions">
 <DarkModeToggle/>
<button className="login-button">Login</button>
 </div>
 </div>
 </div>
 </nav>
 );
};