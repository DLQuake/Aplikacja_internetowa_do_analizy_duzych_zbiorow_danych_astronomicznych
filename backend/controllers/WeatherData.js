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



export const runPythonScript = async (req, res) => {
    try {
        const pythonScriptPath = '/ścieżka/do/skryptu/pythona.py';
        const pythonScriptArgs = ['arg1', 'arg2', 'arg3'];
        const pythonProcess = spawn('python', [pythonScriptPath, ...pythonScriptArgs]);

        pythonProcess.stdout.on('data', (data) => {
            console.log(`Dane z procesu Pythona: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`Proces Pythona zakończony z kodem wyjścia: ${code}`);
            res.status(200).json({ message: 'Skrypt Pythona został pomyślnie uruchomiony' });
        });
    } catch (error) {
        console.error('Błąd podczas uruchamiania skryptu Pythona:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera podczas uruchamiania skryptu Pythona' });
    }
};

export const forecastWeatherData = async (req, res) => {
    try {
        const cityName = req.params.cityName;

        // Pobieranie danych lokalizacji z bazy danych
        const location = await Location.findOne({
            where: {
                city: cityName
            }
        });

        // Jeśli nie ma danych lokalizacji w bazie danych, zwróć błąd 404
        if (!location) {
            return res.status(404).json({ error: 'Nie znaleziono danych dla podanej lokalizacji' });
        }

        // Wyciągnięcie współrzędnych geograficznych z danych lokalizacji
        const { latitude, longitude } = location;

        // Pobieranie prognozy pogody dla danej lokalizacji
        const weatherResponse = await axios.get(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=2024-03-01&end_date=2024-04-07&hourly=temperature_2m`);

        // Jeśli nie udało się pobrać danych pogodowych, zwróć błąd 500
        if (weatherResponse.status !== 200) {
            return res.status(500).json({ error: 'Wystąpił błąd podczas pobierania danych pogodowych' });
        }

        // Przetwarzanie danych pogodowych
        const { hourly } = weatherResponse.data;
        const forecastData = {
            city: location.city,
            country: location.country,
            latitude: latitude,
            longitude: longitude,
            date: hourly.time,
            temperature: hourly.temperature_2m
        };

        // Wywołanie skryptu Pythona i przekazanie danych
        const pythonProcess = spawn('python', ['./../python/forecastWeather.py', JSON.stringify(forecastData)]);

        // Obsługa zdarzenia odczytu danych z procesu Pythona
        pythonProcess.stdout.on('data', (data) => {
            // Przetwarzanie danych z procesu Pythona
            const processedData = JSON.parse(data.toString());
            // Zwracanie przetworzonych danych jako odpowiedź
            res.status(200).json(processedData);
        });

        // Obsługa zdarzenia błędu procesu Pythona
        pythonProcess.on('error', (error) => {
            console.error('Błąd procesu Pythona:', error);
            res.status(500).json({ error: 'Wystąpił błąd serwera podczas przetwarzania danych' });
        });
    } catch (error) {
        console.error('Błąd pobierania danych z API:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera podczas pobierania danych z API' });
    }
};

export const sendRequestToFlask = async (req, res) => {
    try {
        // Adres serwera Flask
        const flaskServerURL = 'http://localhost:5001'; // Załóżmy, że serwer Flask działa na porcie 5001

        // Wysyłanie żądania GET do serwera Flask
        const response = await axios.get(`${flaskServerURL}/flask`);

        // Sprawdzanie odpowiedzi
        if (response.status === 200) {
            // Jeśli otrzymano odpowiedź z serwera Flask, zwróć zawartość odpowiedzi
            res.status(200).json(response.data);
        } else {
            // W przypadku błędu, zwróć odpowiedni status i komunikat błędu
            res.status(response.status).json({ error: 'Błąd podczas komunikacji z serwerem Flask' });
        }
    } catch (error) {
        console.error('Błąd podczas wysyłania żądania do serwera Flask:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera podczas komunikacji z serwerem Flask' });
    }
};