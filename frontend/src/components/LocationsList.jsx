import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import axios from "axios";

const LocationsList = () => {
    const [locations, setLocations] = useState([]);
    const [cityName, setCityName] = useState("");

    useEffect(() => {
        getLocations();
    }, []);

    const getLocations = async () => {
        const response = await axios.get("http://localhost:5000/locations");
        setLocations(response.data);
    };

    const deleteLocations = async (locationId) => {
        await axios.delete(`http://localhost:5000/locations/${locationId}`);
        getLocations();
    };

    const AddLocation = async () => {
        if (!cityName) return;
        await axios.get(`http://localhost:5000/location/${cityName}`);
        setCityName("");
        getLocations();
    };

    return (
        <div>
            <h1 className="title">Locations list</h1>
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
                    <button className="button is-info" onClick={AddLocation}>Add Location</button>
                </div>
            </div>
            <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>City</th>
                        <th>Country</th>
                        <th>latitude</th>
                        <th>Longitude</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {locations.map((locations, index) => (
                        <tr key={locations.uuid}>
                            <td>{index + 1}</td>
                            <td>{locations.city}</td>
                            <td>{locations.country}</td>
                            <td>{locations.latitude}</td>
                            <td>{locations.longitude}</td>
                            <td>
                                <div className="Option">
                                    {/* <Link to={`/tasks/edit/${locations.uuid}`} className="button is-small is-info">Edit</Link> */}
                                    <button onClick={() => deleteLocations(locations.uuid)} className="button is-small is-danger">Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LocationsList;
