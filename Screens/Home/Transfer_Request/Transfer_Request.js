import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { CommonActions, useNavigation } from "@react-navigation/native";
import GlobalStyles from "../../../Utils/GlobalStyles";
import { ActivityIndicator } from "react-native";
import GlobalColors from "../../../Utils/GlobalColors";
import Transfer_Request_Styles from "./Transfer_Request_Styles";
import Header_Global from "../../../Components/Header_Global";
import strings from "../../../constants/lng/LocalizedStrings";

export default function Transfer_Route({ route }) {
  const { item_res } = route.params;

  const navigation = useNavigation();
  const [Products, setProducts] = useState([]);
  const [Response, setResponse] = useState([]);

  useEffect(async () => {
    console.log("item obj", item_res);
    setResponse(item_res);
    setProducts(item_res.products);
  }, [item_res]);

  const renderitem = (item, i) => {
    console.log("imageurl", item.product_img.url);
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
        <Text style={Transfer_Request_Styles.itemquantity}>{item.wtqt}</Text>
      </View>
    );
  };

  if (Response == undefined || Response == "") {
    return (
      <View
        style={[
          Transfer_Request_Styles.container,
          GlobalStyles.FlexDirectionColumn,
        ]}
      >
        <Header_Global
          Title={strings.CUSTOMER}
          BackIcon={true}
          Onpress={() => {
            const resetAction = CommonActions.reset({
              index: 0,
              routes: [{ name: "VehicleLoad" }],
            });
            navigation.dispatch(resetAction);
          }}
        />
        <View style={Transfer_Request_Styles.innerContainer}>
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
          Transfer_Request_Styles.container,
          GlobalStyles.FlexDirectionColumn,
        ]}
      >
        <Header_Global
          Title={strings.CUSTOMER}
          BackIcon={true}
          Onpress={() => {
            navigation.navigate("PickupReq");
          }}
        />
        <View style={GlobalStyles.cardview}>
          <View
            style={[
              GlobalStyles.cardview,
              { backgroundColor: "white", marginTop: 10, padding: 30 },
            ]}
          >
            <Text style={Transfer_Request_Styles.Heading1}>
              {Response.customer.first_name + " " + Response.customer.last_name}
            </Text>
            <Text style={Transfer_Request_Styles.idtxt}>
              {"(" + Response.customer.uuid + ")"}
            </Text>
            <View style={Transfer_Request_Styles.itemsimgview}>
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

            <Text style={Transfer_Request_Styles.headingaddress}>
              {strings.PICKUPADDRESSLOCATION}
            </Text>
            <Text style={Transfer_Request_Styles.detailaddress}>
              {Response.address}
            </Text>
            <View
              style={[GlobalStyles.FlexDirectionRow, GlobalStyles.spaceBetween]}
            >
              <Text style={Transfer_Request_Styles.headingtime}>
                {strings.PICKUPTIME}
              </Text>

              <Text style={Transfer_Request_Styles.time}>
                {parsed.shift == "Evening Slot"
                  ? parsed.date + " " + "at" + " " + parsed.evening_start_time
                  : parsed.date + " " + "at" + " " + parsed.morning_start_time}
              </Text>
            </View>
            <Text style={Transfer_Request_Styles.headingtime}>
              {strings.CustomerNOTES}
            </Text>
            <View style={Transfer_Request_Styles.notes}>
              <Text>{Response.notes}</Text>
            </View>

            <Text style={Transfer_Request_Styles.headingtime}>
              {strings.ADMINNOTES}
            </Text>
            <View style={Transfer_Request_Styles.notes}>
              <Text>{Response.admin_comments}</Text>
            </View>

            <TouchableOpacity
              style={[Transfer_Request_Styles.FloatingBtn, { marginTop: 20 }]}
              onPress={() => {
                navigation.navigate("Transfer_Request_Submitt", {
                  RR_id: Response.id,
                });
              }}
            >
              <View style={GlobalStyles.FlexDirectionRow}>
                <Text style={Transfer_Request_Styles.innerText}>
                  {strings.TRANSFERTHEREQ}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
