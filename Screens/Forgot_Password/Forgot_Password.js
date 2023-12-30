import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";
import OwnStorage from "../../Api/StorageController";
import ApiController from "../../Api/ApiController";
import Header from "../../Components/Header_Shorex";
import { useDispatch } from "react-redux";
import GlobalStyles from "../../Utils/GlobalStyles";
import { Pressable } from "react-native";
import Forgot_Password_Styles from "./Forgot_Password_Styles";
import strings from "../../constants/lng/LocalizedStrings";
import { Image } from "react-native";
export default function ForgotPassword({ route }) {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(true);
  const [showloaderM, setshowloaderM] = useState(false);
  var localdata = new OwnStorage();
  var api = new ApiController();
  const navigation = useNavigation();
  const [pass, setpassword] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPhoneNoValid, setIsPhoneNoValid] = useState(true);
  const [codeSent, setcodeSent] = useState("");
  const [confirmpass, setconfirmpassword] = useState("");
  const [showLoaderM, setShowLoaderM] = useState(false);
  const [showType, setShowType] = useState("PhoneNo");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showpassword, setShowPassword] = useState(true);
  const [showpasswordCon, setShowPasswordCon] = useState(true);
  const [ref1, setref1] = useState(React.createRef());
  const [ref2, setref2] = useState(React.createRef());
  const [ref3, setref3] = useState(React.createRef());
  const [ref4, setref4] = useState(React.createRef());
  const [pin1, setpin1] = useState("");
  const [pin2, setpin2] = useState("");
  const [pin3, setpin3] = useState("");
  const [pin4, setpin4] = useState("");
  const [otp, setOtp] = useState("");
  let resetData = new FormData();

  const validate = () => {
    if (pass !== "" && confirmpass !== "") {
      return true;
    } else {
      return false;
    }
  };
  const submitt = () => {
    if (pass.length < 11 && confirmpass.length < 11) {
      Toast.show(strings.PASSWORDCONTAIN11);
    } else {
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
    }
  };
  const savepassword = () => {
    setshowloaderM(true);
    if (pass != confirmpass) {
      Toast.show("Password Mismatch Please Check");
      setshowloaderM(false);
    } else {
      resetData.append("otp", otp);
      resetData.append("phone", phone);
      resetData.append("password", pass);
      resetData.append("password_confirmation", confirmpass);
      console.log("formData", resetData);
      let res = api
        .ResetPassword(resetData)
        .then((res) => {
          console.log("changesssssssssssss", res.data.message);
          Toast.show(res.data.message);
          setshowloaderM(false);
          if (res.data.code == 200) {
            setshowloaderM(false);
            navigation.navigate("Login");
            Toast.show(res.data.message);
          } else {
            setshowloaderM(false);
            // setPasswordErrors({ password: res.data.Error });
            // setPasswordIsValid(false);
          }
        })
        .catch((error) => {
          setshowloaderM(false);
          Toast.show(error.response.data.message);
          console.log("error in Reset password:", error.response.data.message);
          Toast.show(error.response.data.message);
        });
    }
  };

  const sendCode = () => {
    setShowLoaderM(true);
    if (email == "") {
      setIsUsernameValid(false);
    }
    api
      .ForgetPassword(email)
      .then((res) => {
        if (res.data.code == "200") {
          setcodeSent(true);
          setShowLoaderM(false);
          console.log("response is", res.data.message);
          Toast.show(res.data.message);
        } else {
          setShowLoaderM(false);
          console.log("response is", res.data.message);
          Toast.show(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error, error);
        Toast.show(error.message);
        setShowLoaderM(false);
      });
  };
  const sendCodePhone = () => {
    setShowLoaderM(true);
    if (phone == "") {
      setIsPhoneNoValid(false);
    }
    api
      .ForgetPasswordPhone(phone)
      .then((res) => {
        if (res.data.code == "200") {
          setcodeSent(true);
          setShowLoaderM(false);
          console.log("response is", res.data.message);
          Toast.show(res.data.message);
        } else {
          setShowLoaderM(false);
          console.log("response is", res.data.message);
          Toast.show(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error, error);
        Toast.show(error.response.data.message);
        setShowLoaderM(false);
      });
  };
  const reSendCode = () => {
    if (phone == "") {
      setIsPhoneNoValid(false);
    }
    api
      .ForgetPasswordPhone(phone)
      .then((res) => {
        if (res.data.code == "200") {
          setcodeSent(true);

          console.log("response is", res.data.message);
          Toast.show(res.data.message);
        } else {
          console.log("response is", res.data.message);
          Toast.show(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error, error);
        Toast.show(error.message);
      });
  };

  const submitOTP = () => {
    setShowLoaderM(true);
    if (pin1 == "" || pin2 == "" || pin3 == "" || pin4 == "") {
      Toast.show("Please Enter Complete Pin");
      setShowLoaderM(false);
    } else {
      api
        .VerifyOTP(otp)
        .then((res) => {
          if (res.data.status == "success") {
            setModalVisible(false);
            //setcodeSent(true);
            setShowLoaderM(false);
            console.log("response is", res.data.message);
            Toast.show(res.data.message);
          } else {
            setShowLoaderM(false);
            console.log("response is", res.data.message);
            Toast.show(res.data.message);
          }
        })
        .catch((error) => {
          console.log(otp);
          console.log(error);
          Toast.show(error.message);
          setShowLoaderM(false);
        });
    }
  };

  return (
    <View style={Forgot_Password_Styles.Main_container}>
      <Header />
      <View style={Forgot_Password_Styles.child_view}>
        <View style={Forgot_Password_Styles.text_style_name_change}>
          <Text style={Forgot_Password_Styles.text_style_name_change}>
            {strings.ENTERNEWPASSWORD}
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

        <View style={Forgot_Password_Styles.text_style_name}>
          <Text style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold" }}>
            {strings.NEWPASSWORD}
          </Text>
        </View>
        <View style={Forgot_Password_Styles.text_input}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TextInput
              secureTextEntry={showpassword}
              placeholder="********"
              onChangeText={(Text) => {
                setpassword(Text);
              }}
            ></TextInput>
            <Pressable
              style={{ right: 15 }}
              onPress={() => setShowPassword(!showpassword)}
              hitSlop={20}
            >
              {showpassword == true ? (
                <Image
                  source={require("../../assets/closeeye.png")}
                  style={{ width: 20, height: 20 }}
                />
              ) : (
                <Image
                  source={require("../../assets/openeye.png")}
                  style={{ width: 20, height: 20 }}
                />
              )}
            </Pressable>
          </View>
        </View>

        <View style={Forgot_Password_Styles.text_style_name}>
          <Text style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold" }}>
            {strings.CONFIRMNEWPASSWORD}
          </Text>
        </View>
        <View style={Forgot_Password_Styles.text_input}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TextInput
              secureTextEntry={showpasswordCon}
              placeholder="********"
              onChangeText={(Text) => {
                setconfirmpassword(Text);
              }}
            ></TextInput>
            <Pressable
              style={{ right: 15 }}
              onPress={() => setShowPasswordCon(!showpasswordCon)}
              hitSlop={20}
            >
              {showpasswordCon == true ? (
                <Image
                  source={require("../../assets/closeeye.png")}
                  style={{ width: 20, height: 20 }}
                />
              ) : (
                <Image
                  source={require("../../assets/openeye.png")}
                  style={{ width: 20, height: 20 }}
                />
              )}
            </Pressable>
          </View>
        </View>
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          hardwareAccelerated
        >
          <TouchableWithoutFeedback
            style={{
              flex: 1,
            }}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate("Login");
            }}
          >
            <View style={Forgot_Password_Styles.centeredview}>
              <ScrollView style={{ height: "100%", width: "100%" }}>
                {codeSent ? (
                  <View style={Forgot_Password_Styles.modalView}>
                    <Text
                      style={{
                        fontSize: 17,
                        fontFamily: "Poppins_500Medium",
                        paddingTop: 24,
                      }}
                    >
                      {strings.EnterOTPCODE}
                    </Text>

                    <Text
                      style={[
                        {
                          color: "#6E6E6E",
                          fontFamily: "Poppins_400Regular",
                          fontSize: 12,
                          textAlign: "center",
                          padding: "5%",
                        },
                      ]}
                    >
                      {strings.OTPMODALDESC}
                    </Text>
                    <View
                      style={{
                        justifyContent: "space-evenly",
                        flexDirection: "row",
                      }}
                    >
                      <View style={Forgot_Password_Styles.text_inputOTP}>
                        <TextInput
                          style={[{ fontSize: 18 }]}
                          textAlign={"center"}
                          ref={ref1}
                          useRef={ref1}
                          value={pin1}
                          keyboardType="phone-pad"
                          maxLength={1}
                          onChangeText={(value) => {
                            // this.setState({ pin1: value });
                            setpin1(value);
                            if (value) {
                              ref2.current.focus();
                            }
                          }}
                        ></TextInput>
                      </View>
                      <View style={Forgot_Password_Styles.text_inputOTP}>
                        <TextInput
                          style={[{ fontSize: 18 }]}
                          textAlign={"center"}
                          ref={ref2}
                          value={pin2}
                          keyboardType="phone-pad"
                          maxLength={1}
                          onKeyPress={(e) => {
                            if (e.nativeEvent.key === "Backspace") {
                              if (pin2 == "") {
                                ref1.current.focus();
                              }
                            }
                          }}
                          onChangeText={(value) => {
                            // this.setState({ pin2: value });
                            setpin2(value);
                            if (value) {
                              ref3.current.focus();
                            }
                          }}
                        ></TextInput>
                      </View>
                      <View style={Forgot_Password_Styles.text_inputOTP}>
                        <TextInput
                          style={[{ fontSize: 18 }]}
                          textAlign={"center"}
                          ref={ref3}
                          value={pin3}
                          keyboardType="phone-pad"
                          maxLength={1}
                          onKeyPress={(e) => {
                            if (e.nativeEvent.key === "Backspace") {
                              if (pin3 == "") {
                                ref2.current.focus();
                              }
                            }
                          }}
                          onChangeText={(value) => {
                            //  this.setState({ pin3: value });
                            setpin3(value);
                            if (value) {
                              ref4.current.focus();
                            }
                          }}
                        ></TextInput>
                      </View>

                      <View style={Forgot_Password_Styles.text_inputOTP}>
                        <TextInput
                          style={[{ fontSize: 18 }]}
                          textAlign={"center"}
                          ref={ref4}
                          value={pin4}
                          keyboardType="phone-pad"
                          maxLength={1}
                          onKeyPress={(e) => {
                            if (e.nativeEvent.key === "Backspace") {
                              if (pin4 == "") {
                                ref3.current.focus();
                              }
                            }
                          }}
                          onChangeText={(value) => {
                            //this.setState({ pin4: value });

                            setpin4(value);
                          }}
                          onEndEditing={() => {
                            setOtp(pin1 + pin2 + pin3 + pin4);
                          }}
                        ></TextInput>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={Forgot_Password_Styles.Button}
                      onPress={() => submitOTP()}
                    >
                      <View style={{ flexDirection: "row", marginRight: "2%" }}>
                        {showLoaderM && (
                          <ActivityIndicator
                            size="small"
                            color="white"
                            style={[GlobalStyles.activityIndicator]}
                          ></ActivityIndicator>
                        )}
                        <Text
                          style={{
                            fontSize: 17,
                            fontFamily: "Poppins_500Medium",
                            color: "white",
                          }}
                        >
                          {strings.SUBMIT}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => reSendCode()}>
                      <Text style={[Forgot_Password_Styles.resendotp]}>
                        {strings.RESENDOTP}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={Forgot_Password_Styles.modalView}>
                    <Text
                      style={{
                        fontSize: 17,
                        fontFamily: "Poppins_500Medium",
                        paddingTop: 24,
                      }}
                    >
                      {strings.CHANGEYOURPASSWORD}
                    </Text>
                    <Text
                      style={[
                        {
                          color: "#6E6E6E",
                          fontFamily: "Poppins_400Regular",
                          fontSize: 12,
                          textAlign: "center",
                          padding: "5%",
                        },
                      ]}
                    >
                      {strings.OTPMODALDESC}
                    </Text>
                    <View style={{ width: "90%" }}>
                      <View
                        style={{
                          alignItems: "center",
                        }}
                      >
                        <Pressable
                          onPress={() => {
                            console.log("email") + setShowType("Email");
                          }}
                        >
                          {/* {showType == "Email" ? (
                          <Text
                            style={{
                              fontSize: 15,
                              fontFamily: "Poppins_500Medium",
                            }}
                          >
                            {strings.EMAIL}
                          </Text>
                        ) : (
                          <Text>{strings.EMAIL}</Text>
                        )} */}
                        </Pressable>

                        {/* {showType == "PhoneNo" ? (
                        <Text
                          style={{
                            fontSize: 15,
                            fontFamily: "Poppins_500Medium",
                          }}
                        >
                          {strings.PHONENO}
                        </Text>
                      ) : (
                        <Text>{strings.PHONENO}</Text>
                      )} */}
                        <Text
                          style={{
                            fontSize: 15,
                            fontFamily: "Poppins_500Medium",
                          }}
                        >
                          {strings.MOBILENO}
                        </Text>
                      </View>
                      {/* {showType == "Email" ? (
                      <View>
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: "Poppins_600SemiBold",
                          }}
                        >
                          {strings.EMAIL}
                        </Text>
                        <View style={Forgot_Password_Styles.text_input}>
                          <TextInput
                            label={strings.EMAIL}
                            style={Forgot_Password_Styles.input}
                            placeholder={strings.ENTERYOUREMAIL}
                            onChangeText={(text) => {
                              if (text == "") {
                                setIsUsernameValid(false);
                              } else {
                                setEmail(text);
                                setIsUsernameValid(true);
                              }
                            }}
                          />
                          <View
                            style={{
                              justifyContent: "flex-end",
                              top: 15,
                            }}
                          >
                            {!isUsernameValid && (
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
                        <View style={Forgot_Password_Styles.inputContainer}>
                          <TouchableOpacity
                            style={GlobalStyles.Button}
                            onPress={() => {
                              sendCode();
                            }}
                          >
                            <View style={[GlobalStyles.FlexDirectionRow]}>
                              {showLoaderM && (
                                <ActivityIndicator
                                  size="small"
                                  color="white"
                                  style={[GlobalStyles.activityIndicator]}
                                ></ActivityIndicator>
                              )}
                              <Text style={GlobalStyles.ButtonTextMain}>
                                {strings.SENDCODE}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View>
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: "Poppins_600SemiBold",
                          }}
                        >
                          {strings.PHONENO}
                        </Text>
                        <View style={Forgot_Password_Styles.text_input}>
                          <TextInput
                            label={strings.PHONENO}
                            placeholder="+921234567890"
                            keyboardType={"phone-pad"}
                            onChangeText={(text) => {
                              if (text == "") {
                                setIsPhoneNoValid(false);
                              } else {
                                setPhone(text);
                                setIsPhoneNoValid(true);
                              }
                            }}
                          />
                          <View
                            style={{
                              justifyContent: "flex-end",
                              top: 15,
                            }}
                          >
                            {!isPhoneNoValid && (
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
                        <View style={Forgot_Password_Styles.inputContainer}>
                          <TouchableOpacity
                            style={GlobalStyles.Button}
                            onPress={() => {
                              sendCodePhone();
                              console.log("ok");
                            }}
                          >
                            <View style={[GlobalStyles.FlexDirectionRow]}>
                              {showLoaderM && (
                                <ActivityIndicator
                                  size="small"
                                  color="white"
                                  style={[GlobalStyles.activityIndicator]}
                                ></ActivityIndicator>
                              )}
                              <Text style={GlobalStyles.ButtonTextMain}>
                                {strings.SENDCODE}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )} */}
                      <View>
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: "Poppins_600SemiBold",
                          }}
                        >
                          {strings.MOBILENO}
                        </Text>
                        <View style={Forgot_Password_Styles.text_input}>
                          <TextInput
                            label={strings.PHONENO}
                            placeholder="+341234567890"
                            keyboardType={"phone-pad"}
                            onChangeText={(text) => {
                              if (text == "") {
                                setIsPhoneNoValid(false);
                              } else {
                                setPhone(text);
                                setIsPhoneNoValid(true);
                              }
                            }}
                          />
                          <View
                            style={{
                              justifyContent: "flex-end",
                              top: 15,
                            }}
                          >
                            {!isPhoneNoValid && (
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
                        <View style={Forgot_Password_Styles.inputContainer}>
                          <TouchableOpacity
                            style={GlobalStyles.Button}
                            onPress={() => {
                              sendCodePhone();
                              console.log("ok");
                            }}
                          >
                            <View style={[GlobalStyles.FlexDirectionRow]}>
                              {showLoaderM && (
                                <ActivityIndicator
                                  size="small"
                                  color="white"
                                  style={[GlobalStyles.activityIndicator]}
                                ></ActivityIndicator>
                              )}
                              <Text style={GlobalStyles.ButtonTextMain}>
                                {strings.SENDCODE}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <TouchableOpacity
          style={Forgot_Password_Styles.Button}
          onPress={() => submitt()}
        >
          <View style={{ flexDirection: "row" }}>
            {showloaderM && (
              <ActivityIndicator
                size="small"
                color="white"
                style={[GlobalStyles.activityIndicator]}
              ></ActivityIndicator>
            )}
            <Text
              style={{
                fontSize: 17,
                fontFamily: "Poppins_500Medium",
                color: "white",
              }}
            >
              {strings.SUBMIT}
            </Text>
          </View>
        </TouchableOpacity>
        {/* <View style={[GlobalStyles.FlexDirectionRow, { paddingTop: "2%" }]}>
          <Text style={GlobalStyles.regulatTextlight}>
            {strings.DONTHAVEANACCOUNT}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("RegisterType")}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_600SemiBold",
                color: "#51AB1D",
                left: 3,
              }}
            >
              {strings.REGISTER}
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
}
