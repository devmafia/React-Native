// backgroundTask.js
import BackgroundTimer from 'react-native-background-timer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestPermissionAndGetCoordinates } from './geolocation';
import { getWeatherForecast } from './weather';

let intervalId = null;

export const startBackgroundTask = () => {
  intervalId = BackgroundTimer.setInterval(async () => {
    console.log('Фоновий таймер спрацював');
    try {
      const coords = await requestPermissionAndGetCoordinates();
      const data = await getWeatherForecast(coords);
      await AsyncStorage.setItem('weatherData', JSON.stringify(data));
      console.log('Прогноз погоди оновлено у фоні');
    } catch (error) {
      console.error('Помилка фонового завдання:', error);
    }
  }, 1 * 60 * 1000);
};

export const stopBackgroundTask = () => {
  if (intervalId !== null) {
    BackgroundTimer.clearInterval(intervalId);
    console.log('Фоновий таймер зупинено');
  }
};
