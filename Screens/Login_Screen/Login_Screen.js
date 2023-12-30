import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  Pressable,
  Modal,
} from "react-native";
import Login_Styles from "./Login_Styles";
import { CommonActions, useNavigation } from "@react-navigation/native";
import Header from "../../Components/Header_Shorex";
import Toast from "react-native-root-toast";
import GlobalFonts from "../../Utils/GlobalFonts";
import ApiController from "../../Api/ApiController";
import GlobalStyles from "../../Utils/GlobalStyles";
import Config from "../../Api/Config";
import { StatusBar } from "expo-status-bar";
import GlobalColors from "../../Utils/GlobalColors";
import OwnStorage from "../../Api/StorageController";
import { useDispatch } from "react-redux";
import RNRestart from "react-native-restart";

import NetInfo from "@react-native-community/netinfo";
import {
  DriverThumbnail,
  DriverDetails,
  Driverterms,
  Driverprivacypolicy,
} from "../../Redux/Reducers/DriverInfo";
import Forgot_Password_Styles from "../Forgot_Password/Forgot_Password_Styles";
import NoInternet from "../../Components/nointernet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import strings from "../../constants/lng/LocalizedStrings";

export default function Login() {
  const [nointernet, setnointernet] = useState(false);
  const clearState = () => {
    setusername("");
    setpassword("");
  };

  const navigation = useNavigation();
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [showloaderM, setshowloaderM] = useState(false);
  const [usernameisValid, setusernameisValid] = useState(true);
  const [passwordisValid, setpasswordisValid] = useState(true);
  const [showModal, SetshowModal] = useState(false);
  const [lang, setLang] = useState("");
  const dispatch = useDispatch();

  const [showpassword, setShowPassword] = useState(true);

  const { Profile } = useSelector((state) => state.driverdetails);

  var api = new ApiController();
  var Localdata = new OwnStorage();
  const presshandler = () => {
    Keyboard.dismiss();
  };
  const SendFCM = async (token) => {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    console.log("fcmToken", fcmToken);

    let data = new FormData();

    data.append("platform", "android");
    data.append("key", "playerid");
    data.append("value", fcmToken);
    console.log(data);
    api
      .sendFCM(token, data)
      .then((res) => {
        navigation.navigate("DrawerMenu", { screen: "BottomTabNavigation" });

        console.log("notificationfromLogin:", res.data);
      })
      .catch((error) => {
        console.log("errorrr:", error.message);
        if (error.response.status == 401) {
          Toast.show("You are Blocked by the Admin");
          navigation.navigate("Login");
        }
      });
  };

  const onChangeLng = (lng) => {
    if (lng === "en") {
      Localdata.setvalue("language", "en");
      console.log("enenenenenenenenenenenglish");
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      navigation.dispatch(resetAction); //strings.setLanguage(lng);
      return;
    }
    if (lng === "es") {
      Localdata.setvalue("language", "es");
      console.log("esesesespanish");
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      navigation.dispatch(resetAction); // strings.setLanguage(lng);
      return;
    }
  };
  const setlngSpanish = () => {
    Localdata.setvalue("language", "es");
    onChangeLng("es");
  };

  const setlngEnglish = () => {
    Localdata.setvalue("language", "en");
    onChangeLng("en");
  };
  // const selectedLng = async () => {
  //   const lngData = await AsyncStorage.getItem("language");
  //   console.log("abhi language ye wali h", lngData);
  //   if (!!lngData) {
  //     strings.setLanguage(lngData);
  //   }
  // };
  useEffect(async () => {
   //AYA's EDIT
    // const lngData = await AsyncStorage.getItem("language");
    const lngData = 'en'

    if (!!lngData) {
      strings.setLanguage(lngData);
    }
    setLang(lngData);
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
  const getprivacypolicy = async (token) => {
    api
      .Getprivacypolicy(token)
      .then((res) => {
        console.log("privacy policy:", res.data.data);
        dispatch(Driverprivacypolicy(res.data.data));
      })
      .catch((error) => {
        console.log("privacy policy:", error);
        if (error.response.status == 401) {
          Toast.show("You are Blocked by the Admin");
          navigation.navigate("Login");
        }
      });
  };
  const gettermsandconditions = async (token) => {
    api
      .GetTermsandConditions(token)
      .then((res) => {
        console.log("terms and conditions:", res.data.data);
        dispatch(Driverterms(res.data.data));
      })
      .catch((error) => {
        if (error.response.status == 401) {
          Toast.show("You are Blocked by the Admin");
          navigation.navigate("Login");
        }
        console.log("terms and conditions:", error.message);
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
          console.log("Undefineeeeeeeed thumbnailllllsss");
        } else {
          dispatch(DriverThumbnail(res.data.data.avatar.url));
          console.log("thumbnailllllllalll123:", res.data.data.avatar.url);
        }

        ///////////////////PROFILEDATA/////////////////////////

        console.log("profile data :", res.data.data);

        Localdata.UpdateUserID(res.data.data.id);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          Toast.show("You are Blocked by the Admin");
          navigation.navigate("Login");
        }
        console.log("error in profile:", error);
      });
  };

  const goToHome = () => {
    // setTimeout(() => {
    // }, 1000);
    navigation.navigate("DrawerMenu", { screen: "BottomTabNavigation" });
  };
  const gotologin = () => {
    // setTimeout(() => {
    //   navigation.navigate("DrawerMenu", { screen: "BottomTabNavigation" });
    // }, 1000);

    navigation.navigate("Login");
  };

  const SaveDataLocally = async (token, username, password) => {
    await Localdata.SaveLoginPref(token, username, password);
    await Localdata.setvalue("Skip_Login", "y");
    var usernamelc = await Localdata.getvalue("username_Driver");
    var tokenlc = await Localdata.getvalue("api_token_Driver");
    var passwordlc = await Localdata.getvalue("password_Driver");
  };
  const Change_Language = () => {
    Alert.alert("Are you sure you want to change Language?");
  };
  const login_button_press = () => {
    setshowloaderM(true);
    if (username === "") {
      setusernameisValid(false);
      Toast.show("The username field is required");
      setshowloaderM(false);
      return;
    }
    if (password === "") {
      setpasswordisValid(false);
      Toast.show("The password field is required");
      setshowloaderM(false);

      return;
    }

    api
      .Login(username, password)
      .then((res) => {
        setshowloaderM(false);

        let apitoken = res.data.data.api_token;
        const role = res.data.data.roles[0];

        if (role == Config.role) {
          SaveDataLocally(apitoken, username, password);
          SendFCM(apitoken);
          getprofile(apitoken);

          getprivacypolicy(apitoken);
          gettermsandconditions(apitoken);
          console.log("responce:", res);
          console.log("apitoken:", apitoken);
          console.log("Roleee:", role);

          goToHome();
        } else {
          Toast.show("Only Drivers Are Allowed In this App");
        }
      })
      .catch((error) => {
        console.log("errorrr:", error.response.data.error);
        setshowloaderM(false);
        Toast.show(error.response.data.error);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : ""}
      style={GlobalStyles.FlexOne}
    >
      <TouchableWithoutFeedback onPress={() => presshandler()}>
        <ScrollView style={GlobalStyles.FlexOne} bounces={false}>
          <StatusBar style="dark" backgroundColor={GlobalColors.Yellow} />
          <View style={Login_Styles.Main_container}>
            <Header></Header>
            <View style={[Login_Styles.LanguageViewM, GlobalStyles.FlexOne]}>
              <Image
                style={Login_Styles.languageGlobe}
                source={require("../../assets/internet.png")}
              ></Image>
              <TouchableOpacity
                style={Login_Styles.LanguageDropdown}
                onPress={() => SetshowModal(true)}
              >
                <Text
                  style={[GlobalFonts.FontMedium, Login_Styles.LanguageTxt]}
                >
                  {lang == "" || lang == undefined || lang == "es"
                    ? "en"
                    : "es"}
                </Text>
                <Image source={require("../../assets/down.png")}></Image>
              </TouchableOpacity>
            </View>

            <View style={Login_Styles.child_view}>
              <Text style={Login_Styles.text}>
                {strings.HELLO} {Profile.first_name}{" "}
              </Text>
              <View style={Login_Styles.text_style_name}>
                <Text
                  style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold" }}
                >
                  {strings.EMAIL}
                </Text>
                <View style={{ justifyContent: "flex-end" }}>
                  {!usernameisValid && (
                    <Text
                      style={[
                        GlobalStyles.inputErrorTxt,
                        GlobalStyles.fullwidth,
                      ]}
                    >
                      *this field is required
                    </Text>
                  )}
                </View>
              </View>
              <View style={Login_Styles.text_input}>
                <TextInput
                  onChangeText={(Text) => {
                    {
                      if (Text == "") {
                        setusernameisValid(false);
                      } else {
                        setusername(Text);
                        setusernameisValid(true);
                      }
                    }
                  }}
                ></TextInput>
              </View>
              <View style={Login_Styles.text_style_name}>
                <Text
                  style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold" }}
                >
                  {strings.PASSWORD}
                </Text>
                <View style={{ justifyContent: "flex-end" }}>
                  {!passwordisValid && (
                    <Text
                      style={[
                        GlobalStyles.inputErrorTxt,
                        GlobalStyles.fullwidth,
                      ]}
                    >
                      *this field is required
                    </Text>
                  )}
                </View>
              </View>
              <View style={Login_Styles.text_input}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TextInput
                    style={{ width: "80%" }}
                    password={true}
                    secureTextEntry={showpassword}
                    onChangeText={(Text) => {
                      {
                        if (Text == "") {
                          setpasswordisValid(false);
                        } else {
                          setpassword(Text);
                          setpasswordisValid(true);
                        }
                      }
                    }}
                  ></TextInput>
                </View>
              </View>

              <View style={{ marginTop: 10 }}>
                <Pressable
                  onPress={() => {
                    navigation.navigate("Forgot_Password");
                  }}
                >
                  <Text style={Login_Styles.forgot_pass}>
                    {strings.FORGOTPASSWORD}
                  </Text>
                </Pressable>
              </View>

              <TouchableOpacity
                style={GlobalStyles.ButtonMain}
                onPress={() => {
                  login_button_press();
                }}
              >
                <View style={[GlobalStyles.FlexDirectionRow]}>
                  {showloaderM && (
                    <ActivityIndicator
                      size="small"
                      color="white"
                      style={[GlobalStyles.activityIndicator]}
                    ></ActivityIndicator>
                  )}
                  <Text style={GlobalStyles.ButtonTextMain}>
                    {strings.LOGIN}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View>
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
                  <View style={Login_Styles.modal_view}>
                    <View style={Login_Styles.warning_modal}>
                      <Text
                        style={[
                          GlobalStyles.regularText,
                          {
                            color: "#6E6E6E",
                            marginTop: "10%",
                            alignSelf: "center",
                            paddingHorizontal: "2%",
                          },
                        ]}
                      >
                        {strings.AREYOUSRURELANG}
                      </Text>
                      <View style={{}}>
                        <TouchableOpacity
                          style={[
                            GlobalStyles.ButtonMain,
                            { alignSelf: "center" },
                          ]}
                          onPress={() => {
                            if (lang == "es") {
                              SetshowModal(false), setlngEnglish();
                            } else {
                              SetshowModal(false), setlngSpanish();
                            }
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
                </TouchableWithoutFeedback>
              </Modal>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      <NoInternet internet={nointernet} />
    </KeyboardAvoidingView>
  );
}
