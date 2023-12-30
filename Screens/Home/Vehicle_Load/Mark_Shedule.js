import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import Api from "../../../Api/Api";

import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import GlobalStyles from "../../../Utils/GlobalStyles";
import ApiController from "../../../Api/ApiController";
import OwnStorage from "../../../Api/StorageController";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import Header_Global from "../../../Components/Header_Global";
import Add_Request_styles from "./AddRequest_styles";
import strings from "../../../constants/lng/LocalizedStrings";
import { Modal } from "react-native";

export default function Mark_Shedule({ route }) {
  const { Profile } = useSelector((state) => state.driverdetails);

  const { Recycleitems } = useSelector((state) => state.recyclerequestsdetails);
  const { selected_route } = useSelector(
    (state) => state.recyclerequestsdetails
  );

  const { customer_id } = useSelector((state) => state.recyclerequestsdetails);
  const { RR_address } = useSelector((state) => state.recyclerequestsdetails);
  const { RR_Coordinates } = useSelector(
    (state) => state.recyclerequestsdetails
  );
  var api = new ApiController();
  var localdata = new OwnStorage();
  const navigation = useNavigation();
  const [notes, setnotes] = useState("");
  const finalVal = { products: Recycleitems };
  const [showloaderM, setshowloaderM] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [pickedImagePath, setPickedImagePath] = useState("");
  const [data, setData] = useState([
    {
      date: "",
      shift: "Morning Slot",
      morning_start_time: "9:00",
      morning_end_time: "13:00",
    },
  ]);
  let RecycleData = new FormData();
  const showImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result);
      console.log(result.uri);
    }
  };
  useEffect(async () => {
    getcurrent_datetime();
    console.log("seleted routeeee", selected_route);
    console.log("ooooooo", RR_Coordinates);
  }, [1]);

  const successOrder = async () => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
    navigation.dispatch(resetAction);
  };
  const getcurrent_datetime = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var fulldate = date + "-" + month + "-" + year;
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds();

    var fulltime = hours + ":" + min + ":" + sec;

    setData({
      date: [fulldate],
      shift: "Morning Slot",
      morning_start_time: "9:00",
      morning_end_time: "13:00",
    });
  };

  // const openCamera = async () => {
  //   const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

  //   if (permissionResult.granted === false) {
  //     alert("You've refused to allow this appp to access your camera!");
  //     return;
  //   }

  //   const result = await ImagePicker.launchCameraAsync();

  //   // Explore the result
  //   console.log(result);

  //   if (!result.cancelled) {
  //     setPickedImagePath(result.uri);
  //     console.log(result.uri);
  //   }
  // };
  const AssignRequestToDriver = (recycle, driver, vehicle, route) => {
    console.log(driver);
    console.log(vehicle);
    console.log(route);

    let path = `recycles/assign?recycle=${recycle}&driver=${driver}&vehicle=${vehicle}&route=${route}`;
    Api.request("patch", path)
      .then((response) => {
        console.log("checkkkkkkkkkkkkkkkkkkk", response);
        setShowModal(true);

        // store.dispatch(NotificationsRes(response.data));
        // console.log("cehecece", response.data);
        // // setNotifications(response.data);
        // console.log("noti count", response.data.length);
        // store.dispatch(NotificationCount(response.data.length));
      })
      .catch((error) => {
        if (error.response.status == 401) {
          Toast.show("You are Blocked by the Admin");
          navigation.navigate("Login");
        }
        for (const [key, value] of Object.entries(error.response.data.errors)) {
          console.log(`${key}: ${value}`);
          setshowloaderM(false);

          Toast.show(`${key}: ${value}`);
        }
      });
  };

  const submit = async () => {
    setshowloaderM(true);

    try {
      RecycleData.append("uuid", customer_id);
      RecycleData.append("schedule_type", "once");
      RecycleData.append("schedule", JSON.stringify(data));
      RecycleData.append("lat", RR_Coordinates[0].toString());
      RecycleData.append("lng", RR_Coordinates[1].toString());
      RecycleData.append("driver_id", Profile.id.toString());
      RecycleData.append("status", "Assigned");

      finalVal["products"].forEach((value, i) => {
        if (i == 0 || i == undefined) {
        } else {
          if (value == undefined) {
          } else {
            console.log("products[" + i + "]", value.product_id);
            RecycleData.append(
              "products[" + i + "][product_id]",
              value.product_id
            );
            RecycleData.append("products[" + i + "][wtqt]", value.wtqt);
          }
        }
      });
      RecycleData.append("address", RR_address);
      RecycleData.append("shift", "morning");

      RecycleData.append(
        "coordinates",
        JSON.stringify([
          RR_Coordinates[0].toString(),
          RR_Coordinates[1].toString(),
        ])
      );
      RecycleData.append("notes", notes);
      if (pickedImagePath == "" || pickedImagePath == undefined) {
      } else {
        let imgArray = [];
        imgArray.push(pickedImagePath);
        console.log("checkingimg", imgArray);
        var filename = imgArray[0].uri.replace(/^.*[\\\/]/, "");
        RecycleData.append("images[" + 0 + "]", {
          name: filename.toString(),
          type: "image/png",
          uri: imgArray[0].uri,
        });
      }

      // console.log("DATAIS", RecycleData);
      var token = await localdata.GetLoginPref();
      let res = await api.RecycleRequest(RecycleData, token);
      if (res) {
        // console.log("response of requests", res.data.data.id);
        // console.log("Driver", Profile.id);
        // console.log("vehicle", Profile.vehicle.id);
        // console.log("Route", selected_route);

        AssignRequestToDriver(
          res.data.data.id,
          parseInt(Profile.id.toString()),
          Profile.vehicle.id.toString(),
          selected_route
        );
      } else {
        Alert.alert("Request Failed");
      }
      setshowloaderM(false);
      console.log("Response1212:", res.data);
    } catch (error) {
      //let errors = error.response.data.errors;
      console.log("error", error.response.data.message);
      setshowloaderM(false);
      // console.log(error.message);
      // Toast.show(error.response.data.message);
      for (const [key, value] of Object.entries(error.response.data.errors)) {
        console.log(`${key}: ${value}`);
        setshowloaderM(false);

        Toast.show(`${key}: ${value}`);
      }
    }
  };
  const presshandler = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={[styles.container, GlobalStyles.FlexDirectionColumn]}>
        <View style={Add_Request_styles.header}>
          <TouchableOpacity
            style={Add_Request_styles.backStyle}
            onPress={() => {
              const resetAction = CommonActions.reset({
                index: 0,
                routes: [{ name: "Add_Request" }],
              });
              navigation.dispatch(resetAction);
              // const resetAction = CommonActions.reset({
              //   index: 0,
              //   routes: [{ name: "Add_Request" }],
              // });
              // navigation.navigate("Add_Request");
            }}
          >
            <Image
              style={{ height: 16.97, width: 10.61 }}
              source={require("../../../assets/back.png")}
            />
          </TouchableOpacity>
          <Text style={Add_Request_styles.headerTitle}>
            {strings.MARKSCHEDULE}
          </Text>
          <View style={{ width: 30, height: 30 }} />
        </View>
        <TouchableWithoutFeedback onPress={() => presshandler()}>
          <View style={GlobalStyles.cardview}>
            <View
              style={[
                GlobalStyles.cardview,
                { backgroundColor: "white", padding: 10, height: 700 },
              ]}
            >
              <ScrollView>
                <View style={styles.View_False}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.headingaddress}>
                      {strings.PICKUPADDRESSLOCATION}
                    </Text>
                    <TouchableOpacity
                      style={{ marginRight: "5%" }}
                      onPress={() => {
                        navigation.navigate("locationpicker");
                      }}
                    >
                      <Image
                        style={{
                          height: 37.33,
                          width: 28,
                          alignSelf: "center",
                        }}
                        source={require("../../../assets/glocation.png")}
                      />
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    editable={false}
                    multiline={true}
                    style={styles.detailaddress}
                  >
                    {RR_address ? RR_address : strings.SELECT}
                  </TextInput>
                  <Text style={styles.notes_txt}>{strings.UPLOADIMG}</Text>

                  <View style={styles.upload_view}>
                    <View style={styles.img_path}>
                      <Text style={styles.notes_txt}>
                        {pickedImagePath.uri}
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

                  <Text style={styles.notes_txt}>{strings.NOTES}</Text>

                  <TextInput
                    textAlignVertical="top"
                    placeholder={strings.THISISDUMMYTXT}
                    style={styles.Notes}
                    multiline={true}
                    onChangeText={(Text) => {
                      setnotes(Text);
                    }}
                  ></TextInput>
                </View>
                <View style={styles.btn_view}>
                  <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                      RR_Coordinates[0] == null ||
                      RR_Coordinates[0] == undefined
                        ? Toast.show(strings.PLEASESELECTLOCATIONFIRST)
                        : submit();
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
                      <Text style={styles.btn_txt}>{strings.CONFIRMORDER}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <Modal
          visible={showModal}
          onBackdropPress={() => setShowModal(false)}
          transparent
          onRequestClose={() => setShowModal(false)}
          animationType="slide"
          hardwareAccelerated
        >
          <View style={styles.modal_view}>
            <View style={styles.warning_modal}>
              <Text
                style={[
                  {
                    color: "#6E6E6E",
                    marginTop: "10%",
                    alignSelf: "center",
                    marginHorizontal: 10,
                  },
                ]}
              >
                {strings.CONFIRMORDERMODALDESC}
              </Text>
              <Text style={styles.thankyouText}>{strings.THANKYOU}</Text>
              <View>
                <View style={{ paddingTop: 35 }}>
                  <TouchableOpacity
                    style={[GlobalStyles.ButtonMain, { alignSelf: "center" }]}
                    onPress={() => {
                      setShowModal(false), successOrder();
                    }}
                  >
                    <View style={[GlobalStyles.FlexDirectionRow]}>
                      <Text style={GlobalStyles.ButtonTextMain}>
                        {strings.CONTINUE}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  thankyouText: {
    alignSelf: "center",
    color: "#51AB1D",
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "Poppins_600SemiBold_Italic",
  },
  modal_view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000099",
    alignContent: "center",
  },
  warning_modal: {
    width: "95%",
    height: 250,
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
  container: {
    flex: 1,
    backgroundColor: "#FFE713",
  },
  upload_view: {
    borderWidth: 0.8,
    padding: 5,
    borderColor: "#E4E9F3",
    borderRadius: 6,
    backgroundColor: "white",
    marginTop: "2%",
    height: "10%",
  },
  btn_txt: {
    color: "white",
    fontSize: 17,
    fontFamily: "Poppins_500Medium",
  },
  img_path: {
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btn_view: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "3%",
    marginBottom: "6%",
  },
  notes_txt: {
    color: "black",
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    marginTop: 10,
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
    marginRight: "5%",
    marginLeft: "5%",
    marginTop: "2%",
  },
  Notes: {
    borderWidth: 0.8,
    padding: 5,
    borderColor: "#E4E9F3",
    borderRadius: 6,
    backgroundColor: "white",
    marginTop: "2%",
    height: 200,
  },
  headingaddress: {
    fontSize: 14,
    color: "black",
    fontFamily: "Poppins_600SemiBold",
  },
  detailaddress: {
    fontSize: 14,
    paddingTop: "2%",
    color: "#7D828D",
    fontFamily: "Poppins_500Medium",
  },
});
