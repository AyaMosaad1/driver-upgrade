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
import React, { useEffect, useState } from "react";
import Load_Card from "../../../../Components/Vehicle_Load/Load_Card";
import { CommonActions, useNavigation } from "@react-navigation/native";
import VehicleLoad_Styles from "./VehicleLoad_Styles";
import GlobalStyles from "../../../../Utils/GlobalStyles";
import Api from "../../../../Api/Api";
import { useSelector } from "react-redux";
import GlobalColors from "../../../../Utils/GlobalColors";
import Header_Global from "../../../../Components/Header_Global";
import NetInfo from "@react-native-community/netinfo";
import NoInternet from "../../../../Components/nointernet";
import strings from "../../../../constants/lng/LocalizedStrings";
import Toast from "react-native-root-toast";

export default function VehicleLoad() {
  const [VehicleLoad, setVehicleLoad] = useState([]);
  const { Profile } = useSelector((state) => state.driverdetails);
  const [routecheck, setroutecheck] = useState(true);

  const [nointernet, setnointernet] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);

      if (state.isConnected === false) {
        setnointernet(true);
      } else if (state.isConnected === true) {
        setnointernet(false);
      }
    });
    // return () => {
    //   unsubscribe();
    // };
  });

  const navigation = useNavigation();
  useEffect(async () => {
    getVehicleLoad();
  }, [1]);
  const getVehicleLoad = () => {
    let path =
      "recycles?status=Received&driver_id=" + Profile.id + "&limit=999999";
    Api.request("get", path)
      .then((response) => {
        if (response.data == "" || response.data == undefined) {
          setroutecheck(false);
        } else {
          setVehicleLoad(response.data);
        }
      })
      .catch((error) => {
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
  const renderItem = (item, i) => {
    console.log("ressss vehicle load", item);
    const parsed = JSON.parse(item.schedule);

    return (
      <View key={i}>
        <Load_Card
          Name={item.customer.first_name + " " + item.customer.last_name}
          Datelabel={
            parsed.morning_start_time != undefined
              ? parsed.date + " " + "at" + " " + parsed.morning_start_time
              : parsed.date + " " + "at" + " " + parsed.evening_start_time
          }
          Products={item.products}
          Addresslabel={item.address}
          Statuslabel="pending"
          RR_id={item.id}
          item_res={item}
        />
      </View>
    );
  };
  if (VehicleLoad == "" || VehicleLoad == undefined) {
    if (routecheck) {
      return (
        <View
          style={[
            VehicleLoad_Styles.container,
            GlobalStyles.FlexDirectionColumn,
          ]}
        >
          <Header_Global
            Title={strings.VEHICLELOAD}
            BackIcon={true}
            Onpress={() => {
              const resetAction = CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
              });
              navigation.dispatch(resetAction);
            }}
          />
          <View style={GlobalStyles.cardview}>
            <View
              style={[
                GlobalStyles.cardview,
                { backgroundColor: "white", marginTop: 10 },
              ]}
            >
              <ActivityIndicator
                style={{ flex: 1 }}
                size="large"
                color={GlobalColors.Green}
              ></ActivityIndicator>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={[
            VehicleLoad_Styles.container,
            GlobalStyles.FlexDirectionColumn,
          ]}
        >
          <Header_Global
            Title={strings.VEHICLELOAD}
            BackIcon={true}
            Onpress={() => {
              const resetAction = CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
              });
              navigation.dispatch(resetAction);
            }}
          />
          <View style={GlobalStyles.cardview}>
            <View
              style={[
                GlobalStyles.cardview,
                { backgroundColor: "white", marginTop: 10 },
              ]}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={GlobalStyles.HeaderText}>
                  {strings.NOREQFOUND}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    }
  } else {
    return (
      <View
        style={[VehicleLoad_Styles.container, GlobalStyles.FlexDirectionColumn]}
      >
        <Header_Global
          Title={strings.VEHICLELOAD}
          BackIcon={true}
          Onpress={() => {
            const resetAction = CommonActions.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
            navigation.dispatch(resetAction);
          }}
        />
        <View style={GlobalStyles.cardview}>
          <View
            style={[
              GlobalStyles.cardview,
              { backgroundColor: "white", marginTop: 10, paddingTop: "10%" },
            ]}
          >
            <ScrollView>{VehicleLoad.map(renderItem)}</ScrollView>
          </View>
        </View>
        <NoInternet internet={nointernet} />
      </View>
    );
  }
}
