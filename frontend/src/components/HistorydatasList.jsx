import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from 'moment';

const HistorydatasList = () => {
    const [weatherdatas, setWeatherdatas] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const tableRef = useRef(null);

    useEffect(() => {
        getWeatherdata();
    }, []);

    const getWeatherdata = async () => {
        try {
            const response = await axios.get("http://localhost:5000/weatherdata/all");
            setWeatherdatas(response.data.sort((a, b) => {
                if (a.location.city === b.location.city) {
                    return new Date(a.date) - new Date(b.date);
                }
                return a.location.city > b.location.city ? 1 : -1;
            }));
            const uniqueCities = [...new Set(response.data.map(weatherdata => weatherdata.location.city))];
            setCities(uniqueCities);
        } catch (error) {
            console.error("Wystąpił błąd podczas pobierania danych:", error);
        }
    };

    const searchWeatherData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/weatherdata/filter", {
                params: {
                    city: selectedCity,
                    startDate: startDate,
                    endDate: endDate
                }
            });
            setWeatherdatas(response.data.sort((a, b) => {
                if (a.location.city === b.location.city) {
                    return new Date(a.date) - new Date(b.date);
                }
                return a.location.city > b.location.city ? 1 : -1;
            }));
            // Przewiń do tabeli po kliknięciu przycisku
            tableRef.current.scrollIntoView({ behavior: "smooth" });
        } catch (error) {
            console.error("Wystąpił błąd podczas pobierania danych:", error);
        }
    };

    return (
        <div>
            <h1 className="title">History data list</h1>
            <div className="field">
                <label className="label">Select City:</label>
                <div className="control">
                    <div className="select is-fullwidth">
                        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                            <option value="">Select city</option>
                            {cities.map((city, index) => (
                                <option key={index} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <label className="label">Select Date Range:</label>
            <div className="field has-addons">
                <div className="label">From &nbsp;</div>
                <div className="control">
                    <input
                        className="input"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="label">&nbsp; To &nbsp;</div>
                <div className="control">
                    <input
                        className="input"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>
            <div className="field">
                <div className="control">
                    <button className="button is-link" onClick={searchWeatherData}>Search</button>
                </div>
            </div>
            <table className="table is-striped is-fullwidth" ref={tableRef}>
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
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {weatherdatas.map((weatherdata, index) => (
                        <tr key={weatherdata.uuid}>
                            <td>{index + 1}</td>
                            <td>{weatherdata.location.city}</td>
                            <td>{moment(weatherdata.date).format("DD.MM.YYYY | HH:mm")}</td>
                            <td>{weatherdata.temperature} °C</td>
                            <td>{weatherdata.humidity} %</td>
                            <td>{weatherdata.precipitation} mm</td>
                            <td>{weatherdata.windSpeed} Km/h</td>
                            <td>{weatherdata.windDirection} Degrees</td>
                            <td>
                                <div className="Option">
                                    <Link to={`/tasks/edit/${weatherdata.uuid}`} className="button is-small is-info">Edit</Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistorydatasList;