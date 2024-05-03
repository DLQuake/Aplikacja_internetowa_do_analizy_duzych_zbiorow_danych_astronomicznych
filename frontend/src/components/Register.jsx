import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RegisterUser, reset } from "../features/authSlice";
import NavbarHome from "./NavbarHome";
import FooterHome from "./FooterHome";

const Register = () => {
    const [imie, setImie] = useState("");
    const [nazwisko, setNazwisko] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [role, setRole] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user || isSuccess) {
            navigate("/login");
        }
        dispatch(reset());
    }, [user, isSuccess, dispatch, navigate]);

    const Auth = (e) => {
        alert("User successfully registered");
        e.preventDefault();
        dispatch(RegisterUser({ imie, nazwisko, email, password, confPassword, role }));
    };

    return (
        <div>
            <NavbarHome />
            <section className="hero is-fullheight is-fullwidth">
                <div className="hero-body">
                    <div className="container">
                        <div className="columns is-centered">
                            <div className="column">
                                <form onSubmit={Auth} className="box">
                                    {isError && <p className="has-text-centered">{message}</p>}
                                    <h1 className="title is-2 has-text-centered">Registration to the system</h1>
                                    <div className="field">
                                        <label className="label">Name</label>
                                        <div className="control has-icons-left">
                                            <input type="text" className="input is-medium" value={imie} onChange={(e) => setImie(e.target.value)} placeholder="Name" />
                                            <span class="icon is-small is-left">
                                                <i class="fa-solid fa-person"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Surname</label>
                                        <div className="control has-icons-left">
                                            <input type="text" className="input is-medium" value={nazwisko} onChange={(e) => setNazwisko(e.target.value)} placeholder="Surname" />
                                            <span class="icon is-small is-left">
                                                <i class="fa-solid fa-person"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">E-mail</label>
                                        <div className="control has-icons-left">
                                            <input type="email" className="input is-medium" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" />
                                            <span class="icon is-small is-left">
                                                <i class="fa-solid fa-envelope"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Password</label>
                                        <div className="control has-icons-left">
                                            <input type="password" className="input is-medium" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" />
                                            <span class="icon is-small is-left">
                                                <i class="fa-solid fa-lock"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Repeat password</label>
                                        <div className="control has-icons-left">
                                            <input type="password" className="input is-medium" value={confPassword} onChange={(e) => setConfPassword(e.target.value)} placeholder="******" />
                                            <span class="icon is-small is-left">
                                                <i class="fa-solid fa-lock"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="field mt-5">
                                        <button type="submit" className="button is-medium is-link is-fullwidth">
                                            {isLoading ? "Loading..." : "Sign up"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <FooterHome />
        </div>
    );
};

export default Register;
