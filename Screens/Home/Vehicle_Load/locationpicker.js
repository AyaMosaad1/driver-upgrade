import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import MapView from "react-native-maps";
import { useDispatch } from "react-redux";
import * as Location from "expo-location";
import GlobalStyles from "../../../Utils/GlobalStyles";
import {
  RR_Address,
  RR_Coordinates,
} from "../../../Redux/Reducers/Recycle_Request_Info";
import Header_Global from "../../../Components/Header_Global";
import GlobalColors from "../../../Utils/GlobalColors";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Keyboard } from "react-native";

import strings from "../../../constants/lng/LocalizedStrings";
import { useRef } from "react";
const Locationpicker = () => {
  const mapref = useRef();

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [pin, setPin] = useState();
  const [location, setLocation] = useState(null);
  const [Address, setAddress] = useState(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => {
          setKeyboardVisible(true); // or some other action
        }
      );
      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => {
          setKeyboardVisible(false); // or some other action
        }
      );
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
      setAddress(
        Address[0].street +
          ", " +
          Address[0].city +
          ", " +
          Address[0].country +
          " "
        // Address[0].postalCode
      );

      setLocation(location);

      setPin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [1]);
  const getAddres = async (lat, long) => {
    let Address = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: long,
    });
    setAddress(
      Address[0].street +
        ", " +
        Address[0].city +
        ", " +
        Address[0].country +
        " "
      // Address[0].postalCode
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
      <View style={styles.container}>
        <Header_Global
          Title={strings.CUSTOMER}
          BackIcon={true}
          Onpress={() => {
            navigation.navigate("Mark_Shedule");
            dispatch(RR_Address(Address));
            dispatch(RR_Coordinates(lat, long));
          }}
        />
        <View style={styles.innerContainer}>
          {!isKeyboardVisible ? (
            <View style={styles.mapview}>
              <MapView
                ref={mapref}
                onMapReady={() => {
                  setLat(pin.latitude);
                  setLong(pin.longitude);
                }}
                //  provider={PROVIDER_GOOGLE}
                style={{ height: "100%", width: "100%", borderRadius: 6 }}
                initialRegion={{
                  latitude: pin.latitude,
                  longitude: pin.longitude,
                  latitudeDelta: 0.00922,
                  longitudeDelta: 0.00421,
                }}
                onUserLocationChange={(e) => {
                  setPin({
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,
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
                <MapView.Marker
                  draggable
                  coordinate={pin}
                  title={"Your Location"}
                  onDragEnd={(event) => {
                    let location = event.nativeEvent.coordinate;
                    console.log("Updated Location", location);
                    let lat, long;
                    lat = location.latitude;
                    long = location.longitude;
                    setLat(lat);
                    setLong(long);
                    getAddres(parseFloat(lat), parseFloat(long));
                    setPin(event.nativeEvent.coordinate);
                  }}
                />
              </MapView>
            </View>
          ) : null}
          <View style={styles.routedetails}>
            <View style={styles.innerContainerAddress}>
              <Image
                style={{ marginRight: "3%", height: 24, width: 24 }}
                source={require("../../../assets/location.png")}
              ></Image>

              <GooglePlacesAutocomplete
                placeholder={Address}
                fetchDetails={true}
                enablePoweredByContainer={false}
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  setAddress(data.description);
                  // setLat();
                  // console.log(data, details);
                  console.log(JSON.stringify(details?.geometry?.location));
                  setLat(details?.geometry?.location.lat);
                  setLong(details?.geometry?.location.lng);
                  setPin({
                    latitude: details?.geometry?.location.lat,
                    longitude: details?.geometry?.location.lng,
                  });

                  mapref.current.fitToCoordinates([
                    {
                      latitude: details?.geometry?.location.lat,
                      longitude: details?.geometry?.location.lng,
                    },
                  ]);
                }}
                query={{
                  key: "AIzaSyDXoHO79vxypTv8xL4V10cf5kFpIYDO9Rk",
                  language: "en",
                }}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Mark_Shedule");
                dispatch(RR_Address(Address));
                dispatch(RR_Coordinates([lat, long]));
              }}
              style={styles.loginBtn}
            >
              <Text style={styles.btnText}>{strings.SAVE}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
};

export default Locationpicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe713",
  },
  header: {
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
  },
  headerTitle: {
    paddingLeft: "30%",
    paddingTop: "10%",
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
    paddingBottom: "2.2%",
  },
  backStyle: {
    paddingTop: "8%",
    paddingLeft: "6%",
  },
  innerContainer: {
    paddingTop: "5%",
    flex: 10,
    backgroundColor: "white",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.67,
    shadowRadius: 15.19,
    elevation: 60,
  },
  buttonContainer: {
    paddingTop: "3%",
    alignItems: "center",
  },
  mapview: {
    marginRight: "5%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
    height: "60%",
    marginLeft: "5%",
  },
  routedetails: {
    borderWidth: 0.8,
    borderColor: "#E4E9F3",
    borderRadius: 6,
    backgroundColor: "white",
    marginRight: "5%",
    marginLeft: "5%",
    marginTop: "2%",
  },
  innerContainerAddress: {
    flexDirection: "row",
    alignItems: "center",
    padding: "3%",
  },
  innerContainerrow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "2%",
  },
  innerContainertime: {
    flexDirection: "row",
    alignItems: "center",
    padding: "2%",
    marginLeft: "10%",
  },
  innerContainerroute: {
    flexDirection: "row",
    alignItems: "center",
    padding: "4%",
  },
  btnText: {
    fontSize: 20,
    color: "white",
  },
  loadmore: {
    margin: "9%",
    flexDirection: "row",
    alignSelf: "center",
    height: 90,
  },
  loginBtn: {
    width: "75%",
    alignContent: "center",
    borderRadius: 5,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#52ab1d",
    paddingRight: 15,
  },
});
