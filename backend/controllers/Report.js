import axios from 'axios';
import Report from "../models/ReportsModel.js";
import Users from "../models/UserModel.js";
import { Op } from 'sequelize';


export const getAllreport = async (req, res) => {
    try {
        const report = await Report.findAll({
            attributes: ['uuid', 'title', 'reportDate', 'forecastId'],
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
            attributes: ['uuid', 'title', 'reportDate', 'forecastId'],
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