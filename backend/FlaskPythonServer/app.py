import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import numpy as np
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor
from dotenv import load_dotenv
import pandas as pd
from sklearn.model_selection import train_test_split

load_dotenv()

app = Flask(__name__)

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_USER}:{DB_PASSWORD}@localhost/{DB_NAME}'
db = SQLAlchemy(app)

class Location(db.Model):
    __tablename__ = 'location'
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String)
    city = db.Column(db.String)
    country = db.Column(db.String)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    createdAt = db.Column(db.DateTime)
    updatedAt = db.Column(db.DateTime)
    weather_data = db.relationship('WeatherData', backref='location', lazy=True)

class WeatherData(db.Model):
    __tablename__ = 'weatherdata'
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String, nullable=False, unique=True)
    date = db.Column(db.DateTime, nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, nullable=False)
    precipitation = db.Column(db.Float, nullable=False)
    windSpeed = db.Column(db.Float, nullable=False)
    windDirection = db.Column(db.Integer, nullable=False)
    locationId = db.Column(db.Integer, db.ForeignKey('location.id'), nullable=False)
    createdAt = db.Column(db.DateTime)
    updatedAt = db.Column(db.DateTime)

def train_model(X, y):
    model = RandomForestRegressor()
    model.fit(X, y)
    return model

@app.route('/forecast_weather', methods=['GET'])
def forecast_weather():
    try:
        city_name = request.args.get('city')
        days = int(request.args.get('days', 1))  # Domyślnie 1 dzień

        if not city_name:
            return jsonify({'error': 'Brak nazwy miasta w parametrze zapytania'}), 400

        location = Location.query.filter_by(city=city_name).first()

        if location:
            weather_data = location.weather_data
            df = pd.DataFrame([(data.date, data.temperature, data.humidity, data.precipitation, data.windSpeed, data.windDirection) for data in weather_data], columns=['date', 'temperature', 'humidity', 'precipitation', 'wind_speed', 'wind_direction'])
            df['date'] = pd.to_datetime(df['date'])

            # Znajdź ostatnią datę w danych
            last_date = df['date'].max()

            # Przewidywane daty dla przyszłych dni
            future_dates = [last_date + timedelta(hours=i) for i in range(1, 24 * days + 1)]

            # Stworzenie DataFrame dla przyszłych dat
            future_df = pd.DataFrame({'date': future_dates})

            # Trenowanie modeli na pełnych danych
            models = {}
            for column in df.columns[1:]:
                model = train_model(df[['date']], df[column])
                models[column] = model

            # Przewidywanie dla przyszłych dat
            forecast_data = {}
            for column in df.columns[1:]:
                forecast_data[column] = models[column].predict(future_df[['date']]).tolist()

            # Tworzenie końcowego JSON
            forecast_json = {
                'future_dates': [date.strftime('%Y-%m-%dT%H:%M') for date in future_dates],
                'forecast_temperature': forecast_data['temperature'],
                'forecast_humidity': forecast_data['humidity'],
                'forecast_precipitation': forecast_data['precipitation'],
                'forecast_wind_speed': forecast_data['wind_speed'],
                'forecast_wind_direction': forecast_data['wind_direction']
            }

            return jsonify(forecast_json)
        else:
            return jsonify({'error': 'Nie znaleziono danych lokalizacyjnych dla podanej lokalizacji'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
