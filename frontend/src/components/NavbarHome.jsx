import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const NavbarHome = () => {
    const [burgerActive, setBurgerActive] = useState(false)
    return (
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <Link class="navbar-item" href="/">
                    <div class="title">LOGO</div>
                </Link>

                <a href="#" role="button" className={`navbar-burger ${burgerActive ? "is-active" : ""}`}
                    aria-label="menu" aria-expanded="false"
                    data-target="navbarBasicExample"
                    onClick={() => setBurgerActive(!burgerActive)}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" className={`navbar-menu ${burgerActive ? "is-active" : ""}`}>
                <div class="navbar-start ">
                    <Link to="/" class="navbar-item">Home Page</Link>
                    <Link to="/aboutus" class="navbar-item">About Us</Link>
                    <Link to="/aboutapp" class="navbar-item">About App</Link>
                    <Link to="/contact" class="navbar-item">Contact</Link>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="buttons">
                            <Link to="/register" class="button is-link"><strong>Register</strong></Link>
                            <Link to="/login" class="button is-light">Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavbarHome