// notifications.js
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

async function checkAndStoreNotificationPermission() {
  try {
    const authStatus = await messaging().hasPermission();
    let enabled = false;
    if (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      enabled = true;
    } else {
      const newStatus = await messaging().requestPermission();
      enabled =
        newStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        newStatus === messaging.AuthorizationStatus.PROVISIONAL;
    }
    await AsyncStorage.setItem('notificationsEnabled', enabled ? 'true' : 'false');
    return enabled;
  } catch (error) {
    await AsyncStorage.setItem('notificationsEnabled', 'false');
    return false;
  }
}

async function areNotificationsEnabled() {
  const storedSetting = await AsyncStorage.getItem('notificationsEnabled');
  if (storedSetting !== null) {
    return storedSetting === 'true';
  }
  return await checkAndStoreNotificationPermission();
}

async function registerFCM() {
  try {
    const permissionGranted = await checkAndStoreNotificationPermission();
    if (!permissionGranted) {
      Alert.alert('Сповіщення вимкнені', 'Дозвіл на сповіщення не отримано.');
      return;
    }
    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);
  } catch (error) {
    Alert.alert('Помилка', 'Не вдалося увімкнути сповіщення: ' + error.message);
  }
}

function scheduleDailyNotification() {
  const now = new Date();
    const triggerTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      18,
      58,
      0
    );

    if (triggerTime < now) {
      triggerTime.setDate(triggerTime.getDate() + 1);
    }

    PushNotification.localNotificationSchedule({
      channelId: 'weather-reminder',
      title: 'Прогноз погоди',
      message: 'Перевірте сьогоднішній прогноз погоди',
      date: triggerTime,
      allowWhileIdle: false,
    });
}

export async function setupNotifications() {
  const notificationsEnabled = await areNotificationsEnabled();
  if (!notificationsEnabled) {
    console.log('Пуш-повідомлення відключені користувачем або дозвіл не отримано.');
    return;
  }
  await registerFCM();
  scheduleDailyNotification();
}
