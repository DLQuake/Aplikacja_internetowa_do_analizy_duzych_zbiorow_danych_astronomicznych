from flask import Flask
from routes import forecast_weather
from models import db
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

app.route('/forecast_weather', methods=['GET'])(forecast_weather)

if __name__ == '__main__':
    app.run(port=5001, debug=True)
