import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getWindDirection } from "../features/WindDirectionUtils";
import { chartOptions } from "../features/chartOptionsUtils";

Chart.register(...registerables);

const Welcome = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [weatherData, setWeatherData] = useState([]);
    const [showWeatherData, setShowWeatherData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [temperatureData, setTemperatureData] = useState([]);
    const [humidityData, setHumidityData] = useState([]);
    const [precipitationData, setPrecipitationData] = useState([]);
    const [windSpeedData, setWindSpeedData] = useState([]);
    const [windDirectionData, setWindDirectionData] = useState([]);
    const temperatureChartRef = useRef();
    const humidityChartRef = useRef();
    const precipitationChartRef = useRef();
    const windSpeedChartRef = useRef();
    const windDirectionChartRef = useRef();

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * locations.length);
        const randomLocation = locations[randomIndex]?.city || "";
        setSelectedLocation(randomLocation);
    }, [locations]);

    useEffect(() => {
        if (selectedLocation) {
            fetchWeatherData();
        }
    }, [selectedLocation]);

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
        setShowWeatherData(false);
    };

    const fetchWeatherData = async () => {
        if (!selectedLocation) return;

        setLoading(true);
        try {
            const today = moment().format("YYYY-MM-DD");
            const tomorrow = moment().add(1, 'days').format("YYYY-MM-DD");
            const response = await axios.get(`http://localhost:5000/weatherdata/filter?city=${selectedLocation}&startDate=${today}&endDate=${tomorrow}`);
            setWeatherData(response.data);
            setShowWeatherData(true);
            generateChartData(response.data);
        } catch (error) {
            console.error("Error while downloading weather data:", error);
            setError("No weather data available for this location.");
            setTemperatureData([]);
            setHumidityData([]);
            setPrecipitationData([]);
            setWindSpeedData([]);
            setWindDirectionData([]);
        } finally {
            setLoading(false);
        }
    };

    const generateChartData = (data) => {
        const labels = data.map((weather) => moment(weather.date).format("HH:mm"));
        const temperatureData = data.map((weather) => weather.temperature);
        const humidityData = data.map((weather) => weather.humidity);
        const precipitationData = data.map((weather) => weather.precipitation);
        const windSpeedData = data.map((weather) => weather.windSpeed);
        const windDirectionData = data.map((weather) => weather.windDirection);

        setTemperatureData(temperatureData);
        setHumidityData(humidityData);
        setPrecipitationData(precipitationData);
        setWindSpeedData(windSpeedData);
        setWindDirectionData(windDirectionData);
    };

    return (
        <div className="pl-2 pr-3">
            <h1 className="title">Weather Dashboard</h1>
            <div className="field">
                <label className="label">Select a Location:</label>
                <div className="control">
                    <div className="select is-striped is-fullwidth is-medium">
                        <select value={selectedLocation} onChange={handleLocationChange}>
                            {locations.map((location) => (
                                <option key={location.id} value={location.city}>{location.city}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading && <p className="title has-text-centered p-5">Loading...</p>}
            {error && <p className="title has-text-centered p-5">{error}</p>}
            {showWeatherData && (
                <div>
                    <div className="columns">
                        <div className="column">
                            <h2>Temperature</h2>
                            <Line ref={temperatureChartRef} data={{
                                labels: weatherData.map((weather) => moment(weather.date).format("HH:mm")),
                                datasets: [{
                                    label: 'Temperature (°C)',
                                    data: temperatureData,
                                    borderColor: 'rgb(255, 99, 132)',
                                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                                    fill: true
                                }]
                            }} options={chartOptions('Time', "Temperature (°C)")} />
                        </div>
                        <div className="column">
                            <h2>Humidity</h2>
                            <Line ref={humidityChartRef} data={{
                                labels: weatherData.map((weather) => moment(weather.date).format("HH:mm")),
                                datasets: [{
                                    label: 'Humidity (%)',
                                    data: humidityData,
                                    borderColor: 'rgb(54, 162, 235)',
                                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                                    fill: true
                                }]
                            }} options={chartOptions("Time", "Humidity (%)")} />
                        </div>
                        <div className="column">
                            <h2>Precipitation</h2>
                            <Bar ref={precipitationChartRef} data={{
                                labels: weatherData.map((weather) => moment(weather.date).format("HH:mm")),
                                datasets: [{
                                    label: 'Precipitation (mm)',
                                    data: precipitationData,
                                    borderColor: 'rgb(75, 192, 192)',
                                    backgroundColor: 'rgba(75, 192, 192, 1)',
                                    fill: true
                                }]
                            }} options={chartOptions("Time", "Precipitation (mm)")} />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <h2>Wind Speed</h2>
                            <Line ref={windSpeedChartRef} data={{
                                labels: weatherData.map((weather) => moment(weather.date).format("HH:mm")),
                                datasets: [{
                                    label: 'Wind Speed (m/s)',
                                    data: windSpeedData,
                                    borderColor: 'rgb(255, 159, 64)',
                                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                                    fill: true
                                }]
                            }} options={chartOptions("Time", "Wind Speed (m/s)")} />
                        </div>
                        <div className="column">
                            <h2>Wind Direction</h2>
                            <Bar ref={windDirectionChartRef} data={{
                                labels: weatherData.map((weather) => moment(weather.date).format("HH:mm")),
                                datasets: [{
                                    label: 'Wind Direction (°)',
                                    data: windDirectionData,
                                    borderColor: 'rgb(153, 102, 255)',
                                    backgroundColor: 'rgba(153, 102, 255, 1)',
                                    fill: true
                                }]
                            }} options={chartOptions("Time", "Wind Direction (°)")} />
                        </div>
                    </div>
                    <div className="mt-5">
                        <div className="table-container">
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
                                        <th>Wind Direction</th>
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
                                            <td>{getWindDirection(weatherData.windDirection)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Welcome;