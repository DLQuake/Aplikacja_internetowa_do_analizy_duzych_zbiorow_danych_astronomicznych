from flask import jsonify, request
from models import Weather, db, Uzytkownicy
from flask_login import login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash

def init_routes(app):
    @app.route('/api/weather')
    def get_weather():
        weather_data = Weather.query.all()
        weather_list = []
        for weather in weather_data:
            weather_list.append({
                'temperature': weather.temperature,
                'conditions': weather.conditions
            })
        return jsonify(weather_list)

    @app.route('/api/register', methods=['POST'])
    def register():
        data = request.json
        imie = data.get('imie')
        nazwisko = data.get('nazwisko')
        email = data.get('email')
        login = data.get('login')
        haslo = data.get('haslo')
        conf_haslo = data.get('confPassword')

        if haslo != conf_haslo:
            return jsonify({'message': 'Hasło i potwierdzenie hasła nie są zgodne'}), 400

        existing_user = Uzytkownicy.query.filter((Uzytkownicy.email == email) | (Uzytkownicy.login == login)).first()
        if existing_user:
            return jsonify({'message': 'Użytkownik o podanym adresie e-mail lub nazwie użytkownika już istnieje'}), 400

        hashed_password = generate_password_hash(haslo)

        new_user = Uzytkownicy(imie=imie, nazwisko=nazwisko, email=email, login=login, haslo=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'Pomyślnie zarejestrowano użytkownika'}), 201

    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.json
        login = data.get('login')
        haslo = data.get('haslo')

        user = Uzytkownicy.query.filter_by(login=login).first()

        if user and check_password_hash(user.haslo, haslo):
            login_user(user)
            return jsonify({'message': 'Pomyślnie zalogowano'}), 200
        else:
            return jsonify({'message': 'Niepoprawny login lub hasło'}), 401

    @app.route('/api/logout', methods=['DELETE'])
    @login_required
    def logout():
        # Wyloguj użytkownika
        logout_user()
        return jsonify({'message': 'Pomyślnie wylogowano'}), 200
