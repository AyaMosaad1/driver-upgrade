import React, { useEffect, useState } from "react";
import { CommonActions, DrawerActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import OwnStorage from "../Api/StorageController";

import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Modal,
  Linking,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { useSelector } from "react-redux";
import GlobalStyles from "../Utils/GlobalStyles";
import RNRestart from "react-native-restart";
import {
  DriverinfoStoreReseted,
  DriverThumbnail,
} from "../Redux/Reducers/DriverInfo";
import { useDispatch } from "react-redux";
import strings from "../constants/lng/LocalizedStrings";

const CustomSidebarMenu = (props) => {
  const [showModal, SetshowModal] = useState(false);
  const [changelng, setchangelng] = useState("");
  const { Profile } = useSelector((state) => state.driverdetails);
  const navigation = useNavigation();
  const { thumbnail } = useSelector((state) => state.driverdetails);
  const [selectedlang, setselectedlang] = useState("en");

  var localdata = new OwnStorage();
  const dispatch = useDispatch();
  useEffect(async () => {
    console.log("valueee", await localdata.getvalue("language"));
    setselectedlang(await localdata.getvalue("language"));
  });
  const LogoutfromPreff = () => {
    localdata
      .Logout()
      .then((res) => {
        const resetAction = CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
        navigation.dispatch(resetAction);

        // navigation.navigate("LoginForm");
        // navigation.dispatch(DrawerActions.closeDrawer());
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };
  const onChangeLng = (lng) => {
    if (lng === "en") {
      localdata.setvalue("language", "en");
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
      navigation.dispatch(resetAction);

      //strings.setLanguage(lng);
      return;
    }
    if (lng === "es") {
      localdata.setvalue("language", "es");
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
      navigation.dispatch(resetAction);

      // strings.setLanguage(lng);
      return;
    }
  };
  const onPressLogout = async () => {
    localdata
      .GetLoginPref()
      .then(async (token) => {
        console.log("token", token);
        dispatch(DriverinfoStoreReseted());
        dispatch(DriverThumbnail());
        LogoutfromPreff();
        localdata.setvalue("Skip_Login", "n");
      })
      .catch((error) => {
        console.log("error ", error);
      });
  };
  const setlngSpanish = () => {
    console.log("caleedspanish");
    localdata.setvalue("language", "es");
    onChangeLng("es");
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const setlngEnglish = () => {
    localdata.setvalue("language", "en");
    setchangelng("en");
    onChangeLng("en");
    navigation.dispatch(DrawerActions.closeDrawer());
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/*Top Large Image */}
      <View style={styles.sideMenuheader}>
        <View style={styles.Header_Details}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1%",
            }}
          >
            <Image
              style={{ height: 23, width: 130 }}
              source={require("../assets/Logo.png")}
            ></Image>
            <Image
              style={GlobalStyles.Drawerprofileimage}
              source={
                thumbnail ? { uri: thumbnail } : require("../assets/camera.png")
              }
            ></Image>
          </View>
          <Text style={{ fontFamily: "Poppins_600SemiBold", fontSize: 15 }}>
            {Profile.username}
          </Text>
          <Text
            style={{
              color: "#51AB1D",
              fontFamily: "Poppins_400Regular",
              fontSize: 10,
            }}
          >
            {Profile.nif}
          </Text>
        </View>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />

        <TouchableOpacity
          style={styles.customItemTop}
          onPress={() => {
            navigation.dispatch(DrawerActions.toggleDrawer());
            navigation.navigate("Profile");
          }}
        >
          <Image
            source={require("../assets/dprofile.png")}
            style={styles.iconStyle}
          />
          <Text style={{ fontFamily: "Poppins_600SemiBold", fontSize: 14 }}>
            {strings.PROFILE}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.customItem}
          onPress={() => {
            navigation.dispatch(DrawerActions.toggleDrawer());
            navigation.navigate("Change_Password", { modal: "false" });
          }}
        >
          <Image
            source={require("../assets/dchangepswd.png")}
            style={styles.iconStyle}
          />
          <Text style={{ fontFamily: "Poppins_600SemiBold", fontSize: 14 }}>
            {strings.PASSWORD}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.customItem} onPress={() => {}}>
          <Image
            source={require("../assets/dlanguage.png")}
            style={styles.iconStyle}
          />
          <Text style={{ fontFamily: "Poppins_600SemiBold", fontSize: 14 }}>
            {strings.LANGUAGES}
          </Text>
        </TouchableOpacity>
        {(selectedlang == "en" && selectedlang != "") ||
        selectedlang == undefined ? (
          <TouchableOpacity
            style={styles.customItemLanguage}
            onPress={() => {
              SetshowModal(true), setchangelng("es");
            }}
          >
            <Image
              source={require("../assets/dspanish.png")}
              style={{ marginRight: "5%", height: 17.59, width: 16.49 }}
            />
            <Text style={{ fontFamily: "Poppins_600SemiBold", fontSize: 12 }}>
              {strings.SPANISH}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.customItemLanguage}
            onPress={() => {
              SetshowModal(true), setchangelng("en");
            }}
          >
            <Image
              source={require("../assets/denglish.png")}
              style={{ marginRight: "5%", height: 17.59, width: 16.49 }}
            />
            <Text style={{ fontFamily: "Poppins_600SemiBold", fontSize: 12 }}>
              {strings.ENGLISH}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.customItem}
          onPress={() => {
            navigation.dispatch(DrawerActions.toggleDrawer());
            navigation.navigate("Privacy_Policy");
          }}
        >
          <Image
            source={require("../assets/dinfo.png")}
            style={styles.iconStyle}
          />
          <Text style={{ fontFamily: "Poppins_600SemiBold", fontSize: 14 }}>
            {strings.PRIVACYPOLICY}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customItem}
          onPress={() => {
            navigation.dispatch(DrawerActions.toggleDrawer());
            navigation.navigate("Terms_Conditions");
          }}
        >
          <Image
            source={require("../assets/dinfo.png")}
            style={styles.iconStyle}
          />
          <Text style={{ fontFamily: "Poppins_600SemiBold", fontSize: 14 }}>
            {strings.TERMCONDITONS}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customItem}
          onPress={() => {
            onPressLogout();
          }}
        >
          <Image
            source={require("../assets/dlogout.png")}
            style={styles.iconStyle}
          />
          <Text style={{ fontFamily: "Poppins_600SemiBold", fontSize: 14 }}>
            {strings.LOGOOUT}
          </Text>
        </TouchableOpacity>
        <View style={styles.body}>
          <Modal
            visible={showModal}
            onBackdropPress={() => SetshowModal(false)}
            transparent
            onRequestClose={() => SetshowModal(false)}
            animationType="slide"
            hardwareAccelerated
          >
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={() => {
                SetshowModal(false);
              }}
            >
              <View style={styles.modal_view}>
                <View style={styles.warning_modal}>
                  <Text
                    style={[
                      GlobalStyles.regularText,
                      {
                        color: "#6E6E6E",
                        marginTop: "10%",
                        alignSelf: "center",
                      },
                    ]}
                  >
                    {strings.AREYOUSRURELANG}
                  </Text>
                  <View>
                    <View
                      style={{
                        paddingTop: 25,
                        alignSelf: "center",
                      }}
                    >
                      <TouchableOpacity
                        style={GlobalStyles.ButtonMain}
                        onPress={() => {
                          changelng == "es" ? setlngSpanish() : setlngEnglish(),
                            SetshowModal(false);
                        }}
                      >
                        <View style={[GlobalStyles.FlexDirectionRow]}>
                          <Text style={GlobalStyles.ButtonTextMain}>
                            {strings.YES}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sideMenuheader: {
    resizeMode: "center",
    width: "100%",
    height: "18%",
    backgroundColor: "#FFE713",
    alignSelf: "flex-end",
  },
  iconStyle: {
    width: 20,
    height: 20,
    marginRight: "5%",
  },
  customItem: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 13,

    flexDirection: "row",
    alignItems: "center",
  },
  customItemTop: {
    paddingLeft: 16,
    paddingRight: 16,

    flexDirection: "row",
    alignItems: "center",
  },
  customItemLanguage: {
    paddingLeft: 35,
    paddingRight: 35,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  Header_Details: {
    marginLeft: "7%",
    marginRight: "7%",
    marginTop: "10%",
    height: "70%",
  },
  modal_view: {
    flex: 1,
    paddingTop: "30%",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
  warning_modal: {
    width: "90%",
    height: 200,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#707070",
    borderRadius: 8,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.57,
    shadowRadius: 15.19,

    elevation: 23,
  },
});

export default CustomSidebarMenu;
