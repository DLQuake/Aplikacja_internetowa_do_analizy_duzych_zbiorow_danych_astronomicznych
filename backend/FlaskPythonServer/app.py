from flask import Flask
from routes import forecast_weather
from models import db
from config import Config
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

app.route('/forecast_weather', methods=['GET'])(forecast_weather)


if __name__ == '__main__':
    port = int(os.getenv("APP_FLASK_PORT"))
    app.run(port=port, debug=True)
