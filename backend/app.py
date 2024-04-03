import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from models import db
from routes import init_routes

load_dotenv()

app = Flask(__name__)
CORS(app)

db_username = os.getenv("DB_USERNAME")
db_password = os.getenv("DB_PASSWORD")
db_name = os.getenv("DB_NAME")

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{db_username}:{db_password}@localhost/{db_name}'

# Inicjalizacja bazy danych
db.init_app(app)

# Inicjalizacja tras
init_routes(app)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
