import axios from 'axios';
import Location from "../models/LocationModel.js";

export const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.findAll();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getLocationById = async (req, res) => {
    try {
        const location = await Location.findOne({
            where: {
                city: req.params.city
            }
        });
        if (!location) return res.status(404).json({ msg: "Brak danych w bazie dla podanego ID lokalizacji" });
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getLocationDataFromAPIToDB = async (req, res) => {
    try {
        const name = req.params.city;

        if (!name) {
            return res.status(400).json({ error: 'Brak nazwy miasta' });
        }

        const existingLocation = await Location.findOne({
            where: {
                city: name
            }
        });

        if (existingLocation) {
            return res.status(200).json(existingLocation);
        }

        const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=1&language=en&format=json`);

        if (response.status !== 200 || !response.data.results || response.data.results.length === 0) {
            return res.status(404).json({ error: 'Nie znaleziono danych dla podanego miasta' });
        }

        const { name: city, latitude, longitude, country } = response.data.results[0];

        const location = await Location.create({
            city: city,
            country: country,
            latitude: latitude,
            longitude: longitude
        });

        res.status(200).json(location);
    } catch (error) {
        console.error('Błąd pobierania danych z API:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera podczas pobierania danych z API' });
    }
};
