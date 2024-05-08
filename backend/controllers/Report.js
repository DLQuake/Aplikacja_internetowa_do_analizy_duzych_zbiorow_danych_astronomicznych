import Report from "../models/ReportsModel.js";
import Users from "../models/UserModel.js";
import Forecast from '../models/ForecastModel.js';

export const getAllreport = async (req, res) => {
    try {
        const report = await Report.findAll({
            attributes: ['uuid', 'title', 'reportDate'],
            include: [{
                model: Users,
                attributes: ['uuid', 'imie', 'nazwisko', 'email', 'role']
            }]
        });
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getReportById = async (req, res) => {
    try {
        const location = await Report.findOne({
            attributes: ['uuid', 'title', 'reportDate'],
            where: {
                uuid: req.params.id
            },
            include: [{
                model: Users,
                attributes: ['uuid', 'imie', 'nazwisko', 'email', 'role']
            }]
        });
        if (!location) return res.status(404).json({ msg: "No data in the database for the given location ID" });
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const deleteReport = async (req, res) => {
    try {
        const report = await Report.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        await Forecast.destroy({
            where: {
                reportId: report.id
            }
        });

        await Report.destroy({
            where: {
                id: report.id
            }
        });

        res.status(200).json({ msg: 'Report and associated forecasts deleted successfully' });
    } catch (error) {
        console.error('Error while deleting report and associated forecasts:', error);
        res.status(500).json({ error: 'An error occurred while deleting report and associated forecasts' });
    }
};