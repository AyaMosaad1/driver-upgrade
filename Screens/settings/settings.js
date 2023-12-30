import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
import styles from "../../styles";

export default function Setting({ navigation }) {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const presshandler = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.Main_container}
    >
      <ScrollView>
        <TouchableWithoutFeedback onPress={() => presshandler()}>
          <View style={styles.Main_container}>
            <Text style={styles.text}>Settings</Text>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
