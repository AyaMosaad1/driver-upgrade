import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../../Components/Header_Shorex";
import Toast from "react-native-root-toast";
import GlobalStyles from "../../../../Utils/GlobalStyles";
import OwnStorage from "../../../../Api/StorageController";
import ApiController from "../../../../Api/ApiController";
import { useDispatch } from "react-redux";
import {
  DriverinfoStoreReseted,
  DriverThumbnail,
} from "../../../../Redux/Reducers/DriverInfo";
import GlobalColors from "../../../../Utils/GlobalColors";
import strings from "../../../../constants/lng/LocalizedStrings";

export default function Change_Password({ route }) {
  const dispatch = useDispatch();
  const [showpassword, setShowPassword] = useState(true);
  const [showpassword2, setShowPassword2] = useState(true);
  const WIDTH = Dimensions.get("window").width;

  const [showloaderM, setshowloaderM] = useState(false);
  var localdata = new OwnStorage();
  var api = new ApiController();
  const navigation = useNavigation();
  const [pass, setpassword] = useState("");
  const [confirmpass, setconfirmpassword] = useState("");
  const presshandler = () => {
    Keyboard.dismiss();
  };

  const validate = () => {
    if (pass !== "" && confirmpass !== "") {
      return true;
    } else {
      return false;
    }
  };
  const submitt = () => {
    if (validate()) {
      savepassword();
    } else {
      if (pass != confirmpass) {
        Toast.show("password mismatch");
        return false;
      } else {
        Toast.show("Please Fill out all fields");
      }
    }
  };
  const LogoutfromPreff = () => {
    localdata
      .Logout()
      .then((res) => {
        Toast.show(strings.Passwordsuccessfulyupdated);
        setshowloaderM(false);
        navigation.navigate("Login");

        // navigation.navigate("LoginForm");
        // navigation.dispatch(DrawerActions.closeDrawer());
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };
  const savepassword = () => {
    if (pass.length < 8 || confirmpass.length < 8) {
      Toast.show("Password length should not be less than 8");
    } else {
      setshowloaderM(true);
      localdata
        .GetLoginPref()
        .then((token) => {
          api
            .ChangePassword(token, pass, confirmpass)
            .then((res) => {
              console.log("changesssssssssssss", res.data);
              if (res.data.message) {
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
              } else {
                // setPasswordErrors({ password: res.data.Error });
                // setPasswordIsValid(false);
                Toast.show("Error changing password");
              }
            })
            .catch((error) => {
              setshowloaderM(false);

              console.log(
                "error in save password:",
                error.response.data.message
              );
              Toast.show(error.response.data.message);
            });
        })
        .catch((error) => {
          setshowloaderM(false);
          console.log("error in token get:", error.data);
        });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <TouchableWithoutFeedback onPress={() => presshandler()}>
          <View style={styles.Main_container}>
            <Header></Header>

            <View style={styles.child_view}>
              <View style={styles.text_style_name_change}>
                <Text style={styles.text_style_name_change}>
                  {strings.CHANGEPASSWORD}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Poppins_400Regular",
                  color: "#105398",
                }}
              >
                {strings.ENTERNEWPASSWORDTORESET}
              </Text>

              <View style={styles.text_style_name}>
                <Text
                  style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold" }}
                >
                  {strings.NEWPASSWORD}
                </Text>
              </View>
              <View style={styles.text_input}>
                <TextInput
                  secureTextEntry={showpassword}
                  placeholder="********"
                  onChangeText={(Text) => {
                    setpassword(Text);
                  }}
                ></TextInput>
                <Pressable
                  style={{ bottom: 30, left: WIDTH * 0.6 }}
                  onPress={() => setShowPassword(!showpassword)}
                  hitSlop={20}
                >
                  {showpassword == true ? (
                    <Image
                      source={require("../../../../assets/closeeye.png")}
                      style={{ width: 20, height: 20 }}
                    />
                  ) : (
                    <Image
                      source={require("../../../../assets/openeye.png")}
                      style={{ width: 20, height: 20 }}
                    />
                  )}
                </Pressable>
              </View>

              <View style={styles.text_style_name}>
                <Text
                  style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold" }}
                >
                  {strings.CONFIRMNEWPASSWORD}
                </Text>
              </View>
              <View style={styles.text_input}>
                <TextInput
                  secureTextEntry={showpassword2}
                  placeholder="********"
                  onChangeText={(Text) => {
                    setconfirmpassword(Text);
                  }}
                ></TextInput>
                <Pressable
                  style={{ bottom: 30, left: WIDTH * 0.6 }}
                  onPress={() => setShowPassword2(!showpassword2)}
                  hitSlop={20}
                >
                  {showpassword2 == true ? (
                    <Image
                      source={require("../../../../assets/closeeye.png")}
                      style={{ width: 20, height: 20 }}
                    />
                  ) : (
                    <Image
                      source={require("../../../../assets/openeye.png")}
                      style={{ width: 20, height: 20 }}
                    />
                  )}
                </Pressable>
              </View>

              <TouchableOpacity style={styles.Button} onPress={() => submitt()}>
                <View style={[GlobalStyles.FlexDirectionRow]}>
                  {showloaderM && (
                    <ActivityIndicator
                      size="small"
                      color="white"
                      style={[GlobalStyles.activityIndicator]}
                    ></ActivityIndicator>
                  )}
                  <Text style={GlobalStyles.ButtonTextMain}>
                    {strings.SUBMIT}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  Main_container: {
    flex: 1,
    flexDirection: "column",
  },

  text: {
    color: "#51AB1D",
    fontSize: 21,
    marginTop: "15%",
    fontFamily: "Poppins_500Medium",
  },
  text_style_name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginTop: "5%",
  },
  text_style_name_change: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#51AB1D",
    fontFamily: "Poppins_500Medium",
    marginTop: 10,
  },

  text_input: {
    marginTop: 5,
    borderRadius: 5,
    padding: 12,
    width: 286,
    height: 45,
    color: GlobalColors.Bordercolor,
    borderWidth: 1.4,
    borderColor: "#E4E9F3",
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
  },
  text_input_mobile: {
    marginTop: 5,
    borderRadius: 5,
    width: 286,
    height: 45,
    color: "gray",
    borderWidth: 1,
    borderColor: "#E4E9F3",
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
  },
  Button: {
    marginTop: 20,
    height: 50,
    borderColor: "black",
    borderRadius: 4,
    backgroundColor: "#53ab1b",
    width: 286,
    alignContent: "center",
    alignItems: "center",
    padding: 10,
  },
  child_view: {
    flex: 1,
    marginTop: "10%",
    alignContent: "center",
    alignSelf: "center",
  },
  logoViewStyle: {},
});
