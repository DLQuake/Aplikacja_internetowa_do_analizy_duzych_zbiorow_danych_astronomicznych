import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset } from "../features/authSlice";
import NavbarHome from "./NavbarHome";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user, isError, isSuccess, isLoading, message } = useSelector(
		(state) => state.auth
	);

	useEffect(() => {
		if (user || isSuccess) {
			navigate("/dashboard");
		}
		dispatch(reset());
	}, [user, isSuccess, dispatch, navigate]);

	const Auth = (e) => {
		e.preventDefault();
		dispatch(LoginUser({ email, password }));
	};

	return (
		<div>
			<NavbarHome></NavbarHome>
			<section className="hero is-fullheight is-fullwidth has-background-link">
				<div className="hero-body">
					<div className="container">
						<div className="columns is-centered">
							<div className="column is-4">
								<form onSubmit={Auth} className="box">
									{isError && <p className="has-text-centered">{message}</p>}
									<h1 className="title is-2">Login to the system</h1>
									<div className="field">
										<label className="label">E-mail</label>
										<div className="control has-icons-left">
											<input type="text" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" />
											<span class="icon is-small is-left">
												<i class="fas fa-user"></i>
											</span>
										</div>
									</div>
									<div className="field">
										<label className="label">Password</label>
										<div className="control has-icons-left">
											<input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" />
											<span class="icon is-small is-left">
												<i class="fa-solid fa-lock"></i>
											</span>
										</div>
									</div>
									<div className="field mt-5">
										<button type="submit" className="button is-link is-fullwidth" >
											{isLoading ? "Loading..." : "Sign in"}
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Login;
