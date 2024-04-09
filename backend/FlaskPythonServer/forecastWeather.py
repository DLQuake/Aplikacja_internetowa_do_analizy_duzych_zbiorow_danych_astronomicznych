import sys
import json
from sklearn.linear_model import LinearRegression
import numpy as np

# Funkcja do przetwarzania danych i prognozowania tendencji temperatury
def predict_temperature_trend(data):
    try:
        # Wczytanie danych z obiektu JSON
        data = json.loads(data)

        # Przetwarzanie danych pogodowych
        temperatures = data['temperature']
        dates = data['date']

        # Przygotowanie danych do regresji liniowej
        X = np.arange(len(temperatures)).reshape(-1, 1)
        y = np.array(temperatures)

        # Utworzenie modelu regresji liniowej
        model = LinearRegression()

        # Dopasowanie modelu do danych
        model.fit(X, y)

        # Przewidywanie tendencji temperatury dla kolejnych dni
        future_dates = ['2024-04-08', '2024-04-09', '2024-04-10']  # Zakładamy prognozę na trzy dni
        future_X = np.arange(len(temperatures), len(temperatures) + len(future_dates)).reshape(-1, 1)
        future_temperatures = model.predict(future_X)

        # Formatowanie wyników
        result = {
            'future_dates': future_dates,
            'predicted_temperatures': future_temperatures.tolist()
        }

        # Zwracanie wyników
        return json.dumps(result)

    except Exception as e:
        # Obsługa błędów
        return json.dumps({'error': str(e)})


if __name__ == "__main__":
    # Odczyt danych przekazanych z argumentów wiersza poleceń
    data = sys.argv[1]

    # Wywołanie funkcji do przetwarzania danych i wyświetlenie wyniku
    print(predict_temperature_trend(data))
