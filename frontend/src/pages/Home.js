import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
    const [weatherData, setWeatherData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.getWeatherData();
                setWeatherData(data);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <Header />
            <section className="hero is-fullheight px-5 py-5">
                <div className="container">
                    <h2 className="title">Home Page</h2>

                    {weatherData ? (
                        <div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Temperature</th>
                                        <th>Conditions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {weatherData.map((weather, index) => (
                                        <tr key={index}>
                                            <td>{weather.temperature}</td>
                                            <td>{weather.conditions}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>Loading weather data...</p>
                    )}
                </div>
            </section>
            <Footer />
        </div>

    );
}

export default Home;
