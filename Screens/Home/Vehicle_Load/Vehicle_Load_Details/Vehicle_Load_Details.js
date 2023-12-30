import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";

import { CommonActions, useNavigation } from "@react-navigation/native";
import Vehicle_Load_Details_Styles from "./Vehicle_Load_Details_Styles";
import GlobalStyles from "../../../../Utils/GlobalStyles";
import { ActivityIndicator } from "react-native";
import GlobalColors from "../../../../Utils/GlobalColors";
import Api from "../../../../Api/Api";
import * as Location from "expo-location";
import Header_Global from "../../../../Components/Header_Global";
import Toast from "react-native-root-toast";
import strings from "../../../../constants/lng/LocalizedStrings";
import styles from "../../../../styles";
import Customers_Location_Styles from "../../Pickup_Requests/PickupReq/Customers_Location/Customers_Location_Styles";

export default function Vehicle_Load_Details({ route }) {
  const { item_res } = route.params;

  const navigation = useNavigation();
  const [Products, setProducts] = useState([]);
  const [Response, setResponse] = useState([]);
  const [Warehouses, setWarehouses] = useState();

  useEffect(async () => {
    console.log("item obj", item_res);
    setResponse(item_res);
    let p = item_res.products;
    let pselection = [];
    for (let i = 0; i < p.length; i++) {
      if (p[i].status === "Received") {
        pselection.push(p[i]);
      }
    }

    setProducts(pselection);
    let t = item_res.products;
    let Tselection = [];

    for (let i = 0; i < t.length; i++) {
      let Address = await Location.geocodeAsync(t[i].warehouse.address);

      if (t[i].status === "Received") {
        let s = {
          id: t[i].warehouse.id,
          title: t[i].warehouse.title,
          item_type: t[i].warehouse.item_type_id,
          latitude: Address[0].latitude,
          longitude: Address[0].longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
          img: t[i].product_img.url,
        };
        Tselection.push(s);
      }
    }

    setWarehouses(Tselection);
  }, [item_res]);
  const rendermanager = (item, i) => {
    return (
      <View
        key={i}
        style={{
          marginBottom: 5,
        }}
      >
        <View
          style={[
            GlobalStyles.FlexDirectionRow,
            GlobalStyles.flexDirection_space_between,
          ]}
        >
          <Text style={Vehicle_Load_Details_Styles.headingtime}>
            {strings.MANAGERNAME}
          </Text>

          <Text style={Vehicle_Load_Details_Styles.time}>
            {item.warehouse.manager}
          </Text>
        </View>
        <View
          style={[
            GlobalStyles.FlexDirectionRow,
            GlobalStyles.flexDirection_space_between,
          ]}
        >
          <Text style={Vehicle_Load_Details_Styles.headingtime}>
            {strings.PRODUCTITEMS}
          </Text>

          <Text style={Vehicle_Load_Details_Styles.time}>
            {" "}
            {item.warehouse.item_type}
          </Text>
        </View>
        <Text style={Vehicle_Load_Details_Styles.headingaddress}>
          {strings.WAREHOUSEADRESSLOCATION}
        </Text>
        <Text style={Vehicle_Load_Details_Styles.detailaddress}>
          {item.warehouse.address}
        </Text>
      </View>
    );
  };
  const renderitem = (item, i) => {
    return (
      <View
        key={i}
        style={[
          GlobalStyles.FlexDirectionColumn,
          GlobalStyles.justifyContent,
          GlobalStyles.alignCenter,
        ]}
      >
        <Image
          style={{ marginLeft: "8%", height: 56, width: 56 }}
          source={{ uri: item.product_img.thumbnail }}
        />
        <Text style={Vehicle_Load_Details_Styles.itemquantity}>
          {item.wtqt}
        </Text>
      </View>
    );
  };

  if (Response == undefined || Response == "") {
    return (
      <View
        style={[
          Vehicle_Load_Details_Styles.container,
          GlobalStyles.FlexDirectionColumn,
        ]}
      >
        <Header_Global
          Title={strings.VEHICLELOAD}
          BackIcon={true}
          Onpress={() => {
            const resetAction = CommonActions.reset({
              index: 0,
              routes: [{ name: "VehicleLoad" }],
            });
            navigation.dispatch(resetAction);
          }}
        />
        <View style={Vehicle_Load_Details_Styles.innerContainer}>
          <ActivityIndicator
            style={{ flex: 1 }}
            size="large"
            color={GlobalColors.Green}
          ></ActivityIndicator>
        </View>
      </View>
    );
  } else {
    const parsed = JSON.parse(Response.schedule);

    return (
      <View
        style={[
          Vehicle_Load_Details_Styles.container,
          GlobalStyles.FlexDirectionColumn,
        ]}
      >
        <Header_Global
          Title={strings.VEHICLELOAD}
          BackIcon={true}
          Onpress={() => {
            const resetAction = CommonActions.reset({
              index: 0,
              routes: [{ name: "VehicleLoad" }],
            });
            navigation.dispatch(resetAction);
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
                paddingHorizontal: "4%",
              },
            ]}
          >
            <ScrollView>
              <Text style={Vehicle_Load_Details_Styles.Heading1}>
                {Response.customer.first_name +
                  " " +
                  Response.customer.last_name}
              </Text>
              <Text style={Vehicle_Load_Details_Styles.idtxt}>
                {"(" + Response.customer.uuid + ")"}
              </Text>
              <View style={Vehicle_Load_Details_Styles.itemsimgview}>
                <ScrollView horizontal={true}>
                  <View
                    style={{
                      flexDirection: "row",
                      width: 500,
                    }}
                  >
                    {Products.map(renderitem)}
                  </View>
                </ScrollView>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: "5%",
                }}
              >
                <Text style={Vehicle_Load_Details_Styles.headingaddress}>
                  {strings.PICKUPADDRESSLOCATION}
                </Text>

                {/* <TouchableOpacity
                  // disabled={Warehouses ? false : true}
                  style={{
                    alignSelf: "flex-end",
                    justifyContent: "center",
                    marginRight: "5%",
                  }}
                  onPress={() => {
                    console.log("warehouses", Warehouses);
                    if (Warehouses == undefined || Warehouses == "") {
                      // Toast.show("Unable to get warehouses please retry");
                    } else {
                      navigation.navigate("Warehouse_Location", {
                        warehouses: Warehouses,
                        Response: item_res,
                      });
                    }
                  }}
                > */}
                <Image
                  style={Vehicle_Load_Details_Styles.glocation}
                  source={require("../../../../assets/glocation.png")}
                />
                {/* </TouchableOpacity> */}
              </View>

              <Text style={Vehicle_Load_Details_Styles.detailaddress}>
                {Response.address}
              </Text>
              <View
                style={[
                  GlobalStyles.FlexDirectionRow,
                  GlobalStyles.spaceBetween,
                ]}
              >
                <Text style={Vehicle_Load_Details_Styles.headingtime}>
                  {strings.PICKUPTIME}
                </Text>

                <Text style={Vehicle_Load_Details_Styles.time}>
                  {parsed.morning_start_time != undefined
                    ? parsed.date + " " + "at" + " " + parsed.morning_start_time
                    : parsed.date +
                      " " +
                      "at" +
                      " " +
                      parsed.evening_start_time}
                </Text>
              </View>
              <Text style={Vehicle_Load_Details_Styles.headingtime}>
                {strings.NOTES}
              </Text>
              <View style={Vehicle_Load_Details_Styles.notes}>
                <Text>{Response.notes}</Text>
              </View>
              <Text style={Vehicle_Load_Details_Styles.warehousemanager}>
                {strings.WAREHOUSEMANAGER}
              </Text>
              {Products.map(rendermanager)}

              <View style={Customers_Location_Styles.route_start}>
                <TouchableOpacity
                  style={Customers_Location_Styles.Button2}
                  onPress={() => {
                    console.log("warehouses", Warehouses);
                    if (Warehouses == undefined || Warehouses == "") {
                      // Toast.show("Unable to get warehouses please retry");
                    } else {
                      navigation.navigate("Warehouse_Location", {
                        warehouses: Warehouses,
                        Response: item_res,
                      });
                    }
                  }}
                >
                  <Text style={GlobalStyles.ButtonTextMain}>
                    {strings.ROUTESTART}
                  </Text>
                </TouchableOpacity>
                <Text styles={{ marginTop: 10 }}></Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}
