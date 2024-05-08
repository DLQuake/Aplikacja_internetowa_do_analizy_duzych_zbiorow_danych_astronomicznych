import axios from 'axios';
import Forecast from "../models/ForecastModel.js";
import Location from "../models/LocationModel.js";
import Report from '../models/ReportsModel.js';
import Users from '../models/UserModel.js';
import { Op } from 'sequelize';

export const getAllForecast = async (req, res) => {
    try {
        const forecast = await Forecast.findAll({
            attributes: ['uuid', 'future_dates', 'forecast_temperature', 'forecast_humidity', 'forecast_precipitation', 'forecast_windSpeed', 'forecast_windDirection'],
            include: [{
                model: Location,
                attributes: ['uuid', 'city', 'country', 'latitude', 'longitude']
            }, {
                model: Report,
                attributes: ['uuid', 'title', 'reportDate'],
                include: [{
                    model: Users,
                    attributes: ['uuid', 'imie', 'nazwisko', 'email', 'role']
                }]
            }]
        });
        res.status(200).json(forecast);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


// export const ForecastWeather = async (req, res) => {
//     try {
//         const city = req.query.city;
//         const days = req.query.days || 1;
//         const response = await axios.get(`http://localhost:5001/forecast_weather?city=${city}&days=${days}`);
//         if (response.status === 200) {
//             res.status(200).json(response.data);
//         } else {
//             res.status(response.status).json({ error: 'Error communicating with the Flask server' });
//         }
//     } catch (error) {
//         console.error('Error while sending a request to the Flask server:', error);
//         res.status(500).json({ error: 'A server error occurred while communicating with the Flask server' });
//     }
// };