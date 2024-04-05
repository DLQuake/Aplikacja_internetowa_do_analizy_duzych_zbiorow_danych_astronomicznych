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

        const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`);

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

// Kontroler Express do wywoływania skryptu Pythona
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
