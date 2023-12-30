import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { CommonActions, useNavigation } from "@react-navigation/native";

import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import GlobalStyles from "../../../Utils/GlobalStyles";
import Toast from "react-native-root-toast";
import Api from "../../../Api/Api";
import ApiController from "../../../Api/ApiController";
import OwnStorage from "../../../Api/StorageController";
import Forgot_Password_Styles from "../../Forgot_Password/Forgot_Password_Styles";
import GlobalFonts from "../../../Utils/GlobalFonts";
import Header_Global from "../../../Components/Header_Global";
import strings from "../../../constants/lng/LocalizedStrings";

export default function Transfer_Request_Submitt({ route }) {
  const { RR_id } = route.params;
  const [showloaderM, setshowloaderM] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const [pickedImagePath, setPickedImagePath] = useState();
  const [pickedImage, setPickedImage] = useState({});
  var api = new ApiController();
  var Localdata = new OwnStorage();

  const [comments, setcomments] = useState("");

  const presshandler = () => {
    Keyboard.dismiss();
  };
  const Savebuttonhandler = async () => {
    setshowloaderM(true);

    const token = await Localdata.getvalue("api_token_Driver");

    const formdata = new FormData();
    if (comments == "" || pickedImagePath == "") {
      setModalVisible(!modalVisible);

      setshowloaderM(false);
      Toast.show("Please fill all fields");
    } else {
      formdata.append("driver_comments", comments);
      // formdata.append("img_false", "");
      formdata.append("_method", "PATCH");
      api
        .transfer(token, RR_id, formdata)
        .then((res) => {
          setModalVisible(!modalVisible);

          setshowloaderM(false);

          Toast.show(res.message);
          const resetAction = CommonActions.reset({
            index: 0,
            routes: [{ name: "PickupReq" }],
          });
          navigation.dispatch(resetAction);
          Toast.show("Request Transfered");
        })
        .catch((error) => {
          setModalVisible(!modalVisible);

          setshowloaderM(false);
          if (error.response.status == 401) {
            Toast.show("You are Blocked by the Admin");
            navigation.navigate("Login");
          }
          for (const [key, value] of Object.entries(error)) {
            console.log(`${key}: ${value}`);
            Toast.show(`${key}: ${value}`);
          }
        });

      // Api.request("PATCH", path, formdata)
      //   .then((response) => {
      //     console.log("falserequest", response);
      //   })
      //   .catch((error) => {
      //     console.log("falserequesterror", error);
      //   });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={[styles.container, GlobalStyles.FlexDirectionColumn]}>
        <Header_Global
          Title={strings.TRANSFERTHEREQ}
          BackIcon={true}
          Onpress={() => {
            navigation.navigate("PickupReq");
          }}
        />
        <TouchableWithoutFeedback onPress={() => presshandler()}>
          <View style={GlobalStyles.cardview}>
            <View
              style={[
                GlobalStyles.cardview,
                { backgroundColor: "white", marginTop: 10, padding: 30 },
              ]}
            >
              <View style={styles.View_False}>
                <Text style={styles.heading_bold}>{strings.NOTES}</Text>

                <TextInput
                  placeholder="Dummy"
                  style={styles.Notes}
                  multiline={true}
                  onChangeText={(Text) => {
                    setcomments(Text);
                  }}
                ></TextInput>

                <View style={styles.Button_View}>
                  <TouchableOpacity
                    style={styles.buttonmain}
                    onPress={() => {
                      if (comments == "" || pickedImagePath == "") {
                        Toast.show("Please fill all fields");
                      } else {
                        setModalVisible(true);

                        // Savebuttonhandler();
                      }
                    }}
                  >
                    <View style={[GlobalStyles.FlexDirectionRow]}>
                      <Text style={[GlobalStyles.ButtonTextMain]}>
                        {strings.SEND}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                hardwareAccelerated
              >
                <View style={Forgot_Password_Styles.centeredview}>
                  <View style={styles.modalView}>
                    <Text style={[GlobalFonts.FontMedium, { fontSize: 17 }]}>
                      {strings.Confirmationalert}
                    </Text>

                    <Text
                      style={[
                        GlobalFonts.FontRegular,
                        {
                          fontSize: 12,
                          textAlign: "center",
                          padding: "5%",
                        },
                      ]}
                    >
                      {strings.YOURREQUEST}
                    </Text>

                    <TouchableOpacity
                      style={Forgot_Password_Styles.Button}
                      onPress={() => {
                        Savebuttonhandler();
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
                        <Text style={GlobalStyles.ButtonTextMain}>Done</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE713",
  },
  buttonmain: {
    marginTop: 20,
    marginBottom: 20,
    height: 50,
    borderColor: "black",
    borderRadius: 4,
    backgroundColor: "#53ab1b",
    width: 286,
    alignContent: "center",
    alignItems: "center",
    padding: 10,
  },
  textinput: {
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  innerContainer: {
    flex: 10,
    paddingTop: "15%",
    backgroundColor: "transparent",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    backgroundColor: "white",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 30,
  },
  upload_img_input: {
    borderWidth: 0.8,
    padding: 5,
    borderColor: "#E4E9F3",
    borderRadius: 6,
    backgroundColor: "white",
    marginTop: "2%",
    height: "10%",
  },
  Button_View: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "2%",
  },

  header: {
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
  },
  modalView: {
    width: "85%",
    height: "40%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.57,
    shadowRadius: 15.19,

    elevation: 23,
  },
  headerTitle: {
    paddingLeft: "25%",
    paddingTop: "10%",
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    fontWeight: "700",
    // fontFamily:'Inter_900Black',
    paddingBottom: "2.2%",
  },
  backStyle: {
    paddingTop: "8%",
    paddingLeft: "6%",
  },

  View_False: {
    marginRight: "5%",
    marginLeft: "5%",
    marginTop: "2%",
  },
  Notes: {
    textAlignVertical: "top",
    borderWidth: 0.8,
    padding: 5,
    borderColor: "#E4E9F3",
    borderRadius: 6,
    backgroundColor: "white",
    marginTop: "2%",
    height: 308,
  },
  heading_bold: {
    paddingTop: "2%",
    color: "black",
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
  },
});
