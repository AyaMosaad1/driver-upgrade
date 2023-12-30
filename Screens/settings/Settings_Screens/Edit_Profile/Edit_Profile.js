import { useState, useEffect, useRef } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../../Components/Header_Shorex";
import Api from "../../../../Api/Api";
import PhoneInput from "react-native-phone-number-input";
import { useSelector } from "react-redux";
import ApiController from "../../../../Api/ApiController";
import OwnStorage from "../../../../Api/StorageController";
import { useDispatch } from "react-redux";
import Toast from "react-native-root-toast";
import { DriverDetails } from "../../../../Redux/Reducers/DriverInfo";
import GlobalStyles from "../../../../Utils/GlobalStyles";

import Edit_Profile_Styles from "./Edit_Profile_Styles";
import strings from "../../../../constants/lng/LocalizedStrings";
const WIDTH = Dimensions.get("screen").width;

export default function Edit_Profile() {
  const dispatch = useDispatch();
  const [showloaderM, setshowloaderM] = useState(false);

  var api = new ApiController();
  var localdata = new OwnStorage();

  const phoneInput = useRef(null);
  const navigation = useNavigation();
  const { Profile } = useSelector((state) => state.driverdetails);
  const presshandler = () => {
    Keyboard.dismiss();
  };
  const [profiledata, setprofiledataStateState] = useState({
    email: Profile.email,
    mobile: Profile.mobile,
    bank_name: Profile.bank_name,
    iban: Profile.iban,
  });
  const Save_button_press = () => {
    if (profiledata.mobile.length < 9) {
      Toast.show(strings.InvalidMobilenumber);
    } else {
      setshowloaderM(true);
      updateProfileData();
    }
  };
  const validate = () => {
    console.log("from profile screen email", profiledata.email);

    if (
      profiledata.email !== "" &&
      profiledata.mobile !== "" &&
      profiledata.bank_name !== "" &&
      profiledata.iban !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };
  const updateProfileData = () => {
    if (validate()) {
      let path = "profile";
      Api.request("patch", path, profiledata)
        .then((response) => {
          console.log("updated response status", response);

          setshowloaderM(false);

          console.log("updated response", response.data);
          dispatch(DriverDetails(response.data));
          Toast.show(response.message);

          navigation.navigate("BottomTabNavigation", { screen: "Profile" });
        })
        .catch((error) => {
          setshowloaderM(false);

          console.log("error", error);
          for (const [key, value] of Object.entries(
            error.response.data.errors
          )) {
            console.log(`${key}: ${value}`);
            Toast.show(`${key}: ${value}`);
          }
        });
    } else {
      setshowloaderM(false);
      Toast.show("Fill Out All fields");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={Edit_Profile_Styles.Main_container}
    >
      <ScrollView>
        <TouchableWithoutFeedback onPress={() => presshandler()}>
          <View style={Edit_Profile_Styles.Main_container}>
            <Header></Header>

            <View style={Edit_Profile_Styles.child_view}>
              <View style={Edit_Profile_Styles.text_style_name}>
                <Text style={Edit_Profile_Styles.heading}>{strings.EMAIL}</Text>
              </View>
              <View style={Edit_Profile_Styles.text_input}>
                <TextInput
                  defaultValue={Profile.email}
                  onChangeText={(Text) => {
                    setprofiledataStateState({ ...profiledata, email: Text });
                  }}
                ></TextInput>
              </View>
              <View style={Edit_Profile_Styles.text_style_name}>
                <Text style={Edit_Profile_Styles.heading}>
                  {strings.MOBILENO}*
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={Edit_Profile_Styles.prefixView}>
                  <Text style={Edit_Profile_Styles.prefix}>+34</Text>
                </View>
                <View style={Edit_Profile_Styles.inputContainer}>
                  <TextInput
                    style={{ width: WIDTH * 0.46, height: "100%" }}
                    // value={MobileNo}
                    maxLength={9}
                    defaultValue={Profile.mobile.substr(3)}
                    keyboardType="number-pad"
                    underlineColorAndroid="transparent"
                    onChangeText={(text) => {
                      let phone = "+34";
                      if (text)
                        setprofiledataStateState({
                          ...profiledata,
                          mobile: phone + text,
                        });
                    }}
                  />
                </View>
              </View>
              {/* <View style={Edit_Profile_Styles.text_input_mobile}>
                <PhoneInput
                  ref={phoneInput}
                  keyboardType="numeric"
                  defaultValue={Profile.mobile.slice(4)}
                  defaultCode="ES"
                  layout="second"
                  containerStyle={Edit_Profile_Styles.PhoneContainer}
                  codeTextStyle={{
                    color: "white",
                  }}
                  onChangeFormattedText={(text) => {
                    if (Text)
                      setprofiledataStateState({
                        ...profiledata,
                        mobile: text,
                      });
                  }}
                  disableArrowIcon={true}
                  textContainerStyle={{ paddingVertical: 12 }}
                />
              </View> */}
              <View style={Edit_Profile_Styles.text_style_name}>
                <Text style={Edit_Profile_Styles.heading}>
                  {strings.BANKNAME}
                </Text>
              </View>
              <View style={Edit_Profile_Styles.text_input}>
                <TextInput
                  defaultValue={Profile.bank_name}
                  onChangeText={(Text) => {
                    setprofiledataStateState({
                      ...profiledata,
                      bank_name: Text,
                    });
                  }}
                ></TextInput>
              </View>
              <View style={Edit_Profile_Styles.text_style_name}>
                <Text style={Edit_Profile_Styles.heading}>IBAN</Text>
              </View>
              <View style={Edit_Profile_Styles.text_input}>
                <TextInput
                  defaultValue={Profile.iban}
                  onChangeText={(Text) => {
                    setprofiledataStateState({ ...profiledata, iban: Text });
                  }}
                ></TextInput>
              </View>

              <TouchableOpacity
                style={Edit_Profile_Styles.Button}
                onPress={() => Save_button_press()}
              >
                <View style={[GlobalStyles.FlexDirectionRow]}>
                  {showloaderM && (
                    <ActivityIndicator
                      size="small"
                      color="white"
                      style={[GlobalStyles.activityIndicator]}
                    ></ActivityIndicator>
                  )}
                  <Text style={[GlobalStyles.ButtonTextMain]}>
                    {strings.SAVE}
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
