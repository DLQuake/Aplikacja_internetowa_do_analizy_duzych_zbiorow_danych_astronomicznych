import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from 'moment';

const ForecastReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const tableRef = useRef(null);

    useEffect(() => {
        getReports();
    }, []);

    const getReports = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:5000/report/");
            setReports(response.data);
        } catch (error) {
            console.error("An error occurred while downloading data:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteReport = async (reportId) => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:5000/report/${reportId}`);
            await getReports();
            alert("The report has been deleted.");
        } catch (error) {
            console.error("An error occurred while deleting the report:", error);
            alert("An error occurred while deleting the report.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pl-2 pr-3">
            <h1 className="title">Forecast Reports</h1>
            <div className="field">
                <div className="control">
                    {loading ? (
                        <p className="title has-text-centered">Loading...</p>
                    ) : (
                        <div className="table-container">
                            <table className="table is-striped is-fullwidth" ref={tableRef}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Date</th>
                                        <th>User</th>
                                        <th>Options</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report, index) => (
                                        <tr key={report.uuid}>
                                            <td>{index + 1}</td>
                                            <td>{report.title}</td>
                                            <td>{moment(report.reportDate).format("DD.MM.YYYY | HH:mm")}</td>
                                            <td>{report.user.imie} {report.user.nazwisko}</td>
                                            <td>
                                                <div className="Option">
                                                    <Link to={`/dashboard/forecastreports/report/${report.uuid}`} className="button is-small is-info">Show More</Link>
                                                    <button onClick={() => deleteReport(report.uuid)} className="button is-small is-danger">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForecastReports;
