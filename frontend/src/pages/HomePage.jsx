import React from "react";
import NavbarHome from "../components/NavbarHome";
import FooterHome from "../components/FooterHome";

const HomePage = () => {
    return (
        <React.Fragment>
            <NavbarHome />
            <section className="section">
                <div class="content">
                    <h1 className="title is-1 has-text-centered">Welcome in Weather Dashboard</h1>
                </div>
            </section>
            <section className="section">
                <div className="content">
                    <h2 className="title is-2 has-text-centered">About the App</h2>
                    <p>
                        Weather Dashboard is a weather forecasting application that provides real-time weather updates for cities around the world.
                        Our app uses data from reputable weather APIs to ensure accurate and up-to-date information.
                    </p>
                    <p>
                        Users can search for a specific city to view current weather conditions, as well as forecast data for the upcoming days.
                        With intuitive navigation and user-friendly interface, Weather Dashboard makes it easy for users to stay informed about the weather wherever they are.
                    </p>
                </div>
            </section>
            <section className="section">
                <div className="content ">
                    <h2 className="title is-2 has-text-centered">Key Features</h2>
                    <ul>
                        <li>Real-time weather updates</li>
                        <li>Hourly and daily forecast data</li>
                        <li>Search functionality for finding weather in specific cities</li>
                        <li>User-friendly interface</li>
                        <li>Responsive design for mobile and desktop devices</li>
                    </ul>
                </div>
            </section>
            <section className="section">
                <div className="content ">
                    <h2 className="title is-2 has-text-centered">Technologies Used</h2>
                    <ul>
                        <li>React.js - JavaScript framework for building user interfaces</li>
                        <li>Node.js - JavaScript runtime environment for server-side development</li>
                        <li>Express.js - Web application framework for Node.js</li>
                        <li>PostgreSQL - Open-source relational database management system</li>
                        <li>Axios - Promise-based HTTP client for making requests</li>
                        <li>Bulma - Front-end framework for responsive and mobile-first design</li>
                    </ul>
                </div>
            </section>
            <FooterHome />
        </React.Fragment>
    );
};

export default HomePage;
