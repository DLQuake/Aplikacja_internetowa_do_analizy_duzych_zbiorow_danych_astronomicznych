import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from models import db, Uzytkownicy
from routes import init_routes
from flask_login import LoginManager

load_dotenv()

app = Flask(__name__)
CORS(app)

db_username = os.getenv("DB_USERNAME")
db_password = os.getenv("DB_PASSWORD")
db_name = os.getenv("DB_NAME")
secret_key = os.getenv("SECRET_KEY")

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{db_username}:{db_password}@localhost/{db_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = secret_key

db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)

init_routes(app)

@login_manager.user_loader
def load_user(user_id):
    return Uzytkownicy.query.get(int(user_id))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
