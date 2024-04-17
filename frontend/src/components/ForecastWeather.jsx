import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const ForecastWeather = () => {
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
    const [forecastDays, setForecastDays] = useState(1);

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
        setShowWeatherData(false);
    };

    const handleDaysChange = (event) => {
        setForecastDays(event.target.value);
    };

    const fetchWeatherData = async () => {
        if (!selectedLocation || !forecastDays) return;

        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/weatherdata/forecast?city=${selectedLocation}&days=${forecastDays}`);
            setWeatherData(response.data);
            setShowWeatherData(true);
            generateChartData(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania danych pogodowych:", error);
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
        const labels = data.future_dates.map((date) => moment(date).format("DD.MM.YYYY | HH:mm"));
        setTemperatureData(data.forecast_temperature);
        setHumidityData(data.forecast_humidity);
        setPrecipitationData(data.forecast_precipitation);
        setWindSpeedData(data.forecast_wind_speed);
        setWindDirectionData(data.forecast_wind_direction);
    };

    const chartOptions = {
        plugins: {
            tooltip: {
                intersect: false,
                mode: 'index',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time',
                },
            },
            y: {
                title: {
                    display: true,
                    text: '',
                },
            },
        },
    };

    const getWindDirection = (degrees) => {
        if (degrees >= 349 || degrees < 11) return "N";
        else if (degrees >= 12 && degrees < 33) return "NNE";
        else if (degrees >= 34 && degrees < 56) return "NE";
        else if (degrees >= 57 && degrees < 78) return "ENE";
        else if (degrees >= 79 && degrees < 101) return "E";
        else if (degrees >= 102 && degrees < 123) return "ESE";
        else if (degrees >= 124 && degrees < 146) return "SE";
        else if (degrees >= 147 && degrees < 168) return "SSE";
        else if (degrees >= 169 && degrees < 191) return "S";
        else if (degrees >= 192 && degrees < 213) return "SSW";
        else if (degrees >= 214 && degrees < 236) return "SW";
        else if (degrees >= 237 && degrees < 258) return "WSW";
        else if (degrees >= 259 && degrees < 281) return "W";
        else if (degrees >= 282 && degrees < 303) return "WNW";
        else if (degrees >= 304 && degrees < 326) return "NW";
        else if (degrees >= 326 && degrees < 348) return "NNW";
        else return "N";
    };

    return (
        <div>
            <h1 className="title">Forecast Weather</h1>
            <div className="field pr-6">
                <label className="label">Select city to forecast weather:</label>
                <div className="control">
                    <div className="select is-striped is-fullwidth">
                        <select value={selectedLocation} onChange={handleLocationChange}>
                            <option value="">Select Location</option>
                            {locations.map((location) => (
                                <option key={location.id} value={location.city}>{location.city}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="field pr-6">
                <label className="label">Write a number of days to forecast weather</label>
                <div className="control">
                    <input className="input" type="number" placeholder="Number of days to forecast weather" value={forecastDays} onChange={handleDaysChange} />
                </div>
            </div>
            <div className="field">
                <div className="control">
                    <button className="button is-link" onClick={fetchWeatherData}>Predict forecast weather</button>
                </div>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {showWeatherData && (
                <div>
                    <div className="control has-text-centered m-6">
                        <button className="button is-link">Download report</button>
                    </div>
                    <h1 className="title has-text-centered">Report from forecasting weather for "{selectedLocation}"</h1>
                    <h2>Temperature</h2>
                    <Line ref={temperatureChartRef} data={{
                        labels: weatherData.future_dates.map((date) => moment(date).format("DD.MM.YYYY | HH:mm")),
                        datasets: [{
                            label: 'Temperature (°C)',
                            data: temperatureData,
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.1)',
                            fill: true
                        }]
                    }} options={chartOptions} />
                    <h2>Humidity</h2>
                    <Line ref={humidityChartRef} data={{
                        labels: weatherData.future_dates.map((date) => moment(date).format("DD.MM.YYYY | HH:mm")),
                        datasets: [{
                            label: 'Humidity (%)',
                            data: humidityData,
                            borderColor: 'rgb(54, 162, 235)',
                            backgroundColor: 'rgba(54, 162, 235, 0.1)',
                            fill: true
                        }]
                    }} options={chartOptions} />
                    <h2>Precipitation</h2>
                    <Bar ref={precipitationChartRef} data={{
                        labels: weatherData.future_dates.map((date) => moment(date).format("DD.MM.YYYY | HH:mm")),
                        datasets: [{
                            label: 'Precipitation (mm)',
                            data: precipitationData,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 1)',
                            fill: true
                        }]
                    }} options={chartOptions} />
                    <h2>Wind Speed</h2>
                    <Line ref={windSpeedChartRef} data={{
                        labels: weatherData.future_dates.map((date) => moment(date).format("DD.MM.YYYY | HH:mm")),
                        datasets: [{
                            label: 'Wind Speed (m/s)',
                            data: windSpeedData,
                            borderColor: 'rgb(255, 159, 64)',
                            backgroundColor: 'rgba(255, 159, 64, 0.1)',
                            fill: true
                        }]
                    }} options={chartOptions} />
                    <h2>Wind Direction</h2>
                    <Bar ref={windDirectionChartRef} data={{
                        labels: weatherData.future_dates.map((date) => moment(date).format("DD.MM.YYYY | HH:mm")),
                        datasets: [{
                            label: 'Wind Direction (°)',
                            data: windDirectionData,
                            borderColor: 'rgb(153, 102, 255)',
                            backgroundColor: 'rgba(153, 102, 255, 1)',
                            fill: true
                        }]
                    }} options={chartOptions} />
                    <div className="mt-5">
                        <table className="table is-striped is-fullwidth">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Temperature (°C)</th>
                                    <th>Humidity (%)</th>
                                    <th>Precipitation (mm)</th>
                                    <th>Wind Speed (m/s)</th>
                                    <th>Wind Direction</th>
                                </tr>
                            </thead>
                            <tbody>
                                {weatherData.future_dates.map((date, index) => (
                                    <tr key={index + 1}>
                                        <td>{index + 1}</td>
                                        <td>{moment(date).format("DD.MM.YYYY | HH:mm")}</td>
                                        <td>{temperatureData[index]} °C</td>
                                        <td>{humidityData[index]} %</td>
                                        <td>{precipitationData[index]} mm</td>
                                        <td>{windSpeedData[index]} m/s</td>
                                        <td>{getWindDirection(windDirectionData[index])}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="control has-text-centered m-6">
                        <button className="button is-link">Download report</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForecastWeather;
