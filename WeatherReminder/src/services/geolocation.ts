import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { Coordinates } from "../types/types";

const GEOLOCATION_STORAGE_KEY = 'weatherReminder:coordinates';

export const getStoredCoordinates = async (): Promise<Coordinates | null> => {
  const storedCoords = await AsyncStorage.getItem(GEOLOCATION_STORAGE_KEY);
  return storedCoords ? JSON.parse(storedCoords) : null;
};

const requestGeolocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    const status = await Geolocation.requestAuthorization('whenInUse');
    return status === 'granted';
  }

  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Дозвіл на використання геолокації',
          message: 'WeatherReminder потребує доступ до вашої геолокації для отримання прогнозу погоди.',
          buttonNeutral: 'Пізніше',
          buttonNegative: 'Відмовити',
          buttonPositive: 'Дозволити',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Помилка запиту дозволу на геолокацію:', error);
      return false;
    }
  }

  return false;
};

export const requestPermissionAndGetCoordinates = async (): Promise<Coordinates | null> => {
  const hasPermission = await requestGeolocationPermission();

  if (!hasPermission) {
    Alert.alert('Увага', 'Дозвіл на геолокацію не надано.');
    return await getStoredCoordinates();
  }

  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const coords: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        await AsyncStorage.setItem(GEOLOCATION_STORAGE_KEY, JSON.stringify(coords));
        resolve(coords);
      },
      (error) => {
        console.error('Помилка отримання геолокації:', error);
        getStoredCoordinates().then((storedCoords) => {
          if (storedCoords) {
            Alert.alert('Помилка', 'Не вдалося отримати поточну локацію. Використовуються останні збережені координати.');
            resolve(storedCoords);
          } else {
            Alert.alert('Помилка', 'Не вдалося отримати координати. Перевірте налаштування геолокації пристрою.');
            resolve(null);
          }
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
};
