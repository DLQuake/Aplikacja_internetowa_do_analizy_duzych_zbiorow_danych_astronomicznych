import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";

const Navbar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.auth);
	const [burgerActive, setBurgerActive] = useState(false)

	const logout = () => {
		dispatch(LogOut());
		dispatch(reset());
		navigate("/");
	};

	return (
		<div>
			<nav className="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
				<div className="navbar-brand">
					<NavLink to="/dashboard" className="navbar-item">
						<div class="title">LOGO</div>
					</NavLink>

					<a href="#" role="button" className={`navbar-burger ${burgerActive ? "is-active" : ""}`}
						aria-label="menu" aria-expanded="false"
						data-target="navbarBasicExample"
						onClick={() => setBurgerActive(!burgerActive)}>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
					</a>
				</div>

				<div id="navbarBasicExample" className="navbar-menu">
					<div className="navbar-end">
						<div className="navbar-item">
							Good morning &nbsp; <strong>{user && user.role}</strong>
						</div>
						<div className="navbar-item">
							<div className="buttons">
								<button onClick={logout} className="button is-light">Sign out</button>
							</div>
						</div>
					</div>
				</div>
			</nav>
		</div>
	);
};

export default Navbar;
