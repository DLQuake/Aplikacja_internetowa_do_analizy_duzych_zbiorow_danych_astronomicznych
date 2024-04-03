import React, { useState } from 'react';
import logo from '../logo.svg'
import { Link } from 'react-router-dom';

const Header = () => {
    function toggleBurgerMenu() {
        document.querySelector('.navbar-menu').classList.toggle('is-active');
    }
    const [burgerActive, setBurgerActive] = useState(false)

    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link to="\" className="navbar-item">
                    <img src={logo} alt="Logo" width={40} height={28} />
                </Link>

                <a href="#" role="button" className={`navbar-burger ${burgerActive ? "is-active" : ""}`}
                    aria-label="menu" aria-expanded="false"
                    data-target="navMenu"
                    onClick={() => setBurgerActive(!burgerActive)}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id='navMenu' className={`navbar-menu ${burgerActive ? "is-active" : ""}`}>
                <div className="navbar-start">
                    <Link to="/" className="navbar-item">Home</Link>
                    <Link to="/about" className="navbar-item">About</Link>
                    <Link to="/register" className="navbar-item">Register</Link>
                    <Link to="/login" className="navbar-item">Login</Link>
                    <Link to="/contact" className="navbar-item">Contact</Link>
                </div>
            </div>
        </nav>
    );
}

export default Header;
