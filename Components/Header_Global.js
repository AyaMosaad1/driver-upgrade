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
  Pressable,
} from "react-native";
import styles from "../styles";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../Utils/GlobalStyles";

export default function Header_Global({
  Title,
  BackIcon,
  Onpress,
  CustomStyle,
}) {
  return (
    <View
      style={{
        flex: 1,
        alignContent: "center",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "5%",
        flexDirection: "row",
        alignSelf: "center",
        height: 20,
        width: "85%",
      }}
    >
      <View style={{ height: "100%", justifyContent: "flex-end" }}>
        <Pressable onPress={Onpress} hitSlop={20}>
          <Image
            style={{
              height: 16.97,
              width: 10.61,
              alignSelf: "flex-end",
              marginBottom: 5,
            }}
            source={BackIcon ? require("../assets/back.png") : null}
          ></Image>
        </Pressable>
      </View>

      <Text style={GlobalStyles.HeaderText2}>{Title}</Text>
      <Image style={{ height: 16.97, width: 10.61 }}></Image>
    </View>
  );
}
