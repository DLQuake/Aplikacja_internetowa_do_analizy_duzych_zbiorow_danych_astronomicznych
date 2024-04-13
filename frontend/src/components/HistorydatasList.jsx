import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from 'moment';

const HistorydatasList = () => {
    const [weatherdatas, setWeatherdatas] = useState([]);
    const [cityName, setCityName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        getWeatherdata();
    }, []);

    const getWeatherdata = async () => {
        const response = await axios.get("http://localhost:5000/weatherdatas");
        setWeatherdatas(response.data);
    };

    const searchWeatherData = async () => {
        if (cityName) {
            const response = await axios.get(`http://localhost:5000/weatherdata/location/${cityName}`);
            setWeatherdatas(response.data);
        }
        else {
            getWeatherdata();
        }
    };

    return (
        <div>
            <h1 className="title">History data list</h1>
            <div className="field has-addons">
                <div className="control">
                    <input
                        className="input"
                        type="text"
                        placeholder="Enter city name"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                    />
                </div>
                <div className="control">
                    <input
                        className="input"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="control">
                    <input
                        className="input"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className="control">
                    <button className="button is-link" onClick={searchWeatherData}>Search</button>
                </div>
            </div>
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
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {weatherdatas.map((weatherdatas, index) => (
                        <tr key={weatherdatas.uuid}>
                            <td>{index + 1}</td>
                            <td>{weatherdatas.location.city}</td>
                            <td>{moment(weatherdatas.date).format("DD.MM.YYYY | HH:mm")}</td>
                            <td>{weatherdatas.temperature} °C</td>
                            <td>{weatherdatas.humidity} %</td>
                            <td>{weatherdatas.precipitation} mm</td>
                            <td>{weatherdatas.windSpeed} Km/h</td>
                            <td>{weatherdatas.windDirection} Degrees</td>
                            <td>
                                <div className="Option">
                                    <Link to={`/tasks/edit/${weatherdatas.uuid}`} className="button is-small is-info">Edit</Link>
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
