import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import ApiController from "../../../../Api/ApiController";
import OwnStorage from "../../../../Api/StorageController";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import RenderHTML from "react-native-render-html";
import Privacy_Policy_Styles from "./Privacy_Policy_Styles";
import Header_Global from "../../../../Components/Header_Global";
import GlobalStyles from "../../../../Utils/GlobalStyles";
import strings from "../../../../constants/lng/LocalizedStrings";
import { AsyncStorage } from "react-native";
import Toast from "react-native-root-toast";
export default function Privacy_Policy() {
  var api = new ApiController();
  var Localdata = new OwnStorage();
  const navigation = useNavigation();
  const [data, setdata] = useState();
  const [lang, setLang] = useState("en");

  const { privacypolicy } = useSelector((state) => state.driverdetails);
  const { width } = useWindowDimensions();
  const source = {
    html: data,
  };

  const getprivacypolicy = async () => {
    // const lngData = await AsyncStorage.getItem("language");
    const lngData = 'en'

    api
      .Getprivacypolicy()
      .then((res) => {
        if (lngData == "es") {
          console.log("privacy policy: spanish", res.data.description_fr);

          setdata(res.data.description_fr);
        } else {
          setdata(res.data.description);

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
  useEffect(async () => {
    // console.log("langg", lngData);
    // setLang(lngData);
    getprivacypolicy();
    // const lngData = await AsyncStorage.getItem("language");
    // console.log("langg", lngData);
    // setLang(lngData);
  }, []);
  return (
    <View
      style={[
        Privacy_Policy_Styles.container,
        {
          // Try setting `flexDirection` to `"row"`.
          flexDirection: "column",
        },
      ]}
    >
      <Header_Global
        Title={strings.PRIVACYPOLICY}
        BackIcon={true}
        Onpress={() => {
          navigation.navigate("BottomTabNavigation", { screen: "Home" });
        }}
      />
      <View style={GlobalStyles.cardview}>
        <View
          style={[
            GlobalStyles.cardview,
            {
              backgroundColor: "white",
              marginTop: 10,
              paddingTop: "10%",
              paddingLeft: "5%",
              paddingRight: "5%",
            },
          ]}
        >
          <ScrollView>
            <Text style={Privacy_Policy_Styles.headerTitle_privacy}>
              {strings.PRIVACYPOLICY}
            </Text>

            <RenderHTML contentWidth={width} source={source} />
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
