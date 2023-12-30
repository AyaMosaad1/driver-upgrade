import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  ActivityIndicator,
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
import Header_Global from "../../../Components/Header_Global";
import strings from "../../../constants/lng/LocalizedStrings";
import { RecycleLocations } from "../../../Redux/Reducers/Recycle_Request_Info";
import { useDispatch } from "react-redux";

export default function False_Request({ route }) {
  const dispatch = useDispatch();

  const [showloaderM, setshowloaderM] = useState(false);

  const { RR_id } = route.params;
  const navigation = useNavigation();
  const [pickedImagePath, setPickedImagePath] = useState();
  const [pickedImage, setPickedImage] = useState({});
  var api = new ApiController();
  var Localdata = new OwnStorage();

  const [comments, setcomments] = useState("");

  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri.split("/").pop());
      const newfile = {
        uri: result.uri,
        name: result.uri.split("/").pop(),
        type: "image/jpg",
      };
      setPickedImage(newfile);

      console.log(result.uri);
    }
  };

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      console.log(result.uri);
    }
  };

  const presshandler = () => {
    Keyboard.dismiss();
  };
  const Savebuttonhandler = async () => {
    setshowloaderM(true);

    const token = await Localdata.getvalue("api_token_Driver");

    console.log("tokennn ayy", token);
    const formdata = new FormData();
    if (comments == "") {
      setshowloaderM(false);
      Toast.show("Please fill all fields");
    } else {
      formdata.append("driver_comments", comments);
      pickedImagePath != undefined && formdata.append("img_false", pickedImage);
      formdata.append("_method", "PATCH");
      api
        .falserequest(token, RR_id, formdata)
        .then((res) => {
          setshowloaderM(false);
          dispatch(RecycleLocations([]));
          Toast.show(res.message);
          const resetAction = CommonActions.reset({
            index: 0,
            routes: [{ name: "PickupReq" }],
          });
          navigation.dispatch(resetAction);
          Toast.show(strings.Requestmarkedasfalserequest);
        })
        .catch((error) => {
          setshowloaderM(false);

          console.log(error.message);
          Toast.show(error.message);
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
          Title={strings.FALSEREQUEST}
          BackIcon={true}
          Onpress={() => {
            navigation.navigate("Customers_Location");
          }}
        />

        <TouchableWithoutFeedback onPress={() => presshandler()}>
          <View style={GlobalStyles.cardview}>
            <View
              style={[
                GlobalStyles.cardview,
                { backgroundColor: "white", marginTop: 10 },
              ]}
            >
              <View style={styles.View_False}>
                <Text style={styles.heading_bold}>
                  {strings.drivercomments}
                </Text>

                <TextInput
                  placeholder="Dummy"
                  style={styles.Notes}
                  multiline={true}
                  onChangeText={(Text) => {
                    setcomments(Text);
                  }}
                ></TextInput>

                <Text style={styles.heading_bold}>{strings.UPLOADIMG}</Text>

                <View style={styles.upload_img_input}>
                  <View style={styles.textinput}>
                    <Text
                      style={{
                        color: "gray",
                        fontSize: 12,
                        fontFamily: "Poppins_500Medium",
                        marginTop: "2%",
                      }}
                    >
                      {pickedImagePath}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        showImagePicker();
                      }}
                    >
                      <Image
                        source={require("../../../assets/uploadimg.png")}
                      ></Image>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.Button_View}>
                  <TouchableOpacity
                    style={styles.buttonmain}
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
                      <Text style={[GlobalStyles.ButtonTextMain]}>
                        {strings.SEND}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
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
    alignContent: "center",
    justifyContent: "center",
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
    marginHorizontal: "10%",
    marginTop: "12%",
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
