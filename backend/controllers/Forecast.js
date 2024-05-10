import axios from 'axios';
import Forecast from "../models/ForecastModel.js";
import Location from "../models/LocationModel.js";
import Report from '../models/ReportsModel.js';
import Users from '../models/UserModel.js';

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

export const getForecastsByReportAndLocation = async (req, res) => {
    try {
        const reportuuid = req.query.reportuuid;

        const report = await Report.findOne({
            where: {
                uuid: reportuuid
            }
        });

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        const forecasts = await Forecast.findAll({
            attributes: ['uuid', 'future_dates', 'forecast_temperature', 'forecast_humidity', 'forecast_precipitation', 'forecast_windSpeed', 'forecast_windDirection'],
            where: {
                reportId: report.id,
            },
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

        res.status(200).json(forecasts);
    } catch (error) {
        console.error('Error while fetching forecasts by report and location:', error);
        res.status(500).json({ error: 'An error occurred while fetching forecasts by report and location' });
    }
};

export const ForecastWeather = async (req, res) => {
    try {
        const city = req.query.city;
        const days = req.query.days || 1;

        const response = await axios.get(`http://localhost:5001/forecast_weather?city=${city}&days=${days}`);

        if (response.status === 200) {
            const newReport = await Report.create({
                title: `Forecast for ${city}`,
                reportDate: new Date(),
                userId: req.userId
            });

            const location = await Location.findOne({ where: { city } });

            if (!location) {
                return res.status(400).json({ error: `Location '${city}' not found` });
            }

            const forecastData = response.data;

            const futureDates = forecastData.future_dates.map(date => new Date(date));

            await Forecast.bulkCreate(futureDates.map((date, index) => ({
                future_dates: date,
                forecast_temperature: forecastData.forecast_temperature[index],
                forecast_humidity: forecastData.forecast_humidity[index],
                forecast_precipitation: forecastData.forecast_precipitation[index],
                forecast_windSpeed: forecastData.forecast_windSpeed[index],
                forecast_windDirection: forecastData.forecast_windDirection[index],
                locationId: location.id,
                reportId: newReport.id
            })));

            res.status(200).json({ msg: "Forecast Saved" });
        } else {
            res.status(response.status).json({ error: 'Error communicating with the Flask server' });
        }
    } catch (error) {
        console.error('Error while sending a request to the Flask server:', error);
        res.status(500).json({ error: 'A server error occurred while communicating with the Flask server' });
    }
};
