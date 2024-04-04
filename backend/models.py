from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Weather(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    temperature = db.Column(db.Float)
    conditions = db.Column(db.String(100))


class Uzytkownicy(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    imie = db.Column(db.String(64))
    nazwisko = db.Column(db.String(64))
    email = db.Column(db.String(120), index=True, unique=True)
    login = db.Column(db.String(64), index=True, unique=True)
    haslo = db.Column(db.String(255))

    def set_password(self, password):
        self.haslo = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.haslo, password)

    def is_active(self):
        return True

    def get_id(self):
        return str(self.id)

    def is_authenticated(self):
        return True
