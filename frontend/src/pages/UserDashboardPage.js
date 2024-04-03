import React from 'react';
import { Link } from 'react-router-dom';

const UserDashboardPage = () => {
    return (
        <div>
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <Link to="/user" className="navbar-item">
                        Weather Dashboard
                    </Link>
                </div>
                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <Link to="/account" className="button is-light">Manage Account</Link>
                            <Link to="/logout" className="button is-light">Logout</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="columns">
                <div className="column is-one-quarter">
                    <aside className="menu">
                        <p className="menu-label">
                            General
                        </p>
                        <ul className="menu-list">
                            <li><Link to="/dashboard" className="is-active">Dashboard</Link></li>
                            <li><Link to="/data">Data</Link></li>
                            <li><Link to="/settings">Settings</Link></li>
                        </ul>
                    </aside>
                </div>
                <div className="column">
                    <div className="container">
                        <h2 className="title">Dashboard</h2>
                        <p>Welcome to your dashboard!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboardPage;
