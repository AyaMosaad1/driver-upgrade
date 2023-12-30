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
import * as geolib from "geolib";
import React, { useState, useEffect, useRef } from "react";
import { CommonActions, useNavigation } from "@react-navigation/native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSelector } from "react-redux";

import * as Location from "expo-location";

import Toast from "react-native-root-toast";
import GlobalColors from "../../../../Utils/GlobalColors";
import GlobalStyles from "../../../../Utils/GlobalStyles";
import Warehouse_Location_Styles from "./Warehouse_Location_Styles";
import Customers_Location_Styles from "../../Pickup_Requests/PickupReq/Customers_Location/Customers_Location_Styles";
import ApiController from "../../../../Api/ApiController";
import OwnStorage from "../../../../Api/StorageController";
import Header_Global from "../../../../Components/Header_Global";
import strings from "../../../../constants/lng/LocalizedStrings";
import Geocoder from "react-native-geocoding";

export default function Warehouse_Location({ route }) {
  const mapref = useRef(null);
  const [MarkerDriver, setMarkerDriver] = useState();

  const { warehouses } = route.params;
  const { Response } = route.params;
  var api = new ApiController();
  var localdata = new OwnStorage();
  const [speed, setspeed] = useState(1);
  const [RouteStart, setRouteStart] = useState(false);
  const [showloaderM, setshowloaderM] = useState(false);
  Geocoder.init("AIzaSyDXoHO79vxypTv8xL4V10cf5kFpIYDO9Rk");

  const [SelectedWarehouseLocation, SetSelectedWarehouseLocation] = useState();
  const [SelecteditemType, SetSelecteditemType] = useState();
  const [SelectedProductId, SetSelectedProductId] = useState("");

  const [MarkersList, setMarkersList] = useState([]);
  const [Time, SetTime] = useState(0);
  const [pin, setPin] = useState();
  const [distance, setdistance] = useState(0);
  /////////////////////////////////for testing static markers

  //////////////////////////////////Muhammad Asim/////////////////////////////
  const [location, setLocation] = useState(null);
  const [Address, setAddress] = useState("Warehouse Location");
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  useEffect(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    });
    let Address = await Location.reverseGeocodeAsync(location.coords);
    setspeed(
      location.coords.speed < 1
        ? 1
        : parseFloat(location.coords.speed).toFixed(6)
    );

    // console.log("SPEEDINUSE", speed);

    // var time = distance / 30;
    // var timeinminutes = time / 60;

    // console.log("Tame", timeinminutes);

    // setAddress(
    //   Address[0].street + " " + Address[0].city + " , " + Address[0].country
    // );
    setLat(location.coords.latitude);
    setLong(location.coords.longitude);
    setLocation(location);

    setPin({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: location.coords.latitudeDelta,
      longitudeDelta: location.coords.longitudeDelta,
    });
  }, [1]); //////need to remove 1 if want to get continious location change by asim

  const calculatePreciseDistance = (lat, long) => {
    var pdis = geolib.getDistance(
      { latitude: pin.latitude, longitude: pin.longitude },
      { latitude: lat, longitude: long }
    );

    setdistance(pdis);

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
  };

  const Rote_button_press = () => {
    if (
      SelectedWarehouseLocation == null ||
      SelectedWarehouseLocation == undefined
    ) {
      Toast.show("Please select warehouse to start route");
    } else {
      setRouteStart(true);
    }
  };
  const Deliver_button_press = async () => {
    setshowloaderM(true);
    var token = await localdata.getvalue("api_token_Driver");
    console.log("Response id", Response.id);
    console.log("Response products", SelectedProductId);

    const formdata = new FormData();
    formdata.append("_method", "PATCH");
    let path =
      "recycles/" +
      Response.id +
      " /products/" +
      SelectedProductId +
      "/status/Delivered";

    // Toast.show(path);
    api
      .DeliverItems(token, path, formdata)
      .then((response) => {
        setshowloaderM(false);
        const resetAction = CommonActions.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
        navigation.dispatch(resetAction);
        Toast.show("Request marked as Delivered");
      })
      .catch((error) => {
        setshowloaderM(false);
        if (error.response.status == 401) {
          Toast.show("You are Blocked by the Admin");
          navigation.navigate("Login");
        }
        console.log("error", error);
        for (const [key, value] of Object.entries(error)) {
          console.log(`${key}: ${value}`);
          Toast.show(`${key}: ${value}`);
        }
      });
  };

  const navigation = useNavigation();

  const renderItems_marker = (item, i) => {
    return (
      <MapView.Marker
        key={i}
        identifier={"mk1"}
        coordinate={item}
        pinColor={GlobalColors.Green}
        onPress={(event) => {
          SetSelecteditemType(item.item_type);

          let location = event.nativeEvent.coordinate;
          SetSelectedWarehouseLocation(event.nativeEvent.coordinate);

          // let t = Response?.products;
          // let Tselection = [];
          // for (let i = 0; i < t.length; i++) {
          //   if (t[i].item_type == SelecteditemType && t[i].id !== undefined) {
          //     let s = {
          //       id: t[i].id,
          //     };

          //     Tselection.push(s.id);
          //     SetSelectedProductId(Tselection);

          //     console.log(SelectedProductId);
          //   }
          // }

          let lat, long;
          lat = item.latitude;
          long = item.longitude;
          // getAddres(parseFloat(lat), parseFloat(long));

          Geocoder.from(parseFloat(lat), parseFloat(long))
            .then((json) => {
              const addressComponent = json.results[0].formatted_address;
              console.log(addressComponent);

              setAddress(addressComponent);
            })
            .catch((error) => console.warn(error));
          //  Address = Location.reverseGeocodeAsync(location);
          calculatePreciseDistance(lat, long);
          const Products = Response.products;
          const Result = Products.filter((value) => {
            // console.log("valuetypeeee", value);
            // console.log("items", item);

            console.log("value.item_type_id", value.item_type_id);
            console.log("item.item_type_id", item);

            return value.item_type_id === item.item_type;
          });

          console.log("Result", Result);
          SetSelectedProductId(Result[0].id);
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
            alignSelf: "center",
          }}
        >
          {item.title}
        </Text>
        <Image
          source={
            item.img
              ? { uri: item.img }
              : require("../../../../assets/glocation.png")
          }
          style={
            item.img
              ? Customers_Location_Styles.customercircularimg
              : { height: 37.33, width: 28, alignSelf: "center" }
          }
        />
      </MapView.Marker>
    );
  };
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
          Warehouse_Location_Styles.container,
          {
            // Try setting `flexDirection` to `"row"`.
            flexDirection: "column",
          },
        ]}
      >
        <Header_Global
          Title={strings.WAREHOUSEHOUSELCOAITON}
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
              { backgroundColor: "white", marginTop: 10, paddingTop: "5%" },
            ]}
          >
            <View style={Warehouse_Location_Styles.mapview}>
              <MapView
                ref={mapref}
                provider={PROVIDER_GOOGLE}
                showsTraffic={true}
                followsUserLocation={true}
                showsCompass={true}
                showsPointsOfInterest={false}
                zoomControlEnabled={true}
                showsUserLocation={true}
                style={{ height: "100%", width: "100%", borderRadius: 6 }}
                onLayout={() => {
                  setMarkerDriver(pin);

                  // console.log("mapdata", mapref);

                  mapref.current.fitToCoordinates(
                    [
                      { latitude: pin.latitude, longitude: pin.longitude },
                      warehouses[0],
                    ],
                    {
                      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    }
                  );

                  // mapref.current.fitToSuppliedMarkers(["mk1", "mk2"], {
                  //   edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                  // });
                }}
                onUserLocationChange={(e) => {
                  // console.log("onUserLocationChange", e.nativeEvent.coordinate);
                  setPin({
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  });
                }}
              >
                {warehouses.map(renderItems_marker)}

                {MarkerDriver ? (
                  <Marker
                    coordinate={MarkerDriver}
                    title="My Location"
                    identifier={"mk2"}
                  ></Marker>
                ) : null}
              </MapView>
            </View>
            <View style={Warehouse_Location_Styles.routedetails}>
              <View style={Warehouse_Location_Styles.innerContainerAddress}>
                {
                  <Image
                    style={{ marginRight: "3%", height: 24, width: 24 }}
                    source={require("../../../../assets/location.png")}
                  ></Image>
                }
                {
                  <Text style={Warehouse_Location_Styles.txt_info_loc}>
                    {Address}
                  </Text>
                }
              </View>
              <View style={Warehouse_Location_Styles.innerContainerrow}>
                <View style={Warehouse_Location_Styles.innerContainerroute}>
                  {
                    <Image
                      style={{ marginRight: "3%", height: 24, width: 26 }}
                      source={require("../../../../assets/navroute.png")}
                    ></Image>
                  }
                  {
                    <Text style={Warehouse_Location_Styles.txt_info_loc}>
                      {distance / 1000}km
                    </Text>
                  }
                </View>
                <View style={Warehouse_Location_Styles.innerContainertime}>
                  {
                    <Image
                      style={{ marginLeft: "3%", height: 24, width: 24 }}
                      source={require("../../../../assets/time.png")}
                    ></Image>
                  }
                  {
                    <Text style={Warehouse_Location_Styles.txt_info_loc}>
                      {parseFloat(Time).toFixed(0)} Min
                    </Text>
                  }
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: "5%",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {RouteStart ? (
                <TouchableOpacity
                  style={Warehouse_Location_Styles.Button}
                  onPress={() => {
                    Deliver_button_press();
                  }}
                >
                  <View style={[GlobalStyles.FlexDirectionRow]}>
                    {showloaderM && (
                      <ActivityIndicator
                        size="small"
                        color="white"
                        style={[GlobalStyles.activityIndicator]}
                      ></ActivityIndicator>
                    )}
                    <Text style={GlobalStyles.ButtonTextMain}>
                      {strings.DELIVERITEMS}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={Warehouse_Location_Styles.Button}
                  onPress={() => Rote_button_press()}
                >
                  <Text style={GlobalStyles.ButtonTextMain}>
                    {strings.ROUTESTART}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
