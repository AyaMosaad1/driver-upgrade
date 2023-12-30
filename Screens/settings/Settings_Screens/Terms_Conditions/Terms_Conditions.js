import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  AsyncStorage,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import Header_Global from "../../../../Components/Header_Global";
import GlobalStyles from "../../../../Utils/GlobalStyles";
import strings from "../../../../constants/lng/LocalizedStrings";
import ApiController from "../../../../Api/ApiController";
import OwnStorage from "../../../../Api/StorageController";
import Toast from "react-native-root-toast";

export default function Terms_Conditions() {
  var api = new ApiController();
  var Localdata = new OwnStorage();
  const navigation = useNavigation();
  const [data, setdata] = useState();

  const { termsandconditions } = useSelector((state) => state.driverdetails);
  const { width } = useWindowDimensions();
  const source = {
    html: data,
  };

  const getprivacypolicy = async () => {
    // const lngData = await AsyncStorage.getItem("language");
    const lngData = 'en'

    api
      .GetTermsandConditions()
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
  useEffect(() => {
    getprivacypolicy();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          // Try setting `flexDirection` to `"row"`.
          flexDirection: "column",
        },
      ]}
    >
      <Header_Global
        Title={strings.TERMSCONDITION}
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
            <Text style={styles.headerTitle_privacy}>
              {strings.TERMSCONDITION}
            </Text>

            <RenderHTML contentWidth={width} source={source} />
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE713",
  },
  itemsimgview: {
    paddingTop: "2%",
    flexDirection: "row",
  },
  headerTitle_privacy: {
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    fontWeight: "700",
    // fontFamily:'Inter_900Black',
    paddingBottom: "2.2%",
  },
  innerContainer: {
    flex: 10,
    paddingTop: "10%",
    paddingLeft: "5%",
    paddingRight: "5%",
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
  header: {
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
  },
  headerTitle: {
    paddingLeft: "21%",
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
  dataContainer: {
    margin: 35,
  },
  filterStyle: {
    fontSize: 12,
    fontWeight: "bold",
    paddingBottom: 10,
    paddingLeft: 5,
    fontFamily: "Poppins_600SemiBold",
  },

  calenderView: {
    flexDirection: "row",
    padding: 5,
    borderWidth: 1.9,
    borderRadius: 6,
    borderColor: "#51AB1D",
    paddingLeft: "8%",
  },
  home_txt: {
    fontSize: 20,
    paddingLeft: "30%",
    fontWeight: "bold",
    alignSelf: "center",
  },
  Heading1: {
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
  },
  idtxt: {
    fontSize: 14,
    color: "#7D828D",
    fontFamily: "Poppins_500Medium",
  },
  itemquantity: {
    fontSize: 10,
    paddingTop: "1%",
    color: "black",
    fontFamily: "Poppins_600SemiBold",
  },
  headingaddress: {
    fontSize: 14,
    paddingTop: "4%",
    color: "black",
    fontFamily: "Poppins_600SemiBold",
  },
  detailaddress: {
    fontSize: 14,
    paddingTop: "4%",
    color: "#7D828D",
    fontFamily: "Poppins_500Medium",
  },
  headingtime: {
    fontSize: 16,
    paddingTop: "4%",
    color: "black",
    fontFamily: "Poppins_500Medium",
  },
  time: {
    fontSize: 12,
    paddingTop: "4%",
    paddingRight: "2%",
    color: "#6E6E6E",
    fontFamily: "Poppins_500Medium",
  },
  notes: {
    height: 60,
    fontSize: 12,
    paddingRight: "4%",
    paddingTop: "4%",
    color: "black",
    fontFamily: "Poppins_400Regular",
  },
  warehousemanager: {
    fontSize: 16,
    paddingTop: "4%",
    color: "#51AB1D",
    fontFamily: "Poppins_600SemiBold",
  },
});
