import * as React from "react";
import {
  View,
  Image,
  Pressable,
  Text,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { Badge } from "react-native-elements";
// import GlobalStyles from "../utils/GlobalStyles";
import { CommonActions, DrawerActions } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import GlobalStyles from "../Utils/GlobalStyles";
import GlobalColors from "../Utils/GlobalColors";
import { useSelector } from "react-redux";
import strings from "../constants/lng/LocalizedStrings";
export const CustomTabBar = ({ navigation, route }) => {
  const { notificationcount } = useSelector((state) => state.driverdetails);
  // const islogin=useSelector(state=>state.login);

  const onPressMore = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.shadowbox}>
        <View style={styles.childContainer}>
          <Pressable
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
            hitSlop={40}
            onPress={() => {
              onPressMore();
            }}
          >
            <Image
              source={require("../assets/Settings_Icon.png")}
              resizeMode="contain"
              style={GlobalStyles.TabBarIcon}
            />

            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 10,
                paddingTop: "0.7%",
              }}
            >
              {strings.SETTING}
            </Text>
          </Pressable>
        </View>

        <View style={styles.childContainer}>
          <Pressable
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
            hitSlop={20}
            onPress={() => {
              const resetAction = CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
              });
              navigation.dispatch(resetAction);

              // navigation.navigate("BottomTabNavigation", { screen: "Home" });
            }}
          >
            <Image
              source={require("../assets/Home_Icon.png")}
              resizeMode="contain"
              style={GlobalStyles.TabBarIcon}
            />
            <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 10 }}>
              {strings.HOME}
            </Text>
          </Pressable>
        </View>

        <View style={styles.childContainer}>
          <Pressable
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
            hitSlop={20}
            onPress={() => {
              navigation.navigate("Notifications");
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                source={require("../assets/Notifications_Icon.png")}
                resizeMode="contain"
                style={GlobalStyles.TabBarIcon}
              />
              <Badge
                value={notificationcount}
                status="error"
                badgeStyle={{ backgroundColor: "#51AB1D" }}
                containerStyle={styles.badgeStyle}
              />
            </View>

            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 10,
                paddingTop: "0.7%",
              }}
            >
              {strings.NOTIFICATIONS}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: GlobalColors.TXTGray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 3,
  },
  shadowbox: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: 7,
    backgroundColor: "white",
  },
  badgeStyle: {
    position: "absolute",
    top: -8,
    right: -12,
  },
  childContainer: {
    marginTop: "2%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
