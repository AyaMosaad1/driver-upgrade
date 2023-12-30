import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Api from "../../../../Api/Api";
import { useDispatch, useSelector } from "react-redux";
import OwnStorage from "../../../../Api/StorageController";
import Toast from "react-native-root-toast";
import GlobalColors from "../../../../Utils/GlobalColors";
import GlobalStyles from "../../../../Utils/GlobalStyles";
import {
  RecycleLocations,
  SelectedRoute,
} from "../../../../Redux/Reducers/Recycle_Request_Info";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { useNavigation } from "@react-navigation/native";
import strings from "../../../../constants/lng/LocalizedStrings";
const Ongoing_Route3 = () => {
  const [recycleitemslocations, setrecycleitemslocations] = useState();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { Profile } = useSelector((state) => state.driverdetails);
  const [Route_Requests, setRoute_Request] = useState([]);
  const [routecheck, setroutecheck] = useState(true);

  var Localdata = new OwnStorage();
  useEffect(async () => {
    dispatch(SelectedRoute("3"));

    getrouterequest();
  }, [1]);
  const getrouterequest = () => {
    let Params = {};
    Params.id = 0;
    Params.route_id = 1;

    let path =
      "recycles?status=ongoing&route_id=3&driver_id=" +
      Profile.id +
      "&limit=999999";
    Api.request("get", path)
      .then((response) => {
        if (response.data == "" || response.data == undefined) {
          setroutecheck(false);
        } else {
          let t = response.data[0];
          const parsed = JSON.parse(t.coordinates);
          let Tselection = [];
          let s = {
            id: t.id,
            latitude: parseFloat(parsed[0]),
            longitude: parseFloat(parsed[1]),
            customerName: t.customer.first_name + " " + t.customer.last_name,
            image: t.customer.avatar_url,
          };
          Tselection.push(s);

          dispatch(RecycleLocations(Tselection));
          console.log("recycle items tt", Tselection);
          setRoute_Request(response.data);
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
  if (Route_Requests == "" || Route_Requests == undefined) {
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
            {strings.NOREQUESTASSIGNED}
          </Text>
        </View>
      );
    }
  } else {
    return (
      <View style={styles.Container}>
        <View>
          <DraggableFlatList
            data={Route_Requests}
            onDragEnd={(Route_Requests) => {
              setRoute_Request(Route_Requests.data);

              let t = Route_Requests.data[0];
              const parsed = JSON.parse(t.coordinates);
              let Tselection = [];
              let s = {
                id: t.id,
                latitude: parseFloat(parsed[0]),
                longitude: parseFloat(parsed[1]),
                customerName:
                  t.customer.first_name + " " + t.customer.last_name,
                image: t.customer.avatar_url,
              };
              Tselection.push(s);

              dispatch(RecycleLocations(Tselection));
              console.log("recycle items tt", Tselection);
            }}
            keyExtractor={(item) => item.id}
            renderItem={renderitem}
          />
        </View>
      </View>
    );
  }
};

/////////////////////////////RENDER ITEMSSS///////////////////////
const renderItems_wt = (item, i) => {
  return (
    <View key={i} style={styles.innerContainer}>
      <Text style={styles.text1}>{item.title}</Text>
      {<Text style={styles.text1}>{item.wtqt}</Text>}
    </View>
  );
};

const renderitem = ({ item, drag, isActive }) => {
  const navigation = useNavigation();

  // let result = item.products.map((a) => a.item_type);
  const parsed = JSON.parse(item.schedule);
  return (
    <ScaleDecorator key={item.i}>
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        onPress={() => {
          navigation.navigate("Customers_Location");
        }}
        style={styles.containercard}
      >
        <View style={styles.innerContainerMain}>
          {
            <Text style={styles.hidingH1}>
              {item.customer.first_name + " " + item.customer.last_name}
            </Text>
          }
          {item.products.map(renderItems_wt)}

          {
            <View style={[GlobalStyles.FlexDirectionRow]}>
              <Text style={[styles.textdate, { paddingLeft: "2%" }]}>
                {parsed.shift == "Evening Slot"
                  ? parsed.date + " " + "at" + " " + parsed.evening_start_time
                  : parsed.date + " " + "at" + " " + parsed.morning_start_time}
              </Text>
            </View>
          }

          <View style={styles.innerContainerAddress}>
            {
              <Image
                style={{ marginRight: "3%", height: 24, width: 24 }}
                source={require("../../../../assets/location.png")}
              ></Image>
            }
            {
              <Text
                style={{
                  color: "#6E6E6E",
                  fontSize: 14,

                  fontFamily: "Poppins_500Medium",
                }}
              >
                {item.address}
              </Text>
            }
          </View>
        </View>
      </TouchableOpacity>
    </ScaleDecorator>
  );
};
export default Ongoing_Route3;

const styles = StyleSheet.create({
  containercard: {
    flex: 0.45,
    marginTop: "1%",
    marginBottom: "1%",

    backgroundColor: "#FFFFFF",
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 6,
    borderColor: "#E4E9F3",
    borderWidth: 0.5,
  },
  innerContainerMain: {
    marginTop: "2%",
    paddingLeft: 15,
    marginBottom: "2%",
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: "1%",
    paddingRight: "4%",
  },
  innerContainerAddress: {
    flexDirection: "row",
    width: "80%",

    alignItems: "center",

    paddingTop: "2%",
  },
  text1: {
    color: "#6E6E6E",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
  text2: {
    fontWeight: "300",
    color: "#fb7a7b",
    paddingTop: "1%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingEnd: 20,
  },
  customButton: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "yellow",
    borderRadius: 30,
    borderColor: "white",
    borderWidth: 3,
    height: 45,
    width: 100,
  },
  textdate: {
    paddingTop: "4%",
    color: "#6E6E6E",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
  customButton2: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fe696c",
    borderRadius: 30,
    borderColor: "white",
    borderWidth: 3,
    height: 45,
    width: 100,
  },

  hidingH1: {
    color: "#51AB1D",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
  btnText: {
    fontWeight: "bold",
  },
  btnText2: {
    fontWeight: "bold",
    color: "white",
  },
  Container: {
    flex: 1,
    height: "100%",
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
