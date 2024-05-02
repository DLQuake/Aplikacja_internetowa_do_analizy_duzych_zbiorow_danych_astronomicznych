import React from "react";
import { FaCloud, FaClock, FaSearch, FaUser, FaMobileAlt, FaServer, FaDatabase, FaGlobe, FaPython, FaBolt, FaReact } from "react-icons/fa";
import NavbarHome from "../components/NavbarHome";
import FooterHome from "../components/FooterHome";

const AboutApp = () => {
    return (
        <React.Fragment>
            <NavbarHome />
            <section className="section">
                <div className="content subtitle has-text-justified has-text-white">
                    <h2 className="title is-2 has-text-centered">About the App</h2>
                    <p>
                        The Weather Dashboard is a sophisticated weather forecasting application designed to provide users with accurate and real-time weather
                        updates for cities worldwide. Leveraging data from reputable weather APIs, our app ensures precise and up-to-date information on
                        current weather conditions and forecasts.
                        <br /><br />
                        Users have the ability to search for specific cities and view comprehensive weather data, including temperature, humidity,
                        precipitation, wind speed, and wind direction. Whether it's planning outdoor activities or staying informed about weather trends, the
                        Weather Dashboard empowers users with the insights they need to make informed decisions.
                        <br /><br />
                        In addition to browsing current weather data, the Weather Dashboard also offers robust forecasting capabilities. Users can access
                        hourly and daily forecasts, allowing for detailed planning and preparation based on weather predictions.
                        <br /><br />
                        With an intuitive user interface and seamless navigation, our app offers a hassle-free experience for users to access weather
                        information anytime, anywhere. Stay ahead of the weather curve and never be caught off guard with the Weather Dashboard.
                    </p>
                </div>
            </section>
            <section className="section">
                <h2 className="title is-2 has-text-centered">Key Features</h2>
                <div className="columns is-multiline">
                    <div className="column is-half">
                        <div className="card has-background-info">
                            <div className="card-content has-text-centered">
                                <FaCloud className="icon is-large has-text-white" />
                                <p className="title is-5 has-text-centered has-text-white">Real-time weather updates</p>
                            </div>
                        </div>
                    </div>
                    <div className="column is-half">
                        <div className="card has-background-success">
                            <div className="card-content has-text-centered">
                                <FaClock className="icon is-large has-text-white" />
                                <p className="title is-5 has-text-centered has-text-white">Hourly and daily forecast data</p>
                            </div>
                        </div>
                    </div>
                    <div className="column is-half">
                        <div className="card has-background-warning">
                            <div className="card-content has-text-centered">
                                <FaSearch className="icon is-large has-text-white" />
                                <p className="title is-5 has-text-centered has-text-white">Search functionality for finding weather in specific cities</p>
                            </div>
                        </div>
                    </div>
                    <div className="column is-half">
                        <div className="card has-background-danger">
                            <div className="card-content has-text-centered">
                                <FaUser className="icon is-large has-text-white" />
                                <p className="title is-5 has-text-centered has-text-white">User-friendly interface</p>
                            </div>
                        </div>
                    </div>
                    <div className="column is-half">
                        <div className="card has-background-primary">
                            <div className="card-content has-text-centered">
                                <FaMobileAlt className="icon is-large has-text-white" />
                                <p className="title is-5 has-text-centered has-text-white">Responsive design for mobile and desktop devices</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section">
                <h2 className="title is-2 has-text-centered">Technologies Used</h2>
                <div className="columns is-multiline">
                    <div className="column is-half">
                        <div className="card has-background-dark">
                            <div className="card-content has-text-centered">
                                <FaReact className="icon is-large has-text-white" />
                                <p className="title is-5 has-text-centered has-text-white">React.js - JavaScript framework for building user interfaces</p>
                            </div>
                        </div>
                    </div>
                    <div className="column is-half">
                        <div className="card has-background-link">
                            <div className="card-content has-text-centered">
                                <FaServer className="icon is-large has-text-white" />
                                <p className="title is-5 has-text-centered has-text-white">Node.js - JavaScript runtime environment for server-side development</p>
                            </div>
                        </div>
                    </div>
                    <div className="column is-half">
                        <div className="card has-background-info">
                            <div className="card-content has-text-centered">
                                <FaGlobe className="icon is-large has-text-white" />
                                <p className="title is-5 has-text-centered has-text-white">Express.js - Web application framework for Node.js</p>
                            </div>
                        </div>
                    </div>
                    <div className="column is-half">
                        <div className="card has-background-warning">
                            <div className="card-content has-text-centered">
                                <FaDatabase className="icon is-large has-text-white" />
                                <p className="title is-5 has-text-centered has-text-white">PostgreSQL - Open-source relational database management system</p>
                            </div>
                        </div>
                    </div>
                    <div className="column is-half">
                        <div className="card has-background-danger">
                            <div className="card-content has-text-centered">
                                <FaPython className="icon is-large has-text-white" />
                                <p className="title is-5 has-text-centered has-text-white">Flask - Micro web framework for Python</p>
                            </div>
                        </div>
                    </div>
                    <div className="column is-half">
                        <div className="card has-background-success">
                            <div className="card-content has-text-centered">
                                <FaBolt className="icon is-large has-text-white" />
                                <p className="title is-5 has-text-centered has-text-white">Bulma - Front-end framework for responsive and mobile-first design</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <FooterHome />
        </React.Fragment>
    );
};

export default AboutApp;
