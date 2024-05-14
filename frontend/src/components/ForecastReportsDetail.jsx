import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { useParams } from "react-router-dom";
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getWindDirection } from "../features/WindDirectionUtils";
import { chartOptions } from "../features/chartOptionsUtils";
import PDFGenerator from "./PDFGenerator";

Chart.register(...registerables);

const ForecastReportsDetail = () => {
    const [report, setReport] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const [error, setError] = useState("");
    const [temperatureChartData, setTemperatureChartData] = useState(null);
    const [humidityChartData, setHumidityChartData] = useState(null);
    const [precipitationChartData, setPrecipitationChartData] = useState(null);
    const [windSpeedChartData, setWindSpeedChartData] = useState(null);
    const [windDirectionChartData, setWindDirectionChartData] = useState(null);
    const temperatureChartRef = useRef();
    const humidityChartRef = useRef();
    const precipitationChartRef = useRef();
    const windSpeedChartRef = useRef();
    const windDirectionChartRef = useRef();

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                const [reportResponse, forecastResponse] = await Promise.all([
                    axios.get(`http://localhost:5000/report/${id}`),
                    axios.get(`http://localhost:5000/forecast/filter?reportuuid=${id}`)
                ]);
                setReport(reportResponse.data);
                setForecastData(forecastResponse.data);
                generateChartData(forecastResponse.data);
            } catch (error) {
                console.error("Error downloading data:", error);
                setError("Error downloading report details.");
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    const generateChartData = (data) => {
        const labels = data.map((forecast) => moment(forecast.future_dates).format("DD.MM.YYYY | HH:mm"));
        const temperatureChartData = {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: data.map((forecast) => forecast.forecast_temperature),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                fill: true
            }]
        };
        const humidityChartData = {
            labels: labels,
            datasets: [{
                label: 'Humidity (%)',
                data: data.map((forecast) => forecast.forecast_humidity),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                fill: true
            }]
        };
        const precipitationChartData = {
            labels: labels,
            datasets: [{
                label: 'Precipitation (mm)',
                data: data.map((forecast) => forecast.forecast_precipitation),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 1)',
                fill: true
            }]
        };
        const windSpeedChartData = {
            labels: labels,
            datasets: [{
                label: 'Wind Speed (Km/h)',
                data: data.map((forecast) => forecast.forecast_windSpeed),
                borderColor: 'rgb(255, 159, 64)',
                backgroundColor: 'rgba(255, 159, 64, 0.1)',
                fill: true
            }]
        };
        const windDirectionChartData = {
            labels: labels,
            datasets: [{
                label: 'Wind Direction',
                data: data.map((forecast) => forecast.forecast_windDirection),
                borderColor: 'rgb(153, 102, 255)',
                backgroundColor: 'rgba(153, 102, 255, 1)',
                fill: true
            }]
        };

        setTemperatureChartData(temperatureChartData);
        setHumidityChartData(humidityChartData);
        setPrecipitationChartData(precipitationChartData);
        setWindSpeedChartData(windSpeedChartData);
        setWindDirectionChartData(windDirectionChartData);
    };

    return (
        <div className="pl-2 pr-3">
            <h1 className="title">Forecast Report Details</h1>
            {loading && <p className="title has-text-centered p-5">Loading...</p>}
            {error && <p className="title has-text-centered p-5">{error}</p>}
            {report && (
                <div>
                    <p><strong>Title:</strong> {report.title}</p>
                    <p><strong>Date:</strong> {moment(report.reportDate).format("DD.MM.YYYY | HH:mm")}</p>
                    {/* Add other information from the report if available */}
                </div>
            )}
            <div className="control has-text-centered m-6">
                <PDFGenerator
                    temperatureChartRef={temperatureChartRef}
                    humidityChartRef={humidityChartRef}
                    precipitationChartRef={precipitationChartRef}
                    windSpeedChartRef={windSpeedChartRef}
                    windDirectionChartRef={windDirectionChartRef}
                    selectedLocation={report && report.title.split(" ").pop()}
                />
            </div>
            <h1 className="title has-text-centered">Report from forecasting weather for "{report && report.title.split(" ").pop()}"</h1>
            <h2>Temperature</h2>
            {temperatureChartData && <Line ref={temperatureChartRef} data={temperatureChartData} options={chartOptions("Time", "Temperature (°C)")} />}
            <h2>Humidity</h2>
            {humidityChartData && <Line ref={humidityChartRef} data={humidityChartData} options={chartOptions("Time", "Humidity (%)")} />}
            <h2>Precipitation</h2>
            {precipitationChartData && <Bar ref={precipitationChartRef} data={precipitationChartData} options={chartOptions("Time", "Precipitation (mm)")} />}
            <h2>Wind Speed</h2>
            {windSpeedChartData && <Line ref={windSpeedChartRef} data={windSpeedChartData} options={chartOptions("Time", "Wind Speed (Km/h)")} />}
            <h2>Wind Direction</h2>
            {windDirectionChartData && <Bar ref={windDirectionChartRef} data={windDirectionChartData} options={chartOptions("Time", "Wind Direction")} />}
            <div className="table-container">
                <table id="weatherDataTable" className="table is-striped is-fullwidth">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>City</th>
                            <th>Future Date</th>
                            <th>Temperature (°C)</th>
                            <th>Humidity (%)</th>
                            <th>Precipitation (mm)</th>
                            <th>Wind Speed (Km/h)</th>
                            <th>Wind Direction</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forecastData.map((forecast, index) => (
                            <tr key={forecast.id}>
                                <td>{index + 1}</td>
                                <td>{forecast.location.city}</td>
                                <td>{moment(forecast.future_dates).format("DD.MM.YYYY | HH:mm")}</td>
                                <td>{forecast.forecast_temperature} °C</td>
                                <td>{forecast.forecast_humidity} %</td>
                                <td>{forecast.forecast_precipitation} mm</td>
                                <td>{forecast.forecast_windSpeed} Km/h</td>
                                <td>{getWindDirection(forecast.forecast_windDirection)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="control has-text-centered m-6">
                <PDFGenerator
                    temperatureChartRef={temperatureChartRef}
                    humidityChartRef={humidityChartRef}
                    precipitationChartRef={precipitationChartRef}
                    windSpeedChartRef={windSpeedChartRef}
                    windDirectionChartRef={windDirectionChartRef}
                    selectedLocation={report && report.title.split(" ").pop()}
                />
            </div>
        </div>
    );
};

export default ForecastReportsDetail;
