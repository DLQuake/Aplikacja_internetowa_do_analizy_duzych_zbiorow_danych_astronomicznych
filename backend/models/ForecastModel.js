import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Location from "./LocationModel.js";
import Report from "./ReportsModel.js";

const { DataTypes } = Sequelize;

const Forecast = db.define('forecast', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    future_dates: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    forecast_temperature: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    forecast_humidity: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    forecast_precipitation: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    forecast_windSpeed: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    forecast_windDirection: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    reportId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

Location.hasMany(Forecast);
Forecast.belongsTo(Location, { foreignKey: 'locationId' });

Report.hasMany(Forecast);
Forecast.belongsTo(Report, { foreignKey: 'reportId' });

export default Forecast;