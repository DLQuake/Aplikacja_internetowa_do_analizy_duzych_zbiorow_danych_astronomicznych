import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getWindDirection } from "../features/WindDirectionUtils";
import { chartOptions } from "../features/chartOptionsUtils";
import * as htmlToImage from 'html-to-image';
import { toPng } from 'html-to-image'
import jsPDF from 'jspdf';
import 'jspdf-autotable';

Chart.register(...registerables);

const ForecastWeather = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [weatherData, setWeatherData] = useState({});
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
    const [downloadingPDF, setDownloadingPDF] = useState(false);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await axios.get("http://localhost:5000/locations");
            setLocations(response.data);
        } catch (error) {
            console.error("Error downloading location:", error);
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
        const labels = data.future_dates.map((date) => moment(date).format("DD.MM.YYYY | HH:mm"));
        setTemperatureData(data.forecast_temperature);
        setHumidityData(data.forecast_humidity);
        setPrecipitationData(data.forecast_precipitation);
        setWindSpeedData(data.forecast_windSpeed);
        setWindDirectionData(data.forecast_windDirection);
    };

    const downloadPDFReport = async () => {
        setDownloadingPDF(true);

        try {
            const chartImages = await Promise.all([
                getImageFromChart(temperatureChartRef.current),
                getImageFromChart(humidityChartRef.current),
                getImageFromChart(precipitationChartRef.current),
                getImageFromChart(windSpeedChartRef.current),
                getImageFromChart(windDirectionChartRef.current)
            ]);

            const pdf = new jsPDF();
            const fileName = `Forecast_Weather_Report_${selectedLocation}_${moment().format("YYYYMMDD_HHmmss")}.pdf`;
            const pageWidth = pdf.internal.pageSize.getWidth(); // Dodajemy definicję pageWidth
            const pageHeight = pdf.internal.pageSize.getHeight();

            pdf.setFontSize(40);
            pdf.setTextColor(65, 105, 225);
            pdf.text("Forecast Weather Report", pageWidth / 2, pageHeight / 2, { align: 'center' });
            pdf.setTextColor(0);
            pdf.text(`Weather forecast for "${selectedLocation}"`, pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });

            addChartToPDF(pdf, chartImages[0], "Temperature Chart", 20, 120, pageWidth - 40, 150, pageWidth);
            addChartToPDF(pdf, chartImages[1], "Humidity Chart", 20, 120, pageWidth - 40, 150, pageWidth);
            addChartToPDF(pdf, chartImages[2], "Precipitation Chart", 20, 120, pageWidth - 40, 150, pageWidth);
            addChartToPDF(pdf, chartImages[3], "Wind Speed Chart", 20, 120, pageWidth - 40, 150, pageWidth);
            addChartToPDF(pdf, chartImages[4], "Wind Direction Chart", 20, 120, pageWidth - 40, 150, pageWidth);

            const weatherDataTable = document.getElementById("weatherDataTable");
            addTableToPDF(pdf, weatherDataTable, "Weather Data Table", pageWidth);

            pdf.save(fileName);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setDownloadingPDF(false);
        }
    };

    const getImageFromChart = (chartRef) => {
        return htmlToImage.toPng(chartRef.canvas)
            .then((dataUrl) => {
                return dataUrl;
            })
            .catch((error) => {
                console.error('Error generating image from chart:', error);
                return null;
            });
    };

    const addChartToPDF = (pdf, imageData, title, x, y, width, height, pageWidth) => {
        pdf.addPage();
        pdf.setFontSize(20);
        pdf.setTextColor(65, 105, 225);
        pdf.text(title, pageWidth / 2, 50, { align: 'center' });
        pdf.setTextColor(0);
        if (imageData) {
            pdf.addImage(imageData, 'PNG', x, y, width, height);
        } else {
            pdf.text("Problem with chart", 10, 20);
        }
    };

    const addTableToPDF = (pdf, table, title, pageWidth) => {
        pdf.addPage();
        pdf.setFontSize(20);
        pdf.setTextColor(65, 105, 225);
        pdf.text(title, pageWidth / 2, 10, { align: 'center' });
        pdf.setTextColor(0);
        if (table) {
            pdf.autoTable({ html: table });
        } else {
            pdf.text("Problem with table", 10, 20);
        }
    };

    return (
        <div className="pr-3">
            <h1 className="title">Forecast Weather</h1>
            <div className="field">
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
            <div className="field">
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

            {loading && <p className="title has-text-centered p-5">Loading...</p>}
            {error && <p className="title has-text-centered p-5">{error}</p>}
            {showWeatherData && (
                <div>
                    <div className="control has-text-centered m-6">
                        <button className={`button is-link ${downloadingPDF ? 'is-loading' : ''}`} onClick={downloadPDFReport} disabled={downloadingPDF}>
                            {downloadingPDF ? 'Generating PDF...' : 'Download report'}
                        </button>
                    </div>
                    <h1 className="title has-text-centered">Report from forecasting weather for "{selectedLocation}"</h1>
                    <h2>Temperature</h2>
                    <Line ref={temperatureChartRef} data={{
                        labels: weatherData.future_dates,
                        datasets: [{
                            label: 'Temperature (°C)',
                            data: temperatureData,
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.1)',
                            fill: true
                        }]
                    }} options={chartOptions('Time', "Temperature (°C)")} />
                    <h2>Humidity</h2>
                    <Line ref={humidityChartRef} data={{
                        labels: weatherData.future_dates,
                        datasets: [{
                            label: 'Humidity (%)',
                            data: humidityData,
                            borderColor: 'rgb(54, 162, 235)',
                            backgroundColor: 'rgba(54, 162, 235, 0.1)',
                            fill: true
                        }]
                    }} options={chartOptions('Time', "Humidity (%)")} />
                    <h2>Precipitation</h2>
                    <Bar ref={precipitationChartRef} data={{
                        labels: weatherData.future_dates,
                        datasets: [{
                            label: 'Precipitation (mm)',
                            data: precipitationData,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 1)',
                            fill: true
                        }]
                    }} options={chartOptions('Time', "Precipitation (mm)")} />
                    <h2>Wind Speed</h2>
                    <Line ref={windSpeedChartRef} data={{
                        labels: weatherData.future_dates,
                        datasets: [{
                            label: 'Wind Speed (m/s)',
                            data: windSpeedData,
                            borderColor: 'rgb(255, 159, 64)',
                            backgroundColor: 'rgba(255, 159, 64, 0.1)',
                            fill: true
                        }]
                    }} options={chartOptions('Time', "Wind Speed (m/s)")} />
                    <h2>Wind Direction</h2>
                    <Bar ref={windDirectionChartRef} data={{
                        labels: weatherData.future_dates,
                        datasets: [{
                            label: 'Wind Direction (°)',
                            data: windDirectionData,
                            borderColor: 'rgb(153, 102, 255)',
                            backgroundColor: 'rgba(153, 102, 255, 1)',
                            fill: true
                        }]
                    }} options={chartOptions('Time', "Wind Direction (°)")} />
                    <div className="mt-5">
                        <table id="weatherDataTable" className="table is-striped is-fullwidth">
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
                                        <td>{temperatureData[index].toFixed(1)} °C</td>
                                        <td>{Math.round(humidityData[index])} %</td>
                                        <td>{precipitationData[index].toFixed(1)} mm</td>
                                        <td>{windSpeedData[index].toFixed(1)} m/s</td>
                                        <td>{getWindDirection(windDirectionData[index])}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="control has-text-centered m-6">
                    <button className={`button is-link ${downloadingPDF ? 'is-loading' : ''}`} onClick={downloadPDFReport} disabled={downloadingPDF}>
                            {downloadingPDF ? 'Generating PDF...' : 'Download report'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForecastWeather;