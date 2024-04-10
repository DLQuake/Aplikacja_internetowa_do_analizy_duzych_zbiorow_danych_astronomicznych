import axios from 'axios';
import WeatherData from "../models/WeatherDataModel.js";
import Location from "../models/LocationModel.js";
import { spawn } from 'child_process';

export const getWeatherByLocationName = async (req, res) => {
    try {
        const location = await Location.findOne({
            where: {
                uuid: req.params.city,
            }
        });
        if (!location) return res.status(404).json({ msg: "Brak danych w bazie dla podanej nazwy lokalizacji" });

        const weather = await WeatherData.findOne({
            where: {
                locationId: location.uuid,
            }
        });

        if (!weather) return res.status(404).json({ msg: "Brak danych pogodowych w bazie dla podanej lokalizacji" });

        res.status(200).json(weather);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// export const getWeatherData = async (req, res) => {
//     try {
//         const name = req.params.cityName;

//         const geoResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=1&language=en&format=json`);

//         if (geoResponse.status !== 200 || !geoResponse.data.results || geoResponse.data.results.length === 0) {
//             return res.status(404).json({ error: 'Nie znaleziono danych dla podanej lokalizacji' });
//         }

//         const { name: city, country, latitude, longitude } = geoResponse.data.results[0];

//         const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`);

//         if (weatherResponse.status !== 200) {
//             return res.status(500).json({ error: 'Wystąpił błąd podczas pobierania danych pogodowych' });
//         }

//         const { hourly } = weatherResponse.data;
//         res.status(200).json({
//             city: city,
//             country: country,
//             latitude: latitude,
//             longitude: longitude,
//             date: hourly.time,
//             temperature: hourly.temperature_2m
//         });
//     } catch (error) {
//         console.error('Błąd pobierania danych z API:', error);
//         res.status(500).json({ error: 'Wystąpił błąd serwera podczas pobierania danych z API' });
//     }
// };

export const getWeatherData = async (req, res) => {
    try {
        const cityName = req.params.cityName;

        const location = await Location.findOne({
            where: {
                city: cityName
            }
        });
        if (!location) {
            return res.status(404).json({ error: 'Nie znaleziono danych dla podanej lokalizacji' });
        }

        const { city, country, latitude, longitude } = location;

        const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=1`);

        if (weatherResponse.status !== 200) {
            return res.status(500).json({ error: 'Wystąpił błąd podczas pobierania danych pogodowych' });
        }

        const { hourly } = weatherResponse.data;
        res.status(200).json({
            city: city,
            country: country,
            latitude: latitude,
            longitude: longitude,
            date: hourly.time,
            temperature: hourly.temperature_2m
        });
    } catch (error) {
        console.error('Błąd pobierania danych z API:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera podczas pobierania danych z API' });
    }
};

export const getHistoryWeatherData = async (req, res) => {
    try {
        const cityName = req.params.cityName;
        const startDate = req.query.start_date || '2024-03-01'; // Domyślna data początkowa
        const endDate = req.query.end_date || '2024-04-07'; // Domyślna data końcowa

        const location = await Location.findOne({
            where: {
                city: cityName
            }
        });

        if (!location) {
            return res.status(404).json({ error: 'Nie znaleziono danych dla podanej lokalizacji' });
        }

        const { city, country, latitude, longitude } = location;

        const weatherResponse = await axios.get(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m`);

        if (weatherResponse.status !== 200) {
            return res.status(500).json({ error: 'Wystąpił błąd podczas pobierania danych pogodowych' });
        }

        const { hourly } = weatherResponse.data;
        res.status(200).json({
            city: city,
            country: country,
            latitude: latitude,
            longitude: longitude,
            start_date: startDate,
            end_date: endDate,
            date: hourly.time,
            temperature: hourly.temperature_2m
        });
    } catch (error) {
        console.error('Błąd pobierania danych z API:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera podczas pobierania danych z API' });
    }
};

export const sendRequestToFlask = async (req, res) => {
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
