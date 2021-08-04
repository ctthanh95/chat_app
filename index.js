import 'react-native-gesture-handler';
import { AppRegistry, Platform } from 'react-native';
import PushNotification from "react-native-push-notification"
import messaging from '@react-native-firebase/messaging'
import App from './App';
import { name as appName } from './app.json';
PushNotification.configure({
    onRegister: function (token) {
        //console.log("TOKEN:", token);
    },
    onNotification: function (notification) {
        //console.log("NOTIFICATION:", notification);
    },
    onAction: function (notification) {
        //console.log("ACTION:", notification.action);
        //console.log("NOTIFICATION:", notification);
    },
    onRegistrationError: function (err) {
        // console.error(err.message, err);
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
});
messaging().setBackgroundMessageHandler(async remoteMessage => {
    //console.log('Message handled in the background!', remoteMessage);
});
AppRegistry.registerComponent(appName, () => App);
