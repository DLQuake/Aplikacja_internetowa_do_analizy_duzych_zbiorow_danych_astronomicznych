const API_URL = 'http://localhost:5000/api/weather';

const api = {
    getWeatherData: async () => {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        return await response.json();
    }
}

export default api;
