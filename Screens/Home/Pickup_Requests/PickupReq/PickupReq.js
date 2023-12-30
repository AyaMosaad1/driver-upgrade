import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as React from "react";
import { useState } from "react";

import { useNavigation } from "@react-navigation/native";
import Request_Route1 from "../Routes_to_start/Request_Route1";
import Request_Route2 from "../Routes_to_start/Request_Route2";
import Request_Route3 from "../Routes_to_start/Request_Route3";
import * as Location from "expo-location";

import GlobalStyles from "../../../../Utils/GlobalStyles";
import GlobalColors from "../../../../Utils/GlobalColors";
import Ongoing_Route1 from "../../Pickup_Requests/OngoingRoutes/Ongoing_Route1";
import PickupReq_Styles from "./PickupReq_Styles";
import GlobalFonts from "../../../../Utils/GlobalFonts";
import Ongoing_Route2 from "../OngoingRoutes/Ongoing_Route2";
import Ongoing_Route3 from "../OngoingRoutes/Ongoing_Route3";
import Header_Global from "../../../../Components/Header_Global";
import { useEffect } from "react";
import Api from "../../../../Api/Api";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import Forgot_Password_Styles from "../../../Forgot_Password/Forgot_Password_Styles";
import NetInfo from "@react-native-community/netinfo";
import NoInternet from "../../../../Components/nointernet";
import { useDispatch } from "react-redux";
import { SortingVariable } from "../../../../Redux/Reducers/DriverInfo";
import strings from "../../../../constants/lng/LocalizedStrings";
export default function PickupReq() {
  const { Coordinates } = useSelector((state) => state.recyclerequestsdetails);
  var dispatch = useDispatch();

  const { Profile } = useSelector((state) => state.driverdetails);
  const [filterview, setfilterview] = useState(false);
  const [FilterText, setFilterText] = useState("Distance");
  const [RoutSelected, setRoutSelected] = useState("1");
  const navigation = useNavigation();
  const [StartRoute, SetStartRoute] = useState(true);
  const [showRoute1, setshowRoute1] = React.useState(true);
  const [showRoute2, setshowRoute2] = React.useState(false);
  const [showRoute3, setshowRoute3] = React.useState(false);
  const [ongoingrequest, setongoingrequest] = useState(false);

  const [bgcolor, setcolor] = useState("#FFE713");
  const [bgcolor2, setcolor2] = useState("#E4E9F3");

  const [bgcolor3, setcolor3] = useState("#E4E9F3");

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
  const Route1_Handler = () => {
    setRoutSelected("1");
    if (showRoute1 && bgcolor != "#FFE713") {
      setshowRoute1(false);
      setcolor("#E4E9F3");
    } else {
      setshowRoute1(true);
      setshowRoute2(false);
      setshowRoute3(false);
      setcolor("#FFE713");
      setcolor2("#E4E9F3");
      setcolor3("#E4E9F3");
    }
  };

  const Route2_Handler = () => {
    setRoutSelected("2");

    if (showRoute2 && bgcolor2 != "#FFE713") {
      setshowRoute2(false);
      setcolor2("#E4E9F3");
    } else {
      setshowRoute2(true);
      setshowRoute1(false);
      setshowRoute3(false);
      setcolor2("#FFE713");
      setcolor("#E4E9F3");
      setcolor3("#E4E9F3");
    }
  };
  const Route3_Handler = () => {
    setRoutSelected("3");

    if (showRoute3 && bgcolor3 != "#FFE713") {
      setshowRoute3(false);
      setcolor3("#E4E9F3");
    } else {
      setshowRoute3(true);
      setshowRoute2(false);
      setshowRoute1(false);
      setcolor3("#FFE713");
      setcolor("#E4E9F3");
      setcolor2("#E4E9F3");
    }
  };
  useEffect(async () => {
    console.log("coord", Coordinates.length);
    let { status2 } = await Location.requestForegroundPermissionsAsync();
    grtOngoingRequests();
  });
  const grtOngoingRequests = () => {
    let path = "recycles?status=onGoing&driver_id=" + Profile.id + "";
    Api.request("get", path)
      .then((response) => {
        if (response.data.length > 0) {
          setongoingrequest(true);
        } else {
          setongoingrequest(false);
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
  return (
    <View
      style={[
        PickupReq_Styles.container,
        {
          flex: 1,
          // Try setting `flexDirection` to `"row"`.
          flexDirection: "column",
        },
      ]}
    >
      <Header_Global
        Title={strings.PICKUPREQUEST}
        BackIcon={true}
        Onpress={() =>
          navigation.navigate("BottomTabNavigation", { screen: "Home" })
        }
      />
      <View style={GlobalStyles.cardview}>
        <View
          style={[
            GlobalStyles.cardview,
            { backgroundColor: "white", marginTop: 10 },
          ]}
        >
          <View style={PickupReq_Styles.scrollview_style}>
            <View style={PickupReq_Styles.innerViewStyle}>
              <TouchableOpacity
                style={[
                  PickupReq_Styles.Btn_Main_Route,
                  {
                    backgroundColor: StartRoute
                      ? GlobalColors.Yellow
                      : GlobalColors.LightGray,
                  },
                ]}
                onPress={() => {
                  Route1_Handler, SetStartRoute(true);
                }}
              >
                <Text style={PickupReq_Styles.innerText}>
                  {strings.ROUTETOSTART}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  PickupReq_Styles.Btn_Main_Route,
                  {
                    backgroundColor: StartRoute
                      ? GlobalColors.LightGray
                      : GlobalColors.Yellow,
                  },
                ]}
                onPress={() => {
                  SetStartRoute(false);
                }}
              >
                <Text style={PickupReq_Styles.innerText}>
                  {strings.ONGOINGROUTE}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={PickupReq_Styles.filterStyle}>{strings.SORTBY}</Text>
            <TouchableOpacity
              onPress={() => {
                setfilterview(true);
              }}
            >
              <View style={PickupReq_Styles.SortView}>
                <Text
                  style={[
                    GlobalFonts.FontMedium,
                    {
                      fontSize: 12,
                      color: GlobalColors.TXTGray,
                    },
                  ]}
                >
                  {FilterText}
                </Text>
                <Image
                  style={GlobalStyles.ArrowDown}
                  source={require("../../../../assets/arrowdown.png")}
                ></Image>
              </View>
            </TouchableOpacity>

            <View style={PickupReq_Styles.innerViewStyle}>
              <TouchableOpacity
                style={PickupReq_Styles.buttonView1(bgcolor)}
                onPress={Route1_Handler}
              >
                <Text style={PickupReq_Styles.innerText}>{strings.ROUTE1}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={PickupReq_Styles.buttonView2(bgcolor2)}
                onPress={Route2_Handler}
              >
                <Text style={PickupReq_Styles.innerText}>{strings.ROUTE2}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={PickupReq_Styles.buttonView3(bgcolor3)}
                onPress={Route3_Handler}
              >
                <Text style={PickupReq_Styles.innerText}>{strings.ROUTE3}</Text>
              </TouchableOpacity>
            </View>
            <View style={PickupReq_Styles.filterView}></View>
          </View>
          {showRoute1 ? (
            StartRoute ? (
              <Request_Route1 />
            ) : (
              <Ongoing_Route1 />
            )
          ) : null}
          {showRoute2 ? (
            StartRoute ? (
              <Request_Route2 />
            ) : (
              <Ongoing_Route2 />
            )
          ) : null}
          {showRoute3 ? (
            StartRoute ? (
              <Request_Route3 />
            ) : (
              <Ongoing_Route3 />
            )
          ) : null}
          {StartRoute ? (
            <TouchableOpacity
              style={PickupReq_Styles.FloatingBtn}
              onPress={() => {
                console.log("coordinates", Coordinates);
                Coordinates.length == 0
                  ? Toast.show("No Request to start")
                  : ongoingrequest
                  ? Toast.show(strings.COMPLETEONGOING)
                  : navigation.navigate("Customers_Location");
              }}
            >
              <View style={GlobalStyles.FlexDirectionRow}>
                <Image
                  style={{ height: 19, width: 19 }}
                  source={require("../../../../assets/Path.png")}
                ></Image>
                <Text style={PickupReq_Styles.innerTextWhite}>
                  {strings.STARTROUTE}
                  {RoutSelected}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={PickupReq_Styles.FloatingBtnOngoing}
              onPress={() => {
                navigation.navigate("Add_Request");
              }}
            >
              <View style={GlobalStyles.FlexDirectionRow}>
                <Image
                  style={{ height: 19, width: 19 }}
                  source={require("../../../../assets/AddRequest.png")}
                ></Image>
                <Text style={PickupReq_Styles.innerText}>
                  {strings.ADDREQUEST}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <Modal
          transparent
          animationType="slide"
          hardwareAccelerated
          visible={filterview}
        >
          <TouchableWithoutFeedback
            style={{
              flex: 1,
            }}
            onPress={() => {
              setfilterview(false);
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" && "padding"}
              style={[GlobalStyles.fullwidth, GlobalStyles.flex1]}
            >
              <View style={PickupReq_Styles.ModalView}>
                <TouchableOpacity
                  style={{
                    alignSelf: "flex-start",
                    paddingLeft: "4%",
                    marginTop: "5%",
                  }}
                  onPress={() => {
                    setFilterText("Distance");
                    dispatch(SortingVariable("distance"));
                    setfilterview(false);
                  }}
                >
                  <View style={GlobalStyles.FlexDirectionRow}>
                    <Image
                      style={GlobalStyles.arrowright}
                      source={require("../../../../assets/arrowright.png")}
                    />
                    <Text
                      style={[
                        GlobalFonts.FontMedium,
                        {
                          paddingLeft: 10,
                          fontSize: 12,
                          color: GlobalColors.TXTGray,
                        },
                      ]}
                    >
                      Distance
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignSelf: "flex-start",
                    paddingLeft: "4%",
                  }}
                  onPress={() => {
                    setfilterview(false);
                    setFilterText("Postal Code");
                    dispatch(SortingVariable("postcode"));
                  }}
                >
                  <View style={GlobalStyles.FlexDirectionRow}>
                    <Image
                      style={GlobalStyles.arrowright}
                      source={require("../../../../assets/arrowright.png")}
                    />
                    <Text
                      style={[
                        GlobalFonts.FontMedium,
                        {
                          paddingLeft: 10,
                          fontSize: 12,
                          color: GlobalColors.TXTGray,
                        },
                      ]}
                    >
                      Postal Code
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignSelf: "flex-start",
                    paddingLeft: "4%",
                  }}
                  onPress={() => {
                    setFilterText("Pickup Time");
                    dispatch(SortingVariable("pickuptime"));

                    setfilterview(false);
                  }}
                >
                  <View style={GlobalStyles.FlexDirectionRow}>
                    <Image
                      style={GlobalStyles.arrowright}
                      source={require("../../../../assets/arrowright.png")}
                    />
                    <Text
                      style={[
                        GlobalFonts.FontMedium,
                        {
                          paddingLeft: 10,
                          fontSize: 12,
                          color: GlobalColors.TXTGray,
                        },
                      ]}
                    >
                      Pickup Time
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignSelf: "flex-start",
                    paddingLeft: "4%",
                  }}
                  onPress={() => {
                    setFilterText("Quantities Or Items");
                    dispatch(SortingVariable("quantity"));

                    setfilterview(false);
                  }}
                >
                  <View style={GlobalStyles.FlexDirectionRow}>
                    <Image
                      style={GlobalStyles.arrowright}
                      source={require("../../../../assets/arrowright.png")}
                    />
                    <Text
                      style={[
                        GlobalFonts.FontMedium,
                        {
                          paddingLeft: 10,
                          fontSize: 12,
                          color: GlobalColors.TXTGray,
                        },
                      ]}
                    >
                      Quantities Or Items
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>
        <NoInternet internet={nointernet} />
      </View>
    </View>
  );
}
