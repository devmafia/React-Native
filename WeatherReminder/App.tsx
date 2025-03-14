import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { requestPermissionAndGetCoordinates } from './src/services/geolocation';
import { getApp } from '@react-native-firebase/app';
import { getAnalytics, logEvent } from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWeatherForecast } from "./src/services/weather";
import { Coordinates, WeatherData } from "./src/types/types";
import { setupNotifications } from "./src/services/notifications";
import './global.css';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import { startBackgroundTask, stopBackgroundTask } from './src/services/backgroundTask';

const App = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(true);

  const analyticsRef = useRef(null);

  useEffect(() => {
    analyticsRef.current = getAnalytics(getApp());
    logEvent(analyticsRef.current, 'initialized');
  }, []);

  const logUserEvent = async (eventName: string, params = {}) => {
    if (!analyticsRef.current) return;
    try {
      await logEvent(analyticsRef.current, eventName, params);
    } catch (err) {
      console.error(`Error logging event ${eventName}:`, err);
    }
  };

  useEffect(() => {
    logUserEvent('app_open');
    logUserEvent('home_screen_view');

    const initializeStorage = async () => {
      try {
        const storedWeather = await AsyncStorage.getItem('weatherData');
        if (!storedWeather) {
          await AsyncStorage.setItem('weatherData', JSON.stringify({}));
        }
      } catch (error) {
        console.error('AsyncStorage initialization error:', error);
      }
    };

    initializeStorage();
  }, []);

  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: 'weather-reminder',
        channelName: 'Weather Reminder Channel',
        channelDescription: 'Канал для щоденних нагадувань про погоду',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Channel creation returned '${created}'`)
    );
    setupNotifications();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Message received:', remoteMessage);
      logUserEvent('push_notification_received', { messageId: remoteMessage.messageId });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const coords = await requestPermissionAndGetCoordinates();
        setCoordinates(coords);
        logUserEvent('geolocation_obtained', { latitude: coords.latitude, longitude: coords.longitude });
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchCoordinates();
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!coordinates) return;
      try {
        const data = await getWeatherForecast(coordinates);
        if (data) {
          setWeatherData(data);
          logUserEvent('weather_fetched', { temperature: data.temperature, description: data.description });
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [coordinates]);

  useEffect(() => {
    startBackgroundTask();
  }, []);

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-red-100">
        <Text className="text-red-600 text-lg font-semibold">
          Помилка: {error}
        </Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-blue-50">
        <ActivityIndicator size="large" color="#1E90FF" />
      </SafeAreaView>
    );
  }

  if (!weatherData) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-700 text-base">
          Не вдалося завантажити прогноз погоди.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-blue-50">
      <View className="px-6 py-8">
        <Text className="text-3xl font-bold text-blue-600 text-center mb-6">
          Прогноз погоди відповідно до геопозиції
        </Text>

        <TouchableOpacity onPress={() => logUserEvent('coordinates_view_tapped')}>
          <View className="bg-white rounded-xl shadow p-4 mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Ваші координати
            </Text>
            {coordinates ? (
              <Text className="text-base text-gray-600">
                {coordinates.latitude}, {coordinates.longitude}
              </Text>
            ) : (
              <ActivityIndicator size="small" color="#1E90FF" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => logUserEvent('weather_view_tapped')}>
          <View className="bg-white rounded-xl shadow p-4 mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Прогноз погоди
            </Text>
            <Text className="text-base text-gray-600">
              Температура: {weatherData.temperature}°C
            </Text>
            <Text className="text-base text-gray-600">
              Опис: {weatherData.description}
            </Text>
            <Text className="text-base text-gray-600">
              Вологість: {weatherData.humidity}%
            </Text>
            <Text className="text-base text-gray-600">
              Швидкість вітру: {weatherData.windSpeed} м/с
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            logUserEvent('weather_refresh_clicked');
            setLoading(true);
            try {
              const data = await getWeatherForecast(coordinates!);
              if (data) {
                setWeatherData(data);
                logUserEvent('weather_refreshed', { temperature: data.temperature, description: data.description });
              }
            } catch (error) {
              console.error('Error refreshing weather:', error);
            } finally {
              setLoading(false);
            }
          }}
          className="bg-blue-500 rounded-md shadow py-3 px-6 self-center"
        >
          <Text className="text-white font-semibold text-center">
            Оновити прогноз
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default App;
