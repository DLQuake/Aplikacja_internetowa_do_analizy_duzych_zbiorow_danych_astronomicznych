import React, { useState, useEffect } from "react";
import NavbarHome from "../components/NavbarHome";
import FooterHome from "../components/FooterHome";
import axios from "axios";
import moment from "moment";
import { getWindDirection } from "../features/WindDirectionUtils";

const HomePage = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [selectedCity, setSelectedCity] = useState("");
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        getLocations();
    }, []);

    const getLocations = async () => {
        try {
            const response = await axios.get("http://localhost:5000/locations");
            setLocations(response.data);
            const randomIndex = Math.floor(Math.random() * response.data.length);
            const randomCity = response.data[randomIndex].city;
            setSelectedCity(randomCity);
            getCurrentWeather(randomCity);
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    };

    const getCurrentWeather = async (city) => {
        try {
            const response = await axios.get(`http://localhost:5000/weatherdata/current?city=${city}`);
            setCurrentWeather(response.data);
        } catch (error) {
            console.error("Error fetching current weather:", error);
        }
    };

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
        getCurrentWeather(e.target.value);
    };

    return (
        <React.Fragment>
            <NavbarHome />
            <section className="section">
                <div className="content">
                    <h1 className="title is-1 has-text-centered">Welcome to the Weather Dashboard</h1>
                    <h1 className="subtitle has-text-centered">Choose a city and check a weather</h1>
                </div>
            </section>
            <section className="section">
                <div className="field">
                    <label className="label">Select City:</label>
                    <div className="control">
                        <div className="select is-medium is-fullwidth">
                            <select value={selectedCity} onChange={handleCityChange}>
                                {locations.map((location) => (
                                    <option key={location.uuid} value={location.city}>{location.city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </section>
            {currentWeather && (
                <section className="section">
                    <h2 className="title is-2 has-text-centered">Current Weather in {currentWeather.location.city} for {moment(currentWeather.date).format("DD.MM.YYYY | HH:mm")}</h2>
                    <div className="columns is-multiline">
                        <div className="column is-full">
                            <div className="card has-background-link has-text-centered">
                                <div className="card-content">
                                    <p className="title is-2 has-text-white">Temperature</p>
                                    <p className="title is-1 has-text-white">{currentWeather.temperature} °C</p>
                                </div>
                            </div>
                        </div>
                        <div className="column is-half">
                            <div className="card has-background-primary has-text-centered">
                                <div className="card-content">
                                    <p className="title is-2 has-text-white">Humidity</p>
                                    <p className="title is-1 has-text-white">{currentWeather.humidity} %</p>
                                </div>
                            </div>
                        </div>
                        <div className="column is-half">
                            <div className="card has-background-warning has-text-centered">
                                <div className="card-content">
                                    <p className="title is-2 has-text-white">Precipitation</p>
                                    <p className="title is-1 has-text-white">{currentWeather.precipitation} mm</p>
                                </div>
                            </div>
                        </div>
                        <div className="column is-half">
                            <div className="card has-background-danger has-text-centered">
                                <div className="card-content">
                                    <p className="title is-2 has-text-white ">Wind Speed</p>
                                    <p className="title is-1 has-text-white">{currentWeather.windSpeed} Km/h</p>
                                </div>
                            </div>
                        </div>
                        <div className="column is-half">
                            <div className="card has-background-success has-text-centered">
                                <div className="card-content">
                                    <p className="title is-2 has-text-white">Wind Direction</p>
                                    <p className="title is-1 has-text-white">{getWindDirection(currentWeather.windDirection)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            <FooterHome />
        </React.Fragment>
    );
};

export default HomePage;
