import axios from 'axios';
import Location from "../models/LocationModel.js";

export const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.findAll({
            attributes: ['uuid', 'city', "country", "latitude", "longitude"]
        });
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getLocationById = async (req, res) => {
    try {
        const location = await Location.findOne({
            attributes: ['uuid', 'city', "country", "latitude", "longitude"],
            where: {
                uuid: req.params.id
            }
        });
        if (!location) return res.status(404).json({ msg: "No data in the database for the given location ID" });
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getLocationDataFromAPIToDB = async (req, res) => {
    try {
        const name = req.params.city;

        if (!name) {
            return res.status(400).json({ error: 'No city name' });
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
            return res.status(404).json({ error: 'No data found for the specified city' });
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
        console.error('API data download error:', error);
        res.status(500).json({ error: 'A server error occurred while downloading data from the API' });
    }
};

export const deleteLocation = async(req, res) =>{
    const location = await Location.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!location) return res.status(404).json({msg: "Location not found"});
    try {
        await Location.destroy({
            where:{
                id: location.id
            }
        });
        res.status(200).json({msg: "Location removed"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}