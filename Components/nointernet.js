import { Image, Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import Forgot_Password_Styles from "../Screens/Forgot_Password/Forgot_Password_Styles";
import GlobalFonts from "../Utils/GlobalFonts";
import GlobalColors from "../Utils/GlobalColors";

const NoInternet = ({ internet }) => {
  return (
    <View>
      <Modal
        visible={internet}
        transparent
        animationType="slide"
        hardwareAccelerated
      >
        <View style={Forgot_Password_Styles.centeredview}>
          <View style={Forgot_Password_Styles.modalView}>
            <Image
              style={{ height: "40%", width: "40%", alignSelf: "center" }}
              source={require("../assets/nointernet.png")}
            ></Image>
            <Text
              style={[
                GlobalFonts.FontSemiBold,
                { fontSize: 20, color: GlobalColors.TxtGreen },
              ]}
            >
              Check your internet connection
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NoInternet;

const styles = StyleSheet.create({});
