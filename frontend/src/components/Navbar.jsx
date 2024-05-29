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
			<nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation" style={{ borderBottom: "2px solid #1F2229" }}>
				<div className="navbar-brand">
					<NavLink to="/dashboard" className="navbar-item">
						<div class="title">LOGO</div>
					</NavLink>
				</div>

				<div id="navbarBasicExample" className='navbar-menu'>
					<div className="navbar-end">
						<div className="navbar-item">
							Good morning &nbsp; <strong>{user && user.imie} {user && user.nazwisko}</strong>
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
