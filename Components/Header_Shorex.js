import { useState, useEffect } from "react";
import {
  StyleSheet,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import styles from "../styles";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../Utils/GlobalStyles";

export default function Header() {
  return (
    <View style={{}}>
      <ImageBackground
        source={require("../assets/header.png")}
        resizeMode="stretch"
        style={{
          width: "100%",
          height: 157,

          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../assets/Logo.png")}
          style={GlobalStyles.HeaderImage}
        ></Image>
      </ImageBackground>
    </View>
  );
}
