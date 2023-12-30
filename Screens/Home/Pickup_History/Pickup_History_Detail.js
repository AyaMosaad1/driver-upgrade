import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";

import { CommonActions, useNavigation } from "@react-navigation/native";
import GlobalStyles from "../../../Utils/GlobalStyles";
import GlobalColors from "../../../Utils/GlobalColors";
import Vehicle_Load_Details_Styles from "../Vehicle_Load/Vehicle_Load_Details/Vehicle_Load_Details_Styles";
import Pickup_History_Detail_Styles from "./Pickup_History_Detail_Styles";
import Header_Global from "../../../Components/Header_Global";
import strings from "../../../constants/lng/LocalizedStrings";
import styles from "../../../styles";

export default function Pickup_History_Detail({ route }) {
  const { item_res } = route.params;
  const [status, setstatus] = useState("");
  const [Products, setProducts] = useState([]);
  const [Response, setResponse] = useState([]);
  const [Quantity, setQuantity] = useState();

  const navigation = useNavigation();
  useEffect(async () => {
    var qt = 0;

    setResponse(item_res);
    setProducts(item_res.products);
    setstatus(item_res.status);

    for (var i = 0; i < item_res.products.length; i++) {
      qt = qt + parseInt(item_res.products[i].wtqt);
    }
    setQuantity(qt);
    console.log(qt);
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
        <Text style={Pickup_History_Detail_Styles.itemquantity}>
          {item.title}
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
          Title={strings.PICKUPHISTORYDETAIL}
          BackIcon={true}
          Onpress={() => {
            navigation.goBack();
            // const resetAction = CommonActions.reset({
            //   index: 0,
            //   routes: [{ name: "Pickup_History" }],
            // });
            // navigation.dispatch(resetAction);
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
    const parsed = JSON.parse(Response.schedule);

    return (
      <View
        style={[
          Pickup_History_Detail_Styles.container,
          GlobalStyles.FlexDirectionColumn,
        ]}
      >
        <Header_Global
          Title={strings.PICKUPHISTORYDETAIL}
          BackIcon={true}
          Onpress={() => {
            navigation.goBack();
            // {
            //   setResponse(null);
            //   navigation.navigate("BottomTabNavigation", {
            //     screen: "Pickup_History",
            //   });
            // }
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
              <Text style={Pickup_History_Detail_Styles.Heading1}>
                {strings.CUSTOMER} ID
              </Text>
              <Text style={Pickup_History_Detail_Styles.text_input}>
                {" "}
                {"(" + Response.customer.uuid + ")"}
              </Text>
              <View style={Pickup_History_Detail_Styles.itemsimgview}>
                {Products.map(renderitem)}
              </View>
              <Text style={Pickup_History_Detail_Styles.headingaddress}>
                {strings.PICKUPADDRESSLOCATION}
              </Text>
              <Text style={Pickup_History_Detail_Styles.detailaddress}>
                {Response.address}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={Pickup_History_Detail_Styles.headingtime}>
                  {strings.QUANTITY}
                </Text>

                <Text style={Pickup_History_Detail_Styles.time}>
                  {Quantity}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={Pickup_History_Detail_Styles.headingtime}>
                  {strings.PICKUPTIME}
                </Text>

                <Text style={Pickup_History_Detail_Styles.time}>
                  {parsed.morning_start_time != undefined
                    ? parsed.date + " " + "at" + " " + parsed.morning_start_time
                    : parsed.date +
                      " " +
                      "at" +
                      " " +
                      parsed.evening_start_time}{" "}
                </Text>
              </View>
              <Text style={Pickup_History_Detail_Styles.headingtime}>
                {strings.NOTES}
              </Text>
              <View style={Pickup_History_Detail_Styles.notes}>
                <Text>{Response.notes}</Text>
              </View>
              <Text style={Pickup_History_Detail_Styles.warehousemanager}>
                Warehouse Manager
              </Text>
              {Products.map(rendermanager)}

              <View style={Pickup_History_Detail_Styles.statusbutton}>
                <Text style={Pickup_History_Detail_Styles.statustext}>
                  {status}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}
