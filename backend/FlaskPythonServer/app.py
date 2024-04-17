import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import requests
from sklearn.ensemble import RandomForestRegressor
import numpy as np
from datetime import datetime, timedelta
from dotenv import load_dotenv

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

def train_model(time, data):
    model = RandomForestRegressor()
    X = np.array([(date - time[0]).total_seconds() / (60 * 60) for date in time]).reshape(-1, 1)
    model.fit(X, data)
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
            latitude = location.latitude
            longitude = location.longitude

            url = f'https://archive-api.open-meteo.com/v1/archive?latitude={latitude}&longitude={longitude}&start_date=2024-03-01&end_date=2024-04-07&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_100m,wind_direction_100m'

            response = requests.get(url)

            if response.status_code == 200:
                weather_data = response.json()
                time = np.array([datetime.strptime(date, '%Y-%m-%dT%H:%M') for date in weather_data['hourly']['time']])
                temperature_2m = np.array(weather_data['hourly']['temperature_2m'])
                relative_humidity_2m = np.array(weather_data['hourly']['relative_humidity_2m'])
                precipitation = np.array(weather_data['hourly']['precipitation'])
                wind_speed_100m = np.array(weather_data['hourly']['wind_speed_100m'])
                wind_direction_100m = np.array(weather_data['hourly']['wind_direction_100m'])

                # Trenowanie modeli dla każdego parametru
                temperature_model = train_model(time, temperature_2m)
                humidity_model = train_model(time, relative_humidity_2m)
                precipitation_model = train_model(time, precipitation)
                wind_speed_model = train_model(time, wind_speed_100m)
                wind_direction_model = train_model(time, wind_direction_100m)

                future_dates = [time[-1] + timedelta(days=i) for i in range(1, days + 1)]
                future_X = np.array([(date - time[0]).total_seconds() / (60 * 60) for date in future_dates]).reshape(-1, 1)

                # Prognozowanie dla każdego parametru
                forecast_temperature = temperature_model.predict(future_X)
                forecast_humidity = humidity_model.predict(future_X)
                forecast_precipitation = precipitation_model.predict(future_X)
                forecast_wind_speed = wind_speed_model.predict(future_X)
                forecast_wind_direction = wind_direction_model.predict(future_X)

                forecast_data = {
                    'future_dates': [date.strftime('%Y-%m-%dT%H:%M') for date in future_dates],
                    'forecast_temperature': forecast_temperature.tolist(),
                    'forecast_humidity': forecast_humidity.tolist(),
                    'forecast_precipitation': forecast_precipitation.tolist(),
                    'forecast_wind_speed': forecast_wind_speed.tolist(),
                    'forecast_wind_direction': forecast_wind_direction.tolist()
                }
                return jsonify(forecast_data)
            else:
                return jsonify({'error': 'Wystąpił błąd podczas pobierania danych pogodowych'}), response.status_code
        else:
            return jsonify({'error': 'Nie znaleziono danych lokalizacyjnych dla podanej lokalizacji'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
