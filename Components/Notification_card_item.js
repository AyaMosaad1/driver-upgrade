import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useFonts } from "expo-font";
import {
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import AppLoading from "expo-app-loading";
import GlobalStyles from "../Utils/GlobalStyles";

export default function Notification_card_item({
  cardLabel,
  Datelabel,
  Notificationdesc,
  image,
}) {
  let [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });

  if (!fontsLoaded) {
    return <AppLoading></AppLoading>;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          {
            <Image
              style={{
                width: 60,
                height: 60,
                borderRadius: 60 / 2,
                overflow: "hidden",
              }}
              source={
                image
                  ? { uri: image }
                  : require("../assets/notification-bell.png")
              }
            ></Image>
          }
          <View style={{ flexDirection: "column" }}>
            {<Text style={styles.hidingH1}>{cardLabel}</Text>}
            {<Text style={styles.text1}>{Notificationdesc}</Text>}
            {
              <Text style={[styles.text1, { paddingTop: 10 }]}>
                {Datelabel}
              </Text>
            }
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    borderTopColor: "transparent",

    borderRadius: 2,
    borderColor: "#E4E9F3",
    borderWidth: 1,
  },
  innerContainer: {
    flexDirection: "row",
    padding: 15,
  },
  text1: {
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 30,
    fontSize: 12,
    color: "#6E6E6E",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Poppins_500Medium",
  },
  text2: {
    padding: 15,
    fontWeight: "300",
    color: "#fb7a7b",
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
    fontWeight: "bold",
    padding: 10,
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
});
