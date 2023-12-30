import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const CalanderPicker = ({ calandermodal, onDateChange, Close }) => {
  return (
    <View>
      <Modal
        transparent
        animationType="slide"
        hardwareAccelerated
        visible={calandermodal}
      >
        <View style={styles.calanderpicker_view}>
          <CalanderPicker
            startFromMonday={true}
            allowRangeSelection={false}
            minDate={new Date(2018, 1, 1)}
            width={337}
            height={281}
            maxDate={new Date(2050, 6, 3)}
            weekdays={["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]}
            months={[
              "January",
              "Febraury",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ]}
            previousTitle="Previous"
            nextTitle="Next"
            todayBackgroundColor="#FFE713"
            selectedDayColor="#51AB1D"
            selectedDayTextColor="white"
            scaleFactor={375}
            textStyle={{
              color: "#000000",
            }}
            onDateChange={onDateChange}
          />
          <TouchableOpacity
            style={{ alignSelf: "flex-end", paddingRight: "4%" }}
            onPress={Close}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default CalanderPicker;

const styles = StyleSheet.create({
  calanderpicker_view: {
    marginTop: "60%",
    width: 337,
    height: 281,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 0.3,
    borderColor: "#000",
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.57,
    shadowRadius: 15.19,

    elevation: 23,
  },
});
