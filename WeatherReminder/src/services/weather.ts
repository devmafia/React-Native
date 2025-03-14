import AsyncStorage from '@react-native-async-storage/async-storage';
import { Coordinates, WeatherData } from "../types/types";

const API_KEY = '8a1d29dbd3b92ffd37084d8e724ae26b';

export async function getWeatherForecast({ latitude, longitude }: Coordinates): Promise<WeatherData | null> {

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! статус: ${response.status}`);
    }
    const data = await response.json();

    const weatherData: WeatherData = {
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    };

    await AsyncStorage.setItem('weatherData', JSON.stringify(weatherData));

    return weatherData;
  } catch (error) {
    console.error('Помилка отримання даних про погоду:', error);
    try {
      const cachedData = await AsyncStorage.getItem('weatherData');
      if (cachedData) {
        return JSON.parse(cachedData);
      } else {
        return null;
      }
    } catch (cacheError) {
      console.error('Помилка завантаження кешованих даних:', cacheError);
      return null;
    }
  }
}
