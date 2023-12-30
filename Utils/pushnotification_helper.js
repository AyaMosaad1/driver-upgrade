import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import PushNotification from "react-native-push-notification";

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
export async function requestUserPermissions() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
    getFcmToken();
  }
}

const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem("fcmToken");
  console.log("the user old token===>", fcmToken);
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log("new generated fcm token===>", fcmToken),
          await AsyncStorage.setItem("fcmToken", fcmToken);
      }
    } catch (error) {
      console.log("error rasied fcm token===>", error);
      Toast.show(error.message);
    }
  }
};

// export const NotificationListener = async () => {
//   const disptach = useDispatch();
//   // Assume a message-notification contains a "type" property in the data payload of the screen to open

//   messaging().onNotificationOpenedApp((remoteMessage) => {
//     console.log(
//       "Notification caused app to open from background state:",
//       remoteMessage.notification
//     );
//     // Check whether an initial notification is available
//     messaging()
//       .getInitialNotification()
//       .then((remoteMessage) => {
//         if (remoteMessage) {
//           console.log(
//             "Notification caused app to open from quit state:",
//             remoteMessage.notification
//           );
//         }
//       });
//     //navigation.navigate(remoteMessage.data.type);
//   });
//   //   messaging().onNotificationOpenedApp((remoteMessage) => {
//   //     if (remoteMessage.data.entity === "ideas") {
//   //       console.log(
//   //         "Notification caused app to open from background state:",
//   //         remoteMessage.data.id
//   //       );
//   //     //   let ids = JSON.parse(remoteMessage.data.id);
//   //     //   RootNavigation.navigate("NotificationCards", {
//   //     //     IDs: ids,
//   //     //   });
//   //     }
//   //   });

//   messaging().onMessage(async (remoteMessage) => {
//     // if (remoteMessage.data.entity === "ideas") {
//     console.log("recived in foreground===>", remoteMessage);

//     PushNotification.localNotification({
//       channelId: "shorex driver app notifications",
//       message: remoteMessage.notification.body,
//       title: remoteMessage.notification.title,
//       bigPictureUrl: remoteMessage.notification.android.imageUrl,
//       smallIcon: remoteMessage.notification.android.imageUrl,
//     });
//     // let ids = JSON.parse(remoteMessage.data.id);
//     // RootNavigation.navigate("NotificationCards", {
//     //   IDs: ids,
//     // });
//     // }
//   });

//   //   messaging()
//   //     .getInitialNotification()
//   //     .then(async (remoteMessage) => {
//   //       if (remoteMessage.data.entity === "ideas") {
//   //         let ids = JSON.parse(remoteMessage.data.id);
//   //         await AsyncStorage.setItem("postIDs", JSON.stringify(ids));
//   //         let storage = await AsyncStorage.getItem("postIDs");
//   //         console.log("storage", storage);
//   //         RootNavigation.navigate("NotificationCards", {
//   //           IDs: ids,
//   //         });
//   //         console.log(
//   //           "Notification caused app to open from quit state:",
//   //           remoteMessage.data.id
//   //         );
//   //       }
//   //     });

//   // messaging().onMessage(async (remoteMessage) => {
//   //   console.log("Notification on forground state", remoteMessage);
//   // });
// };
