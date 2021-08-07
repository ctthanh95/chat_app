import React, { useEffect } from 'react'
import PushNotification, { Importance } from "react-native-push-notification"
import messaging from '@react-native-firebase/messaging'
import Providers from './src/navigation'
import SplashScreen from 'react-native-splash-screen'

const App = () => {
  const createChanel = (channelId) => {
    PushNotification.createChannel(
      {
        channelId: channelId,
        channelName: "My channel",
        channelDescription: "A channel to categorise your notifications",
        playSound: false,
        soundName: "default",
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`
      )
    );
  }
  const showNotifications = (channelId, options) => {
    PushNotification.localNotification({
      channelId: channelId,
      largeIcon: "ic_launcher",
      smallIcon: "ic_notification",
      //bigText: "My big text that will be shown when notification is expanded",//
      subText: "",//
      largeIconUrl: "https://www.example.tld/picture.jpg",
      bigLargeIconUrl: "https://www.example.tld/bigicon.jpg",
      vibrate: true,
      vibration: 300,
      //actions: ["Yes", "No"],
      shortcutId: "shortcut-id",
      title: options.title,//
      message: options.message,
    });

  }
  useEffect(() => {
    SplashScreen.hide();
  }, [])
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      let chanelId = Math.random().toString(36).substring(7)
      showNotifications(chanelId,
        {
          title: remoteMessage.notification.title,
          message: remoteMessage.notification.body
        }
      )
      createChanel(chanelId)
    });
    return unsubscribe;
  }, []);
  return <Providers />
};

export default App;
