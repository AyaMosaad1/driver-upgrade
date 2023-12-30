import {
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  LogBox,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import React from "react";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useDrawerStatus } from "@react-navigation/drawer";
import { useIsFocused } from "@react-navigation/native";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GlobalStyles from "../../../../Utils/GlobalStyles";
import ApiController from "../../../../Api/ApiController";
import OwnStorage from "../../../../Api/StorageController";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import * as ImagePicker from "expo-image-picker";
import { DriverThumbnail } from "../../../../Redux/Reducers/DriverInfo";
import Profile_Styles from "./Profile_Styles";
import strings from "../../../../constants/lng/LocalizedStrings";
import Toast from "react-native-root-toast";

export default function Profile() {
  var api = new ApiController();
  var localdata = new OwnStorage();
  const { Profile } = useSelector((state) => state.driverdetails);

  const { thumbnail } = useSelector((state) => state.driverdetails);

  const [profileavatar, setprofileavatarStateState] = useState({
    avatar: "",
  });
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("image result", result);
    var filename = result.uri.replace(/^.*[\\\/]/, "");
    console.log("filename:", filename);

    if (!result.cancelled) {
      console.log("inresult");
      let profile = profileavatar;
      profile.avatar = { url: result.uri };

      console.log("inresultaaaa", profile.avatar);

      setprofileavatarStateState({ ...profile });

      // setImage(result.uri);

      let data = new FormData();
      const newFile = {
        uri: result.uri,
        name: result.uri.split("/").pop(),
        type: "image/*",
      };
      data.append("avatar", newFile);

      localdata
        .GetLoginPref()
        .then((token) => {
          api.UploadPicture(token, data);
          dispatch(DriverThumbnail(result.uri));

          // .then((res) => {
          //   console.log("uploaded image response: ", res);
          // })
          // .catch((error) => {
          //   console.log("error in uploadfile:", error.response);
          // });
        })
        .catch((error) => {
          console.log("error:", error);
          if (error.response.status == 401) {
            Toast.show("You are Blocked by the Admin");
            navigation.navigate("Login");
          }
        });
    }
  };
  return (
    <ScrollView>
      <View style={Profile_Styles.container}>
        <View style={Profile_Styles.header}>
          <TouchableOpacity
            style={Profile_Styles.backStyle}
            onPress={() => navigation.navigate("Home")}
          >
            <Image
              style={{ height: 16.97, width: 10.61 }}
              source={require("../../../../assets/back.png")}
            />
          </TouchableOpacity>
          <Text style={Profile_Styles.headerTitle}>{strings.PROFILE}</Text>
        </View>
        <View style={Profile_Styles.shadowSet}>
          <View
            style={[
              GlobalStyles.cardview,
              { backgroundColor: "white", marginTop: 10 },
            ]}
          >
            <View style={Profile_Styles.name_View}>
              <Text style={Profile_Styles.hello_txt}>
                {strings.HI}
                {Profile.first_name}
              </Text>

              <View
                style={[
                  GlobalStyles.FlexDirectionRow,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text
                  style={{
                    color: "black",
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 18,
                  }}
                >
                  {strings.WELCOMEBACK}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#ffe613",
                    width: 80,
                    height: 30,
                    borderRadius: 15,

                    flexDirection: "row",
                  }}
                  onPress={() => {
                    navigation.navigate("Edit_Profile");
                  }}
                >
                  <View
                    style={{
                      alignSelf: "center",
                      flexDirection: "row",
                      margin: 12,
                    }}
                  >
                    <Image
                      source={require("../../../../assets/edit.png")}
                    ></Image>
                    <Text style={{ fontWeight: "bold", paddingLeft: 5 }}>
                      {strings.EDIT}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={Profile_Styles.Profile_img}>
              <View style={GlobalStyles.FlexDirectionRow}>
                <Image
                  source={
                    profileavatar.avatar
                      ? { uri: profileavatar.avatar.url }
                      : thumbnail
                      ? { uri: thumbnail }
                      : require("../../../../assets/camera.png")
                  }
                  style={GlobalStyles.profileimage}
                ></Image>
                <Pressable hitSlop={20} onPress={pickImage}>
                  <Image
                    style={{
                      height: 29,
                      width: 29,
                      marginLeft: -25,
                      zIndex: 1,
                    }}
                    source={require("../../../../assets/imagepicker.png")}
                  ></Image>
                </Pressable>
              </View>

              <Text
                style={{
                  color: "#51ab1d",
                  marginTop: 10,
                  fontSize: 18,
                  fontFamily: "Poppins_500Medium",
                }}
              >
                {Profile.first_name} {Profile.last_name}
              </Text>
              <Text
                style={{
                  color: "gray",
                  margin: 0,
                  fontSize: 14,
                  fontFamily: "Poppins_500Medium",
                }}
              >
                {Profile.nif}
              </Text>
            </View>
            <View
              style={{
                marginRight: "10%",
                marginLeft: "5%",
              }}
            >
              <View style={Profile_Styles.Driver_Data}>
                <Text style={Profile_Styles.h1}>{strings.EMAIL}</Text>
                <Text style={Profile_Styles.detailtxt}>{Profile.email}</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  alignItems: "flex-end",
                  alignContent: "flex-end",
                }}
              >
                <View style={Profile_Styles.Driver_Data}>
                  <Text style={Profile_Styles.h1}>{strings.PHONENO}</Text>
                  <Text style={Profile_Styles.detailtxt}>
                    {Profile.phone.replace(/-/g, "")}
                  </Text>
                </View>
                <View style={Profile_Styles.Driver_Data}>
                  <Text style={Profile_Styles.h1}>{strings.MOBILENO}</Text>
                  <Text style={Profile_Styles.detailtxt}>{Profile.mobile}</Text>
                </View>
              </View>
              <View style={Profile_Styles.Driver_Data}>
                <Text style={Profile_Styles.h1}>{strings.DRIVINGLICENSE}</Text>
                <Text style={Profile_Styles.detailtxt}>{Profile.license}</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  alignItems: "flex-end",
                  alignContent: "flex-end",
                }}
              >
                <View style={Profile_Styles.Driver_Data}>
                  <Text style={Profile_Styles.h1}>{strings.VEHICLENUMBER}</Text>
                  <Text style={Profile_Styles.detailtxt}>
                    {Profile.vehicle.reg_no}
                  </Text>
                </View>
                <View style={Profile_Styles.Driver_Data}>
                  <Text style={Profile_Styles.h1}>{strings.IBAN}</Text>
                  <Text style={Profile_Styles.detailtxt}>{Profile.iban}</Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  alignItems: "flex-end",
                  alignContent: "flex-end",
                }}
              >
                <View style={Profile_Styles.Driver_Data}>
                  <Text style={Profile_Styles.h1}>{strings.JOININGDATE}</Text>
                  <Text style={Profile_Styles.detailtxt}>
                    {Profile.joining_date}
                  </Text>
                </View>
                <View style={[Profile_Styles.Driver_Data]}>
                  <Text style={Profile_Styles.h1}>{strings.BANKNAME}</Text>
                  <Text style={Profile_Styles.detailtxt}>
                    {Profile.bank_name}
                  </Text>
                </View>
                <View style={{ marginBottom: "20%" }}></View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 20, backgroundColor: "white" }}></View>
    </ScrollView>
  );
}
