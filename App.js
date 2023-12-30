import * as React from "react";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Main_StackNavigation from "./Navigations/Main_StackNavigation.js";
import Home_StackNavigation from "./Navigations/HomeStackNavigation.js";
import { RootSiblingParent } from "react-native-root-siblings";
import { StatusBar } from "expo-status-bar";
import GlobalColors from "./Utils/GlobalColors.js";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./Redux/store";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import OwnStorage from "./Api/StorageController.js";
import PushNotification from "react-native-push-notification";
import messaging from "@react-native-firebase/messaging";

import {
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import Toast from "react-native-root-toast";
import { requestUserPermissions } from "./Utils/pushnotification_helper";
import Api from "./Api/Api.js";
import Notifications from "./Screens/Notifications/Notifications.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  NotificationCount,
  NotificationsRes,
} from "./Redux/Reducers/DriverInfo.js";
import strings from "./constants/lng/LocalizedStrings.js";
function App() {
  PushNotification.createChannel(
    {
      channelId: "shorex driver app notifications", // (required)
      channelName: "com.shorexdriver", // (required)
      channelDescription: "manager notifications", // (optional) default: undefined.
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created) => console.log(`createChannel returned '${created}'`)
  );
  // const { thumbnail } = useSelector((state) => state.driverdetails);
  const localdata = new OwnStorage();

  const [skiplogin, setskiplogin] = useState(false);
  useEffect(async () => {
    requestUserPermissions();
    NotificationListener();
    //MY EDIT
    strings.setLanguage('en');
  }, []);

  const getNotifications = () => {
    let path = "userNotifications?limit=100000";
    Api.request("get", path)
      .then((response) => {
        store.dispatch(NotificationsRes(response.data));
        console.log("cehecece", response.data);
        // setNotifications(response.data);
        console.log("noti count", response.data.length);
        store.dispatch(NotificationCount(response.data.length));
      })
      .catch((error) => {
        console.log("errorappp", error.response);

        Toast.show(error.response);
      });
  };

  const NotificationListener = async () => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp((remoteMessage) => {
      getNotifications();

      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
      // Check whether an initial notification is available
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (remoteMessage) {
            getNotifications();

            console.log(
              "Notification caused app to open from quit state:",

              remoteMessage.notification
            );
          }
        });
      //navigation.navigate(remoteMessage.data.type);
    });
    //   messaging().onNotificationOpenedApp((remoteMessage) => {
    //     if (remoteMessage.data.entity === "ideas") {
    //       console.log(
    //         "Notification caused app to open from background state:",
    //         remoteMessage.data.id
    //       );
    //     //   let ids = JSON.parse(remoteMessage.data.id);
    //     //   RootNavigation.navigate("NotificationCards", {
    //     //     IDs: ids,
    //     //   });
    //     }
    //   });

    messaging().onMessage(async (remoteMessage) => {
      getNotifications();

      // if (remoteMessage.data.entity === "ideas") {
      console.log("recived in foreground===>", remoteMessage);
      PushNotification.localNotification({
        channelId: "shorex driver app notifications",
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        bigPictureUrl: remoteMessage.notification.android.imageUrl,
        smallIcon: remoteMessage.notification.android.imageUrl,
      });

      // let ids = JSON.parse(remoteMessage.data.id);
      // RootNavigation.navigate("NotificationCards", {
      //   IDs: ids,
      // });
      // }
    });

    //   messaging()
    //     .getInitialNotification()
    //     .then(async (remoteMessage) => {
    //       if (remoteMessage.data.entity === "ideas") {
    //         let ids = JSON.parse(remoteMessage.data.id);
    //         await AsyncStorage.setItem("postIDs", JSON.stringify(ids));
    //         let storage = await AsyncStorage.getItem("postIDs");
    //         console.log("storage", storage);
    //         RootNavigation.navigate("NotificationCards", {
    //           IDs: ids,
    //         });
    //         console.log(
    //           "Notification caused app to open from quit state:",
    //           remoteMessage.data.id
    //         );
    //       }
    //     });

    // messaging().onMessage(async (remoteMessage) => {
    //   console.log("Notification on forground state", remoteMessage);
    // });
  };

  const selectedLng = async () => {
    // const lngData = await AsyncStorage.getItem("language");
    strings.setLanguage('en');
    console.log("abhi language ye wali h", lngData);
    // if (!!lngData) {
    //   strings.setLanguage('en');
    // }
  };
  let [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });
  React.useEffect(async () => {
    var login = await localdata.getvalue("Skip_Login");

    console.log("themeMode:", login);

    if (login === "y") {
      console.log("value is true:");

      setskiplogin(true);
      console.log("skippppppp", skiplogin);
    } else {
      setskiplogin(false);
    }
  }, []);
  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     console.log("Connection type", state.type);
  //     console.log("Is connected?", state.isConnected);

  //     Toast.show(state.type);
  //   });
  //   // return () => {
  //   //   unsubscribe();
  //   // };
  // });
  if (!fontsLoaded) {
    return <AppLoading></AppLoading>;
  } else {
    if (skiplogin) {
      return (
        <Provider store={store}>
          <RootSiblingParent>
            <StatusBar style="light" backgroundColor={GlobalColors.Yellow} />
            <Home_StackNavigation />
          </RootSiblingParent>
        </Provider>
      );
    } else {
      return (
        <Provider store={store}>
          <RootSiblingParent>
            <StatusBar style="light" backgroundColor={GlobalColors.Yellow} />
            <Main_StackNavigation />
          </RootSiblingParent>
        </Provider>
      );
    }
  }
}

export default App;
