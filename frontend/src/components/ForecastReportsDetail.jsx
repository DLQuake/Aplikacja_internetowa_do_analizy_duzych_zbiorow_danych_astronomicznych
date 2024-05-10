import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useParams } from "react-router-dom";
import { getWindDirection } from "../features/WindDirectionUtils";

const ForecastReportsDetail = () => {
    const [report, setReport] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const [error, setError] = useState("");

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
            } catch (error) {
                console.error("Error downloading data:", error);
                setError("Error downloading report details.");
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    return (
        <div className="pr-3">
            <h1 className="title">Forecast Report Details</h1>
            {loading && <p className="title has-text-centered p-5">Loading...</p>}
            {error && <p className="title has-text-centered p-5">{error}</p>}
            {report && (
                <div>
                    <p><strong>Title:</strong> {report.title}</p>
                    <p><strong>Date:</strong> {moment(report.reportDate).format("DD.MM.YYYY | HH:mm")}</p>
                    {/* Dodaj inne informacje z raportu, jeśli są */}
                </div>
            )}
            <h2>Forecast Data</h2>
            <table className="table is-striped is-fullwidth">
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
                            <td>{moment(forecast.future_date).format("DD.MM.YYYY | HH:mm")}</td>
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
    );
};

export default ForecastReportsDetail;