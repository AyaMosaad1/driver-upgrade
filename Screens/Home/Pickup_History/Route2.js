import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import History_Card from "../../../Components/Vehicle_History/History_Card";
import Api from "../../../Api/Api";
import { useSelector } from "react-redux";
import OwnStorage from "../../../Api/StorageController";
import Toast from "react-native-root-toast";
import GlobalColors from "../../../Utils/GlobalColors";
import GlobalStyles from "../../../Utils/GlobalStyles";
import moment from "moment";
import strings from "../../../constants/lng/LocalizedStrings";

const Route2 = () => {
  const [products, setproducts] = useState();
  const [routecheck, setroutecheck] = useState(true);
  const [isapicall, setisapicall] = useState(true);

  const { Profile } = useSelector((state) => state.driverdetails);
  const { Filter_Dates } = useSelector((state) => state.driverdetails);

  const [Route_Requests, setRoute_Request] = useState([]);
  var Localdata = new OwnStorage();
  useEffect(async () => {
    console.log("formatted date", Filter_Dates);
    getrouterequest();
  }, [Filter_Dates]);
  const getrouterequest = () => {
    setisapicall(true);
    setroutecheck(true);

    let Params = {};
    Params.id = 0;
    Params.route_id = 1;
    let status = "received";

    let path = Filter_Dates
      ? `recycles?route_id=2&status=Completed&driver_id=${Profile.id}&created_at_from=${Filter_Dates}&created_at_to=${Filter_Dates}&limit=999999`
      : `recycles?route_id=2&status=Completed&driver_id=${Profile.id}&limit=999999`;
    Api.request("get", path)
      .then((response) => {
        if (response.data == "" || response.data == undefined) {
          setroutecheck(false);
        } else {
          setisapicall(false);

          setRoute_Request(response.data);
        }
      })
      .catch((error) => {
        setisapicall(false);

        console.log("error", error);
        if (error.response.status == 401) {
          Toast.show("You are Blocked by the Admin");
          navigation.navigate("Login");
        }
        for (const [key, value] of Object.entries(error.response.data.errors)) {
          console.log(`${key}: ${value}`);
          Toast.show(`${key}: ${value}`);
        }
      });
  };
  if (isapicall == true) {
    if (routecheck) {
      return (
        <ActivityIndicator
          style={{ flex: 1 }}
          size="large"
          color={GlobalColors.Green}
        ></ActivityIndicator>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={GlobalStyles.HeaderText}>
            {strings.NOCOMPELTEDREQONROUT} 2
          </Text>
        </View>
      );
    }
  } else {
    return (
      <View style={styles.Container}>
        <View style={styles.Totalcustomer}>
          <Text style={styles.heading1}>{strings.TOTALCUSTOMER}</Text>
          <Text style={styles.heading2}>{Route_Requests.length}</Text>
        </View>
        <ScrollView>
          <View>{Route_Requests.map(renderitem)}</View>
        </ScrollView>
      </View>
    );
  }
};
const renderitem = (item) => {
  const parsed = JSON.parse(item.schedule);
  const maxDate = moment(item.created_at).format("YYYY-MM-DD");

  return (
    <History_Card
      key={item.id}
      Name={item.customer.first_name + " " + item.customer.last_name}
      Datelabel={
        parsed.shift == "Evening Slot"
          ? maxDate + " " + "at" + " " + parsed.evening_start_time
          : maxDate + " " + "at" + " " + parsed.morning_start_time
      }
      Addresslabel={item.address}
      Statuslabel="pending"
      Item_Name={item.products}
      item_res={item}
    />
  );
};
export default Route2;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  Totalcustomer: {
    paddingTop: "2%",
    paddingLeft: "5%",
    paddingRight: "5%",
    flexDirection: "row",
    paddingBottom: "5%",
    justifyContent: "space-between",
  },
  heading1: {
    fontSize: 16,
    color: "#51AB1D",
    fontFamily: "Poppins_600SemiBold",
  },
  heading2: {
    fontSize: 14,
    color: "#6E6E6E",
    fontFamily: "Poppins_600SemiBold",
  },
});
