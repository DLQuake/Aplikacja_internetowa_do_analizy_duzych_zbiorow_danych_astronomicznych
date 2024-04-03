from flask import jsonify, request
from models import Weather, db, User

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
        if not data:
            return jsonify({"message": "No data provided"}), 400

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        conf_password = data.get('confPassword')

        if not username or not email or not password or not conf_password:
            return jsonify({"message": "Brakujące wymagane pola"}), 400

        if password != conf_password:
            return jsonify({"message": "Hasła nie są zgodne"}), 400

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({"message": "Użytkownik już istnieje"}), 400

        existing_email = User.query.filter_by(email=email).first()
        if existing_email:
            return jsonify({"message": "Email już zarejestrowany"}), 400

        new_user = User(username=username, email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "Użytkownik zarejestrowany pomyślnie"}), 201

    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.json
        if not data:
            return jsonify({"message": "Brak danych"}), 400

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"message": "Brakująca nazwa użytkownika lub hasło"}), 400

        user = User.query.filter_by(username=username).first()
        if not user or not user.check_password(password):
            return jsonify({"message": "Nieprawidłowa nazwa użytkownika lub hasło"}), 401

        return jsonify({"message": "Logowanie powiodło się"}), 200
