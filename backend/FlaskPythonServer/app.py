import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import requests
from sklearn.linear_model import LinearRegression
import numpy as np
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Konfiguracja bazy danych
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_USER}:{DB_PASSWORD}@localhost/{DB_NAME}'
db = SQLAlchemy(app)

# Model dla tabeli "location"
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

# Endpoint do prognozowania pogody
@app.route('/forecast_weather', methods=['GET'])
def forecast_weather():
    try:
        # Pobierz nazwę miasta z parametru zapytania
        city_name = request.args.get('cityName')

        # Sprawdź, czy podano nazwę miasta
        if not city_name:
            return jsonify({'error': 'Brak nazwy miasta w parametrze zapytania'}), 400

        # Pobierz dane lokalizacyjne z bazy danych na podstawie nazwy miasta
        location = Location.query.filter_by(city=city_name).first()

        # Sprawdź, czy znaleziono lokalizację
        if location:
            # Jeśli znaleziono lokalizację, użyj jej latitude i longitude do pobrania danych historycznych pogody
            latitude = location.latitude
            longitude = location.longitude

            # Zbuduj URL zapytania do zewnętrznego API pogodowego
            url = f'https://archive-api.open-meteo.com/v1/archive?latitude={latitude}&longitude={longitude}&start_date=2024-03-01&end_date=2024-04-07&hourly=temperature_2m'

            # Wykonaj zapytanie HTTP GET do zewnętrznego API
            response = requests.get(url)

            # Sprawdź odpowiedź
            if response.status_code == 200:
                # Jeśli odpowiedź jest udana, przygotuj dane pogodowe do prognozowania
                weather_data = response.json()
                time = np.array([datetime.strptime(date, '%Y-%m-%dT%H:%M') for date in weather_data['hourly']['time']])
                temperature_2m = np.array(weather_data['hourly']['temperature_2m'])

                # Prognozuj temperaturę na najbliższe 10 dni przy użyciu regresji liniowej
                model = LinearRegression()
                X = np.array([(date - time[0]).total_seconds() / (60 * 60) for date in time]).reshape(-1, 1)
                model.fit(X, temperature_2m)
                future_dates = [time[-1] + timedelta(days=i) for i in range(1, 11)]
                future_X = np.array([(date - time[0]).total_seconds() / (60 * 60) for date in future_dates]).reshape(-1, 1)
                forecast_temperature = model.predict(future_X)

                # Zaokrąglij temperaturę do jednego miejsca po przecinku
                forecast_temperature = np.round(forecast_temperature, 1)

                # Przygotuj dane prognozowe do odpowiedzi
                forecast_data = {
                    'future_dates': [date.strftime('%Y-%m-%dT%H:%M') for date in future_dates],
                    'forecast_temperature': forecast_temperature.tolist()
                }
                return jsonify(forecast_data)
            else:
                # Jeśli wystąpił błąd, zwróć odpowiedni komunikat
                return jsonify({'error': 'Wystąpił błąd podczas pobierania danych pogodowych'}), response.status_code
        else:
            # Jeśli nie znaleziono lokalizacji, zwróć odpowiedni komunikat
            return jsonify({'error': 'Nie znaleziono danych lokalizacyjnych dla podanej lokalizacji'}), 404
    except Exception as e:
        # Obsłuż wyjątek i zwróć odpowiedni komunikat
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
