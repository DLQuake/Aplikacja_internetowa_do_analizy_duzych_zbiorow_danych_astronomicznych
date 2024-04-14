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
        if (!weatherdata) return res.status(404).json({ msg: "Brak danych w bazie dla podanego ID danej pogody" });
        res.status(200).json(weatherdata);
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
                return res.status(404).json({ msg: "Brak danych w bazie dla podanej nazwy lokalizacji" });
            }
        }

        if (startDate && endDate) {
            whereClause.date = {
                [Op.between]: [startDate, endDate],
            };
        } else if (startDate || endDate) {
            return res.status(400).json({ msg: "Podano tylko jeden zakres dat" });
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
            return res.status(404).json({ msg: "Brak danych pogodowych dla podanych kryteriów" });
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
                    console.error('Brak danych pogodowych dla lokalizacji (API archiwalne):', location.city);
                }
            } else {
                console.error('Błąd podczas pobierania danych pogodowych dla lokalizacji (API archiwalne):', location.city);
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
                    console.error('Brak danych pogodowych dla lokalizacji (API prognozowane):', location.city);
                }
            } else {
                console.error('Błąd podczas pobierania danych pogodowych dla lokalizacji (API prognozowane):', location.city);
            }
        }

        res.status(200).json({ msg: "Dane pogodowe zostały pomyślnie zapisane" });
    } catch (error) {
        console.error('Błąd podczas pobierania i zapisywania danych pogodowych:', error);
        res.status(500).json({ error: "Wystąpił błąd podczas przetwarzania żądania" });
    }
};

export const saveTodaytWeatherData = async () => {
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
                    const todayIndex = forecastWeatherData.hourly.time.findIndex(time => time.split('T')[0] === today);
                    if (todayIndex !== -1) {
                        const existingRecordToday = await WeatherData.findOne({
                            where: {
                                locationId: location.id,
                                date: forecastWeatherData.hourly.time[todayIndex]
                            }
                        });
                        if (!existingRecordToday) {
                            await WeatherData.create({
                                date: forecastWeatherData.hourly.time[todayIndex],
                                temperature: forecastWeatherData.hourly.temperature_2m[todayIndex],
                                humidity: forecastWeatherData.hourly.relative_humidity_2m[todayIndex],
                                precipitation: forecastWeatherData.hourly.precipitation[todayIndex],
                                windSpeed: forecastWeatherData.hourly.wind_speed_120m[todayIndex],
                                windDirection: forecastWeatherData.hourly.wind_direction_120m[todayIndex],
                                locationId: location.id
                            });
                        }
                    } else {
                        console.error('Brak danych pogodowych na dzisiaj dla lokalizacji:', location.city);
                    }
                } else {
                    console.error('Brak danych pogodowych dla lokalizacji (API prognozowane):', location.city);
                }
            } else {
                console.error('Błąd podczas pobierania danych pogodowych dla lokalizacji (API prognozowane):', location.city);
            }
        }
    } catch (error) {
        console.error('Błąd podczas pobierania i zapisywania danych pogodowych:', error);
    }
};

export const ForecastWeather = async (req, res) => {
    try {
        const cityName = req.params.cityName;
        const response = await axios.get(`http://localhost:5001/forecast_weather?cityName=${cityName}`);
        if (response.status === 200) {
            res.status(200).json(response.data);
        } else {
            res.status(response.status).json({ error: 'Błąd podczas komunikacji z serwerem Flask' });
        }
    } catch (error) {
        console.error('Błąd podczas wysyłania żądania do serwera Flask:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera podczas komunikacji z serwerem Flask' });
    }
};
