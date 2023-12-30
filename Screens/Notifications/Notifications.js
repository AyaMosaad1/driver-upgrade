import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import Notification_card_item from "../../Components/Notification_card_item";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import { CommonActions, useNavigation } from "@react-navigation/native";
import Notifications_Styles from "./Notifications_Styles";
import GlobalStyles from "../../Utils/GlobalStyles";
import GlobalFonts from "../../Utils/GlobalFonts";
import CalendarPicker from "react-native-calendar-picker";
import Header_Global from "../../Components/Header_Global";
import GlobalColors from "../../Utils/GlobalColors";
import { useDispatch, useSelector } from "react-redux";
import {
  NotificationCount,
  NotificationsRes,
} from "../../Redux/Reducers/DriverInfo";
import Api from "../../Api/Api";
import Toast from "react-native-root-toast";
import moment from "moment";
import Home_Screen_Styles from "../Home/Home_Screen/Home_Screen_Styles";
import strings from "../../constants/lng/LocalizedStrings";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Notifications() {
  const dispatch = useDispatch();
  const { NotificationS } = useSelector((state) => state.driverdetails);
  const [selectedStartDate, setSelectedStartDate] = useState("Select a date");
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [calandermodal, setcalandermodal] = useState(false);
  const [noNotifictions, setnoNotifictions] = useState(false);
  const { Profile } = useSelector((state) => state.driverdetails);
  const [lang, setLang] = useState("en");

  const [FilterDate_notifications, setFilterDate_notifications] = useState();

  const navigation = useNavigation();
  const startDate = selectedStartDate ? selectedStartDate.toString() : "";
  useEffect(() => {
    getNotifications();

    // getNotifications();
  }, [FilterDate_notifications]);

  const getNotifications = async () => {
    // const lngData = await AsyncStorage.getItem("language");
    const lngData = 'en'

    console.log("langg", lngData);
    setLang(lngData);
    if (FilterDate_notifications) {
      dispatch(NotificationsRes(""));
      setnoNotifictions(true);
    }

    let path = FilterDate_notifications
      ? `userNotifications?created_at=${FilterDate_notifications}`
      : `userNotifications?`;
    Api.request("get", path)
      .then((response) => {
        console.log(response.data.length);
        if (response.data.length == 0) {
          setnoNotifictions(false);
        } else {
          setnoNotifictions(true);
        }
        dispatch(NotificationsRes(response.data));
        // console.log("cehecece", response.data);
        // // setNotifications(response.data);
        // console.log("noti count", response.data.length);
        dispatch(NotificationCount(response.data.length));
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.status == 401) {
          Toast.show("You are Blocked by the Admin");
          navigation.navigate("Login");
        }
        // for (const [key, value] of Object.entries(
        //   error.response.data.message
        // )) {
        //   console.log(`${key}: ${value}`);
        //   Toast.show(`${key}: ${value}`);
        // }
      });
  };

  const onDateChange = (date, type) => {
    //function to handle the date change
    if (type === "END_DATE") {
      setSelectedEndDate(date);
      setcalandermodal(false);
    } else {
      setSelectedEndDate(null);
      const maxDate = moment(date).format("YYYY-MM-DD");
      console.log("formated date", maxDate);
      setcalandermodal(false);
      setFilterDate_notifications(maxDate);
      setSelectedStartDate(maxDate);
    }
  };
  const renderItems = (item, i) => {
    console.log("image", item.notification_img && item.notification_img.url);
    const maxDate = moment(item.received_at).format("YYYY-MM-DD");

    return (
      <Notification_card_item
        key={i}
        cardLabel={lang == "es" ? item.title_fr : item.title_en}
        Datelabel={maxDate}
        Notificationdesc={lang == "es" ? item.text_fr : item.text_en}
        image={item.notification_img && item.notification_img.url}
      />
    );
  };

  if (NotificationS == "" || NotificationS == undefined) {
    if (noNotifictions == 0) {
      return (
        <View
          style={[
            Notifications_Styles.container,
            {
              // Try setting `flexDirection` to `"row"`.
              flexDirection: "column",
            },
          ]}
        >
          <View style={Notifications_Styles.header}>
            <TouchableOpacity
              style={GlobalStyles.backStyle}
              onPress={() =>
                navigation.navigate("BottomTabNavigation", { screen: "Home" })
              }
            >
              <Image
                style={GlobalStyles.backIcon}
                source={require("../../assets/back.png")}
              />
            </TouchableOpacity>
            <Text style={Notifications_Styles.headerTitle}>
              {strings.NOTIFICATIONS}
            </Text>
          </View>
          <View style={Home_Screen_Styles.cardview}>
            <View
              style={[
                Home_Screen_Styles.cardview,
                {
                  backgroundColor: "white",
                  marginTop: 10,
                  padding: 5,
                },
              ]}
            >
              <Text style={[GlobalStyles.HeaderText, { alignSelf: "center" }]}>
                {strings.NONOTIFICATIONYET}
              </Text>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={[
            Notifications_Styles.container,
            {
              // Try setting `flexDirection` to `"row"`.
              flexDirection: "column",
            },
          ]}
        >
          <View style={Notifications_Styles.header}>
            <TouchableOpacity
              style={GlobalStyles.backStyle}
              onPress={() =>
                navigation.navigate("BottomTabNavigation", { screen: "Home" })
              }
            >
              <Image
                style={GlobalStyles.backIcon}
                source={require("../../assets/back.png")}
              />
            </TouchableOpacity>
            <Text style={Notifications_Styles.headerTitle}>Notifications</Text>
          </View>
          <View style={Home_Screen_Styles.cardview}>
            <View
              style={[
                Home_Screen_Styles.cardview,
                {
                  backgroundColor: "white",
                  marginTop: 10,
                  padding: 5,
                },
              ]}
            >
              <ActivityIndicator
                style={{ flex: 1 }}
                size="large"
                color={GlobalColors.Green}
              ></ActivityIndicator>
            </View>
          </View>
        </View>
      );
    }
  } else {
    return (
      console.log("notifications", NotificationS),
      (
        <View
          style={[
            Notifications_Styles.container,
            {
              // Try setting `flexDirection` to `"row"`.
              flexDirection: "column",
            },
          ]}
        >
          <View style={Notifications_Styles.header}>
            <TouchableOpacity
              style={GlobalStyles.backStyle}
              onPress={() =>
                navigation.navigate("BottomTabNavigation", { screen: "Home" })
              }
            >
              <Image
                style={GlobalStyles.backIcon}
                source={require("../../assets/back.png")}
              />
            </TouchableOpacity>
            <Text style={Notifications_Styles.headerTitle}>Notifications</Text>
          </View>
          <View style={Home_Screen_Styles.cardview}>
            <View
              style={[
                Home_Screen_Styles.cardview,
                { backgroundColor: "white", marginTop: 10, padding: 5 },
              ]}
            >
              <ScrollView>
                {NotificationS.map(renderItems)}

                <View style={[Notifications_Styles.loadmore]}>
                  <Text
                    style={{ fontSize: 14, fontFamily: "Poppins_500Medium" }}
                  >
                    {strings.LOADMORE}
                  </Text>
                  <TouchableOpacity onPress={() => {}}>
                    <Image
                      source={require("../../assets/imagepicker.png")}
                      style={{ marginLeft: 10, height: 24, width: 24 }}
                    ></Image>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      )
    );
  }
}
