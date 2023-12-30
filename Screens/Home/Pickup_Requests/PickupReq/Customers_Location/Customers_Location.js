import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import * as geolib from "geolib";
import React, { useState, useEffect, useRef } from "react";
import { CommonActions, useNavigation } from "@react-navigation/native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSelector } from "react-redux";
import MapViewDirections from "react-native-maps-directions";

import * as Location from "expo-location";
import Toast from "react-native-root-toast";
import GlobalStyles from "../../../../../Utils/GlobalStyles";
import Customers_Location_Styles from "../../PickupReq/Customers_Location/Customers_Location_Styles";
import GlobalColors from "../../../../../Utils/GlobalColors";
import * as TaskManager from "expo-task-manager";
import Header_Global from "../../../../../Components/Header_Global";
import ApiController from "../../../../../Api/ApiController";
import OwnStorage from "../../../../../Api/StorageController";
import NetInfo from "@react-native-community/netinfo";
import NoInternet from "../../../../../Components/nointernet";
import Add_Request_styles from "../../../Vehicle_Load/AddRequest_styles";
import { ActivityIndicator } from "react-native";
import strings from "../../../../../constants/lng/LocalizedStrings";
import Geocoder from "react-native-geocoding";

export default function Customers_Location({ route, navigation }) {
  // const { item_res } = route.params;

  var api = new ApiController();
  var localdata = new OwnStorage();
  const mapref = useRef(null);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [speed, setspeed] = useState(1);
  const { Coordinates } = useSelector((state) => state.recyclerequestsdetails);
  const [SelectedCustomerLocation, SetSelectedCustomerLocation] = useState();
  const [SelectedRequestId, SetSelectedRequestId] = useState();

  const [routestart, setroutestart] = useState(false);
  const [MarkersList, setMarkersList] = useState([]);
  const [Time, SetTime] = useState(0);
  const apiKey = "AIzaSyDXoHO79vxypTv8xL4V10cf5kFpIYDO9Rk";
  Geocoder.init("AIzaSyDXoHO79vxypTv8xL4V10cf5kFpIYDO9Rk");

  const [pin, setPin] = useState();
  const [MarkerDriver, setMarkerDriver] = useState();
  const [distance, setdistance] = useState(0);
  const [location, setLocation] = useState(null);
  const navigations = useNavigation();
  const [Address, setAddress] = useState("Customer Location");
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

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
  });
  useEffect(async () => {
    // The screen is focused
    // Call any action
    // Permissions.request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);

    let { status } = await Location.requestBackgroundPermissionsAsync();
    let { status2 } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted" && status2 !== "granted") {
      // Toast.show("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    });

    setPin({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    // let Address = await Location.reverseGeocodeAsync({
    //   latitude: Coordinates[0].latitude,
    //   longitude: Coordinates[0].longitude,
    // });
    Geocoder.from(Coordinates[0].latitude, Coordinates[0].longitude)
      .then((json) => {
        const addressComponent = json.results[0].formatted_address;
        console.log(addressComponent);

        setAddress(addressComponent);
      })
      .catch((error) => console.warn(error));
    SetSelectedCustomerLocation({
      latitude: Coordinates[0].latitude,
      longitude: Coordinates[0].longitude,
    });
    SetSelectedRequestId(Coordinates[0].id);
    // Toast.show("You've entered iddd region:" + SelectedRequestId);

    // console.log(Address);

    // setAddress(
    //   Address[0].street + " " + Address[0].city + " " + Address[0].country
    // );
    calculatePreciseDistance(
      Coordinates[0].latitude,
      Coordinates[0].longitude,
      location.coords.latitude,
      location.coords.longitude
    );

    setspeed(
      location.coords.speed < 1
        ? 1
        : parseFloat(location.coords.speed).toFixed(6)
    );

    setLat(location.coords.latitude);
    setLong(location.coords.longitude);
    setLocation(location);
    // console.log(location.coords);
    // console.log("Address", Address[0].street);

    // let region = {
    //   identifier: "LOCATION_GEOFENCE",
    //   latitude: Coordinates[0].latitude,
    //   longitude: Coordinates[0].longitude,
    //   radius: 30,
    // };
    // TaskManager.defineTask(
    //   "LOCATION_GEOFENCE",
    //   ({ data: { eventType, region }, error }) => {
    //     if (error) {
    //       Toast.show(error);
    //       return;
    //     }
    //     if (eventType === Location.GeofencingEventType.Enter) {
    //       setroutestart(true);
    //       // Toast.show("enter in region!");
    //       console.log("You've entered region:", region);
    //     } else if (eventType === Location.GeofencingEventType.Exit) {
    //       setroutestart(false);

    //       console.log("You've left region:", region);
    //       // Toast.show("You've left region");
    //     }
    //   }
    // );

    // Location.startGeofencingAsync("LOCATION_GEOFENCE", [region]);

    // Return the function to unsubscribe from the event so it gets removed on unmount
  }, [Coordinates]); //////need to remove 1 if want to get continious location change by asim

  const calculatePreciseDistance = async (lat, long, pinlat, pinlong) => {
    var pdis = geolib.getDistance(
      { latitude: pinlat, longitude: pinlong },
      { latitude: lat, longitude: long }
    );

    setdistance(pdis);
    // console.log("Precise Distance", pdis / 1000);
    // console.log("Distance", pdis);
    // console.log("Speed", speed);

    // console.log("timeee", pdis / 0 / 60);
    SetTime(pdis / speed / 60);
    // (`Precise Distance\n\n${pdis} Meter\nOR\n${pdis / 1000} KM`);
  };
  const getAddres = async (lat, long) => {
    let Address = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: long,
    });
    setAddress(
      Address[0].street + " " + Address[0].city + " " + Address[0].country
    );

    // console.log("location change", Address);
  };
  const MarkOngoing = async (SelectedRequestId) => {
    const formdata = new FormData();
    formdata.append("_method", "PATCH");

    var token = await localdata.getvalue("api_token_Driver");

    api
      .Ongoing(token, SelectedRequestId, formdata)
      .then((response) => {
        console.log("updated response status", response);

        // Toast.show(strings.requestmarkedasongoing);
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.status == 401) {
          Toast.show("You are Blocked by the Admin");
          navigation.navigate("Login");
        }
        for (const [key, value] of Object.entries(error)) {
          console.log(`${key}: ${value}`);
          Toast.show(`${key}: ${value}`);
        }
      });
  };

  const Rote_button_press = () => {
    setroutestart(true);
    MarkOngoing(Coordinates[0].id);

    mapref.current.fitToCoordinates([
      { latitude: MarkerDriver.latitude, longitude: MarkerDriver.longitude },
    ]);
    // if (
    //   SelectedCustomerLocation == null ||
    //   SelectedCustomerLocation == undefined
    // ) {
    //   Toast.show("Please select Customer to start route");
    // } else {
    // }
  };

  // const coordinates = [
  //   { latitude: 32.50379997634203, longitude: 74.5050372076353 },
  // ];

  /////////////////////////////////for testing static markers

  const renderItems_marker = (item, i) => {
    return (
      <MapView.Marker
        key={i}
        identifier={"mk1"}
        coordinate={item}
        pinColor={GlobalColors.Green}
        onPress={(event) => {
          // SetSelectedCustomerLocation(event.nativeEvent.coordinate);
          // SetSelectedRequestId(item.id);
          // Toast.show(SelectedRequestId);
          // // console.log("Updated Location", location.latitude);
          // let lat, long;
          // lat = item.latitude;
          // long = item.longitude;
          // getAddres(parseFloat(lat), parseFloat(long));
          // //  Address = Location.reverseGeocodeAsync(location);
          // calculatePreciseDistance(lat, long);
        }}
      >
        <Text
          style={{
            backgroundColor: "green",
            color: "white",
            padding: 5,
            borderWidth: 1,
            borderColor: "yellow",
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          {item.customerName}
        </Text>
        <Image
          source={
            item.image
              ? { uri: item.image }
              : require("../../../../../assets/glocation.png")
          }
          style={
            item.image
              ? Customers_Location_Styles.customercircularimg
              : { height: 37.33, width: 28, alignSelf: "center" }
          }
        />
      </MapView.Marker>
    );
  };
  //////////////////////////////////Muhammad Asim/////////////////////////////
  if (pin == "" || pin == undefined) {
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
        style={[
          Customers_Location_Styles.container,
          GlobalStyles.FlexDirectionColumn,
        ]}
      >
        <View style={Add_Request_styles.header}>
          <TouchableOpacity
            style={Add_Request_styles.backStyle}
            onPress={() => {
              // const resetAction = CommonActions.reset({
              //   index: 0,
              //   routes: [{ name: "Add_Request" }],
              // });
              navigation.navigate("PickupReq");
            }}
          >
            <Image
              style={{ height: 16.97, width: 10.61 }}
              source={require("../../../../../assets/back.png")}
            />
          </TouchableOpacity>
          <Text style={Add_Request_styles.headerTitle}>{strings.CUSTOMER}</Text>
          <View style={{ width: 30, height: 30 }} />
        </View>

        <View style={GlobalStyles.cardview}>
          <View
            style={[
              GlobalStyles.cardview,
              { backgroundColor: "white", paddingTop: "5%" },
            ]}
          >
            <View style={Customers_Location_Styles.mapview}>
              <MapView
                ref={mapref}
                provider={PROVIDER_GOOGLE}
                followsUserLocation={true}
                showsCompass={true}
                showsPointsOfInterest={false}
                showsUserLocation={true}
                style={{ height: "100%", width: "100%", borderRadius: 6 }}
                onUserLocationChange={(e) => {
                  // console.log("onUserLocationChange", e.nativeEvent.coordinate);
                  setPin({
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  });
                }}
                onLayout={() => {
                  setMarkerDriver(pin);

                  // console.log("mapdata", mapref);

                  mapref.current.fitToCoordinates(
                    [
                      { latitude: pin.latitude, longitude: pin.longitude },
                      {
                        latitude: Coordinates[0].latitude,
                        longitude: Coordinates[0].longitude,
                      },
                    ],
                    {
                      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    }
                  );

                  // mapref.current.fitToSuppliedMarkers(["mk1", "mk2"], {
                  //   edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                  // });
                }}
              >
                {MarkerDriver ? (
                  <Marker
                    coordinate={MarkerDriver}
                    title="My Location"
                    identifier={"mk2"}
                  ></Marker>
                ) : null}

                {Coordinates.map(renderItems_marker)}

                {/* <Circle
              center={pin}
              radius={200}
              strokeColor="green"
              strokeWidth={0.5}
            /> */}
                {routestart && MarkerDriver ? (
                  <MapViewDirections
                    origin={MarkerDriver}
                    strokeColor={"blue"}
                    strokeWidth={6}
                    destination={SelectedCustomerLocation}
                    apikey={apiKey}
                  />
                ) : null}
              </MapView>
            </View>
            <View style={Customers_Location_Styles.routedetails}>
              <View style={Customers_Location_Styles.innerContainerAddress}>
                {
                  <Image
                    style={{ marginRight: "3%", height: 24, width: 24 }}
                    source={require("../../../../../assets/location.png")}
                  ></Image>
                }
                {
                  <Text
                    style={[
                      Customers_Location_Styles.txt_info_loc,
                      { width: "90%" },
                    ]}
                  >
                    {Address}
                  </Text>
                }
              </View>
              <View style={Customers_Location_Styles.innerContainerrow}>
                <View style={Customers_Location_Styles.innerContainerroute}>
                  {
                    <Image
                      style={{ marginRight: "3%", height: 24, width: 26 }}
                      source={require("../../../../../assets/navroute.png")}
                    ></Image>
                  }
                  {
                    <Text style={Customers_Location_Styles.txt_info_loc}>
                      {distance / 1000}km
                    </Text>
                  }
                </View>
                <View style={Customers_Location_Styles.innerContainertime}>
                  {
                    <Image
                      style={{ marginLeft: "3%", height: 24, width: 24 }}
                      source={require("../../../../../assets/time.png")}
                    ></Image>
                  }
                  {
                    <Text style={Customers_Location_Styles.txt_info_loc}>
                      {parseFloat(Time).toFixed(0)} Min
                    </Text>
                  }
                </View>
              </View>
            </View>
            {routestart ? (
              <View
                style={{ marginTop: "2%", marginRight: "5%", marginLeft: "5%" }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={Customers_Location_Styles.Buttongreen}
                    onPress={() =>
                      navigations.navigate("Receive_Items", {
                        RR_id: SelectedRequestId,
                      }) + setroutestart(false)
                    }
                  >
                    <View style={Customers_Location_Styles.buttonviewrow}>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 12,
                          fontFamily: "Poppins_600SemiBold",
                        }}
                      >
                        {strings.RECEIVEITEMS}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={Customers_Location_Styles.Buttongreen}
                    onPress={() =>
                      navigations.navigate("False_Request", {
                        RR_id: SelectedRequestId,
                      }) + setroutestart(false)
                    }
                  >
                    <View style={Customers_Location_Styles.buttonviewrow}>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 12,
                          fontFamily: "Poppins_600SemiBold",
                        }}
                      >
                        {strings.FALSEREQUEST}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={Customers_Location_Styles.route_start}>
                <TouchableOpacity
                  style={Customers_Location_Styles.Button2}
                  onPress={() => Rote_button_press()}
                >
                  <Text style={GlobalStyles.ButtonTextMain}>
                    {strings.ROUTESTART}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <NoInternet internet={nointernet} />
      </View>
    );
  }
}
