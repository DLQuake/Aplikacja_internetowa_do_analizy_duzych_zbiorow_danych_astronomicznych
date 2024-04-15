import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const Welcome = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [weatherData, setWeatherData] = useState([]);
    const [showWeatherData, setShowWeatherData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await axios.get("http://localhost:5000/locations");
            setLocations(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania lokalizacji:", error);
        }
    };

    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
    };

    const fetchWeatherData = async () => {
        setLoading(true);
        try {
            const today = moment().format("YYYY-MM-DD");
            const tomorrow = moment().add(1, 'days').format("YYYY-MM-DD");
            const response = await axios.get(`http://localhost:5000/weatherdata/filter?city=${selectedLocation}&startDate=${today}&endDate=${tomorrow}`);
            setWeatherData(response.data);
            setShowWeatherData(true);
        } catch (error) {
            console.error("Błąd podczas pobierania danych pogodowych:", error);
            setError("No weather data available for this location.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="title">Weather Dashboard</h1>
            <label className="label">Select a Location:</label>
            <div className="field has-addons">
                <div className="control">
                    <div className="select">
                        <select onChange={handleLocationChange}>
                            <option value="">Select Location</option>
                            {locations.map((location) => (
                                <option key={location.id} value={location.city}>{location.city}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="control">
                    <button className="button is-link" onClick={fetchWeatherData}>Search</button>
                </div>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {showWeatherData && (
                <div className="mt-5">
                    <table className="table is-striped is-fullwidth">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>City</th>
                                <th>Date</th>
                                <th>Temperature (°C)</th>
                                <th>Humidity (%)</th>
                                <th>Precipitation (mm)</th>
                                <th>Wind Speed (Km/h)</th>
                                <th>Wind Direction (Degrees)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {weatherData.map((weatherData, index) => (
                                <tr key={weatherData.uuid}>
                                    <td>{index + 1}</td>
                                    <td>{weatherData.location.city}</td>
                                    <td>{moment(weatherData.date).format("DD.MM.YYYY | HH:mm")}</td>
                                    <td>{weatherData.temperature} °C</td>
                                    <td>{weatherData.humidity} %</td>
                                    <td>{weatherData.precipitation} mm</td>
                                    <td>{weatherData.windSpeed} Km/h</td>
                                    <td>{weatherData.windDirection} Degrees</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Welcome;