import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import GlobalColors from "../../../Utils/GlobalColors";
import {
  Text,
  View,
  LogBox,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  BackHandler,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import OwnStorage from "../../../Api/StorageController";
import strings from "../../../constants/lng/LocalizedStrings";
import { useDispatch, useSelector } from "react-redux";
import ApiController from "../../../Api/ApiController";

import GlobalStyles from "../../../Utils/GlobalStyles";
import {
  DriverCoordinates,
  DriverDetails,
  Driverprivacypolicy,
  Driverterms,
  DriverThumbnail,
  NotificationCount,
  NotificationsRes,
} from "../../../Redux/Reducers/DriverInfo.js";
import Home_Screen_Styles from "./Home_Screen_Styles.js";
import Header_Global from "../../../Components/Header_Global";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-root-toast";
import NoInternet from "../../../Components/nointernet";
import Api from "../../../Api/Api";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const dispatch = useDispatch();
  const { Profile } = useSelector((state) => state.driverdetails);
  const [cardcolor, setcardcolor] = useState("#ffff");
  const [nointernet, setnointernet] = useState(false);
  const [lang, setLang] = useState("en");

  var api = new ApiController();
  var Localdata = new OwnStorage();
  const navigation = useNavigation();
  const selectedLng = async () => {
    //MY EDIT
    // const lngData = await AsyncStorage.getItem("language");
    const lngData = 'en'
    console.log("abhi language ye wali h", lngData);
    strings.setLanguage('en');
    //// if (!!lngData) {
    //   strings.setLanguage(lngData);
    // }
  };
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  useEffect(async () => {
    await selectedLng();
    //MY EDIT
    // const lngData = await AsyncStorage.getItem("language");
   const lngData = 'en';
    console.log("langg", lngData);
    setLang(lngData);
    var tokenlc = await Localdata.getvalue("api_token_Driver");
    getprofile(tokenlc), getprivacypolicy();
    gettermsandconditions();
    getNotifications();
  }, []);

  const getNotifications = () => {
    let path = "userNotifications?limit=100000";
    Api.request("get", path)
      .then((response) => {
        dispatch(NotificationsRes(response.data));
        console.log("cehecece", response.data);
        // setNotifications(response.data);
        console.log("noti count", response.data.length);
        dispatch(NotificationCount(response.data.length));
      })
      .catch((error) => {
        console.log("error", error.message);

        Toast.show(error.message);
      });
  };

  const getprivacypolicy = async () => {
    api
      .Getprivacypolicy()
      .then((res) => {
        if (lang == "es") {
          console.log("privacy policy: spanish", res.data.description_fr);

          dispatch(Driverprivacypolicy(res.data.description_fr));
        } else {
          dispatch(Driverprivacypolicy(res.data.description));

          console.log("privacy policy:", res.data.description);
        }
      })
      .catch((error) => {
        console.log("privacy policy:", error);
        if (error.response.status == 401) {
          Toast.show("You are Blocked by the Admin");
          navigation.navigate("Login");
        }
      });
  };
  const gettermsandconditions = async () => {
    api
      .GetTermsandConditions()
      .then((res) => {
        if (lang == "es") {
          console.log("terms and conditions:", res.data.description_fr);

          dispatch(Driverterms(res.data.description_fr));
        } else {
          console.log("terms and conditions: english", res.data.description);

          dispatch(Driverterms(res.data.description));
        }
      })
      .catch((error) => {
        console.log("terms and conditions:", error.message);
        if (error.response.status == 401) {
          Toast.show("You are Blocked by the Admin");
          navigation.navigate("Login");
        }
      });
  };

  const getprofile = async (token) => {
    api
      .getProfile(token)
      .then((res) => {
        // dispatch(setprofiledata(res.data.data));
        // disablePush(setProfilePoints(res.data.data.earned_pts));
        ///////////////////PROFILEDATA/////////////////////////
        dispatch(DriverDetails(res.data.data));

        if (res.data.data.avatar == undefined) {
          console.log("Undefineeeeeeeed thumbnailllllsss from homee");
        } else {
          dispatch(DriverThumbnail(res.data.data.avatar.url));
          console.log(
            "thumbnailllllllalll123 from homee:",
            res.data.data.avatar.url
          );
        }

        ///////////////////PROFILEDATA/////////////////////////

        console.log("profile data from homee :", res.data.data);

        Localdata.UpdateUserID(res.data.data.id);
      })
      .catch((error) => {
        console.log("error in profile:", error);
        if (error.response.status == 401) {
          Toast.show("You are Blocked by the Admin");
          navigation.navigate("Login");
        }
      });
  };
  const icons = {
    pics: {
      1: require("../../../assets/pickupreq.png"),
      2: require("../../../assets/pickuphistory.png"),
      3: require("../../../assets/vehicleload.png"),
    },
  };
  const [gridimage, setgridimage] = useState(
    require("../../../assets/gridactive.png")
  );
  const [listimage, setlistimage] = useState(
    require("../../../assets/listinactive.png")
  );
  const [numCols, setColumnNo] = useState(3);
  const [listflex, setlistflex] = useState("");
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);

      if (state.isConnected === false) {
        setnointernet(true);
      } else if (state.isConnected === true) {
        setnointernet(false);
      }
    });
    // return () => {
    //   unsubscribe();
    // };
  });
  useEffect(async () => {
    let { status } = await Location.requestBackgroundPermissionsAsync();
    let { status2 } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted" && status2 !== "granted") {
      // Toast.show("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    });
    dispatch(
      DriverCoordinates({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      })
    );

    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);
  const Cardname = [
    {
      id: 1,
      name: strings.PICKUPREQUEST,
    },
    {
      id: 2,
      name: strings.PICKUPHISTORY,
    },
    {
      id: 3,
      name: strings.VEHICLELOAD,
    },
  ];
  const GridView = ({ id, name }) => (
    <TouchableOpacity
      style={[
        numCols === 3
          ? Home_Screen_Styles.gridStyle
          : Home_Screen_Styles.listStyle,
        { backgroundColor: cardcolor },
      ]}
      onPress={() => {
        if (id == 1) {
          navigation.navigate("PickupReq");
        } else if (id == 2) {
          navigation.navigate("Pickup_History");
        } else {
          navigation.navigate("VehicleLoad");
        }
      }}
    >
      <Image source={icons.pics[id]} style={GlobalStyles.IconsStyle}></Image>
      <Text
        style={
          numCols === 3
            ? Home_Screen_Styles.gridText
            : Home_Screen_Styles.listText
        }
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
  if (Profile.uuid == "" || Profile.uuid == undefined) {
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        size="large"
        color={GlobalColors.Green}
      >
        <StatusBar style="dark" backgroundColor={GlobalColors.Yellow} />
      </ActivityIndicator>
    );
  } else {
    return (
      <View
        style={[Home_Screen_Styles.container, GlobalStyles.FlexDirectionColumn]}
      >
        <StatusBar style="dark" backgroundColor={GlobalColors.Yellow} />

        <Header_Global Title={strings.HOME} />
        <View style={GlobalStyles.cardview}>
          <View
            style={[
              GlobalStyles.cardview,
              { backgroundColor: "white", marginTop: 10 },
            ]}
          >
            <View style={Home_Screen_Styles.imgview}>
              <Image
                source={require("../../../assets/homeimg.png")}
                style={Home_Screen_Styles.home_banner}
              ></Image>
            </View>
            <View style={Home_Screen_Styles.GridListView}>
              <TouchableOpacity
                onPress={() => {
                  setColumnNo(1);

                  setgridimage(require("../../../assets/gridinactive.png"));
                  setlistimage(require("../../../assets/listactive.png"));
                }}
                style={{ marginLeft: 0 }}
              >
                <Image source={listimage}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setColumnNo(3);
                  setgridimage(require("../../../assets/gridactive.png"));
                  setlistimage(require("../../../assets/listinactive.png"));
                }}
                style={{ marginLeft: 10, marginRight: 15 }}
              >
                <Image source={gridimage}></Image>
              </TouchableOpacity>
            </View>

            <View style={Home_Screen_Styles.buttons_row}>
              {numCols == 3 ? (
                <FlatList
                  key={"_"}
                  data={Cardname}
                  renderItem={({ item }) => (
                    <GridView name={item.name} id={item.id} />
                  )}
                  keyExtractor={(item) => item.id}
                  numColumns={3}
                />
              ) : (
                <FlatList
                  key={"#"}
                  data={Cardname}
                  renderItem={({ item }) => (
                    <GridView name={item.name} id={item.id} />
                  )}
                  keyExtractor={(item) => item.id}
                  numColumns={1}
                />
              )}
            </View>
          </View>
        </View>
        <NoInternet internet={nointernet} />
      </View>
    );
  }
}
