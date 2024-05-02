import axios from 'axios';
import WeatherData from "../models/WeatherDataModel.js";
import Location from "../models/LocationModel.js";
import { Op } from 'sequelize';

export const getAllweatherdata = async (req, res) => {
    try {
        const weatherdata = await WeatherData.findAll({
            attributes: ['uuid', 'date', 'temperature', 'humidity', 'precipitation', 'windSpeed', 'windDirection'],
            include: [{
                model: Location,
                attributes: ['uuid', 'city', "country", "latitude", "longitude"]
            }]
        });
        res.status(200).json(weatherdata);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getWeatherdataById = async (req, res) => {
    try {
        const weatherdata = await WeatherData.findOne({
            attributes: ['uuid', 'date', 'temperature', 'humidity', 'precipitation', 'windSpeed', 'windDirection'],
            where: {
                uuid: req.params.id
            },
            include: [{
                model: Location,
                attributes: ['uuid', 'city', "country", "latitude", "longitude"]
            }]
        });
        if (!weatherdata) return res.status(404).json({ msg: "No data in the database for the given weather ID" });
        res.status(200).json(weatherdata);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getCurrentWeather = async (req, res) => {
    try {
        const city = req.query.city;
        const currentDate = new Date();
        const currentHour = currentDate.getUTCHours();

        const location = await Location.findOne({
            where: { city }
        });

        if (!location) {
            return res.status(404).json({ msg: "Location not found" });
        }

        const weatherData = await WeatherData.findAll({
            attributes: ['uuid', 'date', 'temperature', 'humidity', 'precipitation', 'windSpeed', 'windDirection'],
            where: {
                date: {
                    [Op.and]: [
                        { [Op.gte]: new Date(currentDate.setUTCHours(0, 0, 0, 0)) },
                        { [Op.lt]: new Date(currentDate.setUTCHours(23, 59, 59, 999)) }
                    ]
                },
                locationId: location.id
            },
            include: [{
                model: Location,
                attributes: ['uuid', 'city', "country", "latitude", "longitude"]
            }]
        });

        const currentWeather = weatherData.find(weather => {
            const weatherDate = new Date(weather.date);
            return weatherDate.getUTCHours() === currentHour;
        });

        if (!currentWeather) {
            return res.status(404).json({ msg: "Weather data not found" });
        }

        res.status(200).json(currentWeather);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getFilteredWeatherdata = async (req, res) => {
    try {
        const { city, startDate, endDate } = req.query;

        let whereClause = {};

        if (city) {
            const location = await Location.findOne({
                where: {
                    city: city,
                },
            });
            if (location) {
                whereClause.locationId = location.id;
            } else {
                return res.status(404).json({ msg: "No data in the database for the given location name" });
            }
        }

        if (startDate && endDate) {
            whereClause.date = {
                [Op.between]: [startDate, endDate],
            };
        } else if (startDate || endDate) {
            return res.status(400).json({ msg: "Only one date range is given" });
        }

        const weatherdata = await WeatherData.findAll({
            attributes: ['uuid', 'date', 'temperature', 'humidity', 'precipitation', 'windSpeed', 'windDirection'],
            where: whereClause,
            include: [{
                model: Location,
                attributes: ['uuid', 'city', "country", "latitude", "longitude"]
            }]
        });

        if (weatherdata.length === 0) {
            return res.status(404).json({ msg: "No weather data for the given criteria" });
        }

        res.status(200).json(weatherdata);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const saveWeatherDatatoDB = async (req, res) => {
    try {
        const locations = await Location.findAll();

        const today = new Date();
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(today.getDate() - 2);
        const endDate = twoDaysAgo.toISOString().split('T')[0];

        for (const location of locations) {
            const latitude = location.latitude;
            const longitude = location.longitude;
            const startDate = '2024-04-01';
            const archiveApiUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_100m,wind_direction_100m`;
            const archiveApiResponse = await axios.get(archiveApiUrl);

            if (archiveApiResponse.status === 200) {
                const archiveWeatherData = archiveApiResponse.data;

                if (archiveWeatherData.hourly && archiveWeatherData.hourly.time && archiveWeatherData.hourly.time.length > 0) {
                    for (let i = 0; i < archiveWeatherData.hourly.time.length; i++) {
                        const existingRecordHistory = await WeatherData.findOne({
                            where: {
                                locationId: location.id,
                                date: archiveWeatherData.hourly.time[i]
                            }
                        });

                        if (!existingRecordHistory) {
                            await WeatherData.create({
                                date: archiveWeatherData.hourly.time[i],
                                temperature: archiveWeatherData.hourly.temperature_2m[i],
                                humidity: archiveWeatherData.hourly.relative_humidity_2m[i],
                                precipitation: archiveWeatherData.hourly.precipitation[i],
                                windSpeed: archiveWeatherData.hourly.wind_speed_100m[i],
                                windDirection: archiveWeatherData.hourly.wind_direction_100m[i],
                                locationId: location.id
                            });
                        }
                    }
                } else {
                    console.error('No weather data for location (API archived):', location.city);
                }
            } else {
                console.error('Error when downloading weather data for a location (Archive API):', location.city);
            }

            const forecastApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_120m,wind_direction_120m&past_days=1&forecast_days=1`;
            const forecastApiResponse = await axios.get(forecastApiUrl);

            if (forecastApiResponse.status === 200) {
                const forecastWeatherData = forecastApiResponse.data;

                if (forecastWeatherData.hourly && forecastWeatherData.hourly.time && forecastWeatherData.hourly.time.length > 0) {
                    for (let i = 0; i < forecastWeatherData.hourly.time.length; i++) {
                        const existingRecordToday = await WeatherData.findOne({
                            where: {
                                locationId: location.id,
                                date: forecastWeatherData.hourly.time[i]
                            }
                        });

                        if (!existingRecordToday) {
                            await WeatherData.create({
                                date: forecastWeatherData.hourly.time[i],
                                temperature: forecastWeatherData.hourly.temperature_2m[i],
                                humidity: forecastWeatherData.hourly.relative_humidity_2m[i],
                                precipitation: forecastWeatherData.hourly.precipitation[i],
                                windSpeed: forecastWeatherData.hourly.wind_speed_120m[i],
                                windDirection: forecastWeatherData.hourly.wind_direction_120m[i],
                                locationId: location.id
                            });
                        }
                    }
                } else {
                    console.error('No weather data for the location (API forecast):', location.city);
                }
            } else {
                console.error('Error when downloading weather data for a location (forecast API):', location.city);
            }
        }

        res.status(200).json({ msg: "Weather data was successfully saved" });
    } catch (error) {
        console.error('Error while downloading and saving weather data:', error);
        res.status(500).json({ error: "An error occurred while processing the request" });
    }
};

export const saveTodayWeatherData = async () => {
    try {
        const locations = await Location.findAll();
        const today = new Date().toISOString().split('T')[0];

        for (const location of locations) {
            const latitude = location.latitude;
            const longitude = location.longitude;
            const forecastApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_120m,wind_direction_120m&forecast_days=1`;
            const forecastApiResponse = await axios.get(forecastApiUrl);

            if (forecastApiResponse.status === 200) {
                const forecastWeatherData = forecastApiResponse.data;

                if (forecastWeatherData.hourly && forecastWeatherData.hourly.time && forecastWeatherData.hourly.time.length > 0) {
                    for (let i = 0; i < forecastWeatherData.hourly.time.length; i++) {
                        const time = forecastWeatherData.hourly.time[i];
                        const date = time.split('T')[0];

                        if (date === today) {
                            const existingRecord = await WeatherData.findOne({
                                where: {
                                    locationId: location.id,
                                    date: time
                                }
                            });

                            if (!existingRecord) {
                                await WeatherData.create({
                                    date: time,
                                    temperature: forecastWeatherData.hourly.temperature_2m[i],
                                    humidity: forecastWeatherData.hourly.relative_humidity_2m[i],
                                    precipitation: forecastWeatherData.hourly.precipitation[i],
                                    windSpeed: forecastWeatherData.hourly.wind_speed_120m[i],
                                    windDirection: forecastWeatherData.hourly.wind_direction_120m[i],
                                    locationId: location.id
                                });
                            }
                        }
                    }
                } else {
                    console.error('No weather data for the location (API forecast):', location.city);
                }
            } else {
                console.error('Error when downloading weather data for a location (forecast API):', location.city);
            }
        }
    } catch (error) {
        console.error('Error while downloading and saving weather data:', error);
    }
};

export const ForecastWeather = async (req, res) => {
    try {
        const city = req.query.city;
        const days = req.query.days || 1;
        const response = await axios.get(`http://localhost:5001/forecast_weather?city=${city}&days=${days}`);
        if (response.status === 200) {
            res.status(200).json(response.data);
        } else {
            res.status(response.status).json({ error: 'Error communicating with the Flask server' });
        }
    } catch (error) {
        console.error('Error while sending a request to the Flask server:', error);
        res.status(500).json({ error: 'A server error occurred while communicating with the Flask server' });
    }
};

export const deleteWeatherDataByCityName = async (req, res) => {
    const city = req.query.city
    try {
        const location = await Location.findOne({
            where: {
                city: city,
            }
        });

        if (!location) {
            return res.status(404).json({ message: `No location given in the database.` });
        }

        const deletedRows = await WeatherData.destroy({
            where: {
                locationId: location.id
            }
        });

        if (deletedRows > 0) {
            return res.status(200).json({ message: `The weather data associated with the city name ${city} has been successfully deleted.` });
        } else {
            return res.status(404).json({ message: `No weather data found for city name ${city}.` });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};