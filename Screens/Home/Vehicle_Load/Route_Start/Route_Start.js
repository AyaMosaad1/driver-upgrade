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
import React, { useState, useEffect } from "react";
import * as geolib from "geolib";
import { CommonActions, useNavigation } from "@react-navigation/native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import GlobalColors from "../../../../Utils/GlobalColors";
import MapViewDirections from "react-native-maps-directions";
import GlobalStyles from "../../../../Utils/GlobalStyles";
import Route_Start_Styles from "../../Vehicle_Load/Route_Start/Route_Start_Styles";
import Toast from "react-native-root-toast";
import Header_Global from "../../../../Components/Header_Global";
import strings from "../../../../constants/lng/LocalizedStrings";

export default function Route_Start({ route }) {
  const [speed, setspeed] = useState(1);
  const [Time, SetTime] = useState(null);

  const { SelectedWarehouse } = route.params;
  const [distance, setdistance] = useState(0);
  const apiKey = "AIzaSyDXoHO79vxypTv8xL4V10cf5kFpIYDO9Rk";

  const [pin, setPin] = useState();
  const [location, setLocation] = useState(null);
  const [Address, setAddress] = useState("warehouse Location");
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const calculatePreciseDistance = (lat, long) => {
    var pdis = geolib.getDistance(
      { latitude: pin.latitude, longitude: pin.longitude },
      { latitude: lat, longitude: long }
    );
    setdistance(pdis);
    console.log("Precise Distance", pdis / 1000);
    console.log("Distance", pdis);

    console.log("timeee", pdis / 0 / 60);
    SetTime(pdis / speed / 60);

    // (`Precise Distance\n\n${pdis} Meter\nOR\n${pdis / 1000} KM`);
  };

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
    let Address = await Location.reverseGeocodeAsync({
      latitude: SelectedWarehouse.latitude,
      longitude: SelectedWarehouse.longitude,
    });
    setAddress(
      Address[0].street == null || Address[0].street == ""
        ? ""
        : Address[0].street + " " + Address[0].city + " " + Address[0].country
    );
    calculatePreciseDistance(
      SelectedWarehouse.latitude,
      SelectedWarehouse.longitude
    );
    setspeed(
      location.coords.speed < 1
        ? 1
        : parseFloat(location.coords.speed).toFixed(6)
    );
    setLat(location.coords.latitude);
    setLong(location.coords.longitude);
    setLocation(location);
    console.log(location.coords);
    console.log("Address", Address[0].street);
    console.log("selected store", SelectedWarehouse);

    setPin({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  }, [1]); ////pin, SelectedWarehouse, Address, distance, speed

  const Rote_button_press = () => {
    {
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
      navigation.dispatch(resetAction);
      Toast.show("Recycle order delivered to warehouse");
    }
  };

  const navigation = useNavigation();
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
          Route_Start_Styles.container,
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
            navigation.navigate("Warehouse_Location");
          }}
        />
        <View style={Route_Start_Styles.innerContainer}>
          <View style={Route_Start_Styles.mapview}>
            <MapView
              provider={PROVIDER_GOOGLE}
              showsTraffic={true}
              followsUserLocation={true}
              showsCompass={true}
              showsPointsOfInterest={false}
              showsUserLocation={true}
              style={{ height: "100%", width: "100%", borderRadius: 6 }}
              initialRegion={{
                latitude: pin.latitude,
                longitude: pin.longitude,
                latitudeDelta: 0.04,
                longitudeDelta: 0.05,
              }}
              onUserLocationChange={(e) => {
                console.log("onUserLocationChange", e.nativeEvent.coordinate);
                setPin({
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude,
                  latitudeDelta: e.nativeEvent.coordinate.latitudeDelta,
                  longitudeDelta: e.nativeEvent.coordinate.longitudeDelta,
                });
              }}
              // onPress={(event) => {
              //   let location = event.nativeEvent.coordinate;
              //   console.log("Updated Location", location.latitude);
              //   let lat, long;
              //   lat = location.latitude;
              //   long = location.longitude;
              //   getAddres(parseInt(lat), parseInt(long));
              //   //  Address = Location.reverseGeocodeAsync(location);
              //   setPin(event.nativeEvent.coordinate);
              // }}
            >
              <Marker
                coordinate={SelectedWarehouse}
                title={"Your Location"}
                pinColor="green"
                description="David John"
                onPress={(event) => {
                  let location = event.nativeEvent.coordinate;

                  console.log("Updated Location", location.latitude);
                  let lat, long;
                  lat = SelectedWarehouse.latitude;
                  long = SelectedWarehouse.longitude;
                  // getAddres(parseFloat(lat), parseFloat(long));
                  //  Address = Location.reverseGeocodeAsync(location);
                }}
              />

              <Circle
                center={pin}
                radius={200}
                strokeColor="green"
                strokeWidth={0.5}
              />
              {/* <MapViewDirections
              origin={pin}
              destination={SelectedWarehouse}
              apikey={apiKey}
            /> */}
            </MapView>
          </View>
          <View style={Route_Start_Styles.routedetails}>
            <View style={Route_Start_Styles.innerContainerAddress}>
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
                  {Address}
                </Text>
              }
            </View>
            <View style={Route_Start_Styles.innerContainerrow}>
              <View style={Route_Start_Styles.innerContainerroute}>
                {
                  <Image
                    style={{ marginRight: "3%", height: 24, width: 26 }}
                    source={require("../../../../assets/navroute.png")}
                  ></Image>
                }
                {
                  <Text
                    style={{
                      color: "#6E6E6E",
                      fontSize: 14,
                      paddingTop: 8,
                      paddingLeft: 8,

                      fontFamily: "Poppins_500Medium",
                    }}
                  >
                    {distance / 1000}km
                  </Text>
                }
              </View>
              <View style={Route_Start_Styles.innerContainertime}>
                {
                  <Image
                    style={{ marginLeft: "3%", height: 24, width: 24 }}
                    source={require("../../../../assets/time.png")}
                  ></Image>
                }
                {
                  <Text
                    style={{
                      color: "#6E6E6E",
                      fontSize: 14,
                      paddingLeft: 8,
                      fontFamily: "Poppins_500Medium",
                    }}
                  >
                    {parseFloat(Time).toFixed(0)} Min
                  </Text>
                }
              </View>
            </View>
          </View>

          {/* <View style={{ marginTop: "2%", marginRight: "5%", marginLeft: "5%" }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              style={styles.Button}
              onPress={() => navigation.navigate("Add_Request")}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{ marginRight: "2%" }}
                  source={require("../../assets/addreq.png")}
                ></Image>
                <Text
                  style={{
                    color: "black",
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                  }}
                >
                  Add Request
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.Buttongreen}
              onPress={() => navigation.navigate("False_Request")}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                  }}
                >
                  False Request
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginTop: "3%", marginRight: "5%", marginLeft: "5%" }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              style={styles.Button}
              onPress={() => Rote_button_press()}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                  }}
                >
                  End Route
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.Buttongreen}
              onPress={() => navigation.navigate("Receive_Items")}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 12,
                    fontFamily: "Poppins_600SemiBold",
                  }}
                >
                  Receive items
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View> */}
          <View
            style={{
              marginTop: "3%",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={GlobalStyles.ButtonMain}
              onPress={() => Rote_button_press()}
            >
              <Text style={GlobalStyles.ButtonTextMain}>
                {strings.DELIVERITEMS}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
