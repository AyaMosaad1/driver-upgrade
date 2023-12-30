import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import * as React from "react";
import { useState } from "react";
import { CommonActions, useNavigation } from "@react-navigation/native";
import Route1 from "./Route1";
import Route2 from "./Route2";
import Route3 from "./Route3";
import CalendarPicker from "react-native-calendar-picker";
import GlobalStyles from "../../../Utils/GlobalStyles";
import GlobalFonts from "../../../Utils/GlobalFonts";
import Pickup_History_styles from "./Pickup_History_styles";
import CalanderPicker from "../../../Components/Calander/CalanderPicker";
import Header_Global from "../../../Components/Header_Global";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import NoInternet from "../../../Components/nointernet";
import { useDispatch } from "react-redux";
import { FilterDateApply } from "../../../Redux/Reducers/DriverInfo";
import moment from "moment";
import strings from "../../../constants/lng/LocalizedStrings";

export default function Pickup_History() {
  const navigation = useNavigation();
  const [calandermodal, setcalandermodal] = useState(false);
  var dispatch = useDispatch();

  const [showRoute1, setshowRoute1] = React.useState(true);
  const [showRoute2, setshowRoute2] = React.useState(false);
  const [showRoute3, setshowRoute3] = React.useState(false);
  const [bgcolor, setcolor] = useState("#FFE713");
  const [bgcolor2, setcolor2] = useState("#E4E9F3");
  const [selectedStartDate, setSelectedStartDate] = useState(
    strings.SelectDate
  );
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [bgcolor3, setcolor3] = useState("#E4E9F3");

  const [nointernet, setnointernet] = useState(false);

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     console.log("Connection type", state.type);
  //     console.log("Is connected?", state.isConnected);

  //     if (state.isConnected === false) {
  //       setnointernet(true);
  //     } else if (state.isConnected === true) {
  //       setnointernet(false);
  //     }
  //   });
  //   return () => {
  //     unsubscribe();
  //   };
  // });
  React.useEffect(() => {
    // getDateTime();
  }, []);
  const getDateTime = () => {
    var days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    var Months = [
      "Jan",
      "Feb",
      "March",
      "Apirl",
      "May",
      "Jun",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var day = days[new Date().getDay()];
    var date = new Date().getDate(); //Current Date
    var month = Months[new Date().getMonth()]; //Current Month

    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    setSelectedStartDate(day + " " + date + " " + month);
    // :00:00.000Z time format
    const maxDate = moment(selectedStartDate).format("YYYY-MM-DD");
    console.log("firsttimedate", maxDate);
    dispatch(FilterDateApply(maxDate));
  };
  const Route1_Handler = () => {
    if (showRoute1 && bgcolor != "#FFE713") {
      setshowRoute1(false);
      setcolor("#E4E9F3");
    } else {
      setshowRoute1(true);
      setshowRoute2(false);
      setshowRoute3(false);
      setcolor("#FFE713");
      setcolor2("#E4E9F3");
      setcolor3("#E4E9F3");
    }
  };

  const Route2_Handler = () => {
    if (showRoute2 && bgcolor2 != "#FFE713") {
      setshowRoute2(false);
      setcolor2("#E4E9F3");
    } else {
      setshowRoute2(true);
      setshowRoute1(false);
      setshowRoute3(false);
      setcolor2("#FFE713");
      setcolor("#E4E9F3");
      setcolor3("#E4E9F3");
    }
  };
  const Route3_Handler = () => {
    if (showRoute3 && bgcolor3 != "#FFE713") {
      setshowRoute3(false);
      setcolor3("#E4E9F3");
    } else {
      setshowRoute3(true);
      setshowRoute2(false);
      setshowRoute1(false);
      setcolor3("#FFE713");
      setcolor("#E4E9F3");
      setcolor2("#E4E9F3");
    }
  };
  const onDateChange = (date, type) => {
    // console.log(date.substring(0, 10));
    // setFilterDate(date.substring(0, 10));
    //function to handle the date change
    if (type === "END_DATE") {
      setSelectedEndDate(date);
      setcalandermodal(false);
    } else {
      setSelectedEndDate(null);

      setSelectedStartDate(date);

      const maxDate = moment(date).format("YYYY-MM-DD");

      setcalandermodal(false);
      console.log("formatted date", maxDate);
      dispatch(FilterDateApply(maxDate));

      // ApplyFilter(maxDate);
    }
  };
  const startDate = selectedStartDate ? selectedStartDate.toString() : "";
  return (
    <View
      style={[
        Pickup_History_styles.container,
        GlobalStyles.FlexDirectionColumn,
      ]}
    >
      <Header_Global
        Title={strings.PICKUPHISTORY}
        BackIcon={true}
        Onpress={() => {
          navigation.navigate("BottomTabNavigation", { screen: "Home" });
        }}
      />
      <View style={GlobalStyles.cardview}>
        <View
          style={[
            GlobalStyles.cardview,
            { backgroundColor: "white", marginTop: 10 },
          ]}
        >
          <View style={Pickup_History_styles.scrollview_style}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "98%",
              }}
            >
              <Text style={Pickup_History_styles.filterStyle}>
                {strings.FILTER}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  // console.log("clicked");
                  dispatch(FilterDateApply(""));
                  const resetAction = CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Pickup_History" }],
                  });
                  navigation.dispatch(resetAction);
                }}
              >
                <Text style={Pickup_History_styles.filterStyle}>
                  {strings.CLEARFILTER}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                setcalandermodal(true);
              }}
            >
              <View style={Pickup_History_styles.Calnder_View}>
                <Image
                  style={Pickup_History_styles.Dropdown_Arrow}
                  source={require("../../../assets/dropdownm.png")}
                />
                <View style={Pickup_History_styles.calnderImg}>
                  <Image
                    style={{ marginRight: "4%", width: 17.91, height: 18.43 }}
                    source={require("../../../assets/calendarIcon.png")}
                  />
                  <Text style={Pickup_History_styles.calander_date_txt}>
                    {startDate.substring(0, 16)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={Pickup_History_styles.innerViewStyle}>
              <TouchableOpacity
                style={Pickup_History_styles.buttonView1(bgcolor)}
                onPress={Route1_Handler}
              >
                <Text style={Pickup_History_styles.innerText}>
                  {strings.ROUTE1}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={Pickup_History_styles.buttonView2(bgcolor2)}
                onPress={Route2_Handler}
              >
                <Text style={Pickup_History_styles.innerText}>
                  {strings.ROUTE2}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={Pickup_History_styles.buttonView3(bgcolor3)}
                onPress={Route3_Handler}
              >
                <Text style={Pickup_History_styles.innerText}>
                  {strings.ROUTE3}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={Pickup_History_styles.filterView}></View>
          </View>
          {showRoute1 ? <Route1></Route1> : null}
          {showRoute2 ? <Route2></Route2> : null}
          {showRoute3 ? <Route3></Route3> : null}
        </View>

        <Modal
          transparent
          animationType="slide"
          hardwareAccelerated
          visible={calandermodal}
          onRequestClose={() => {
            setcalandermodal(false);
          }}
        >
          <TouchableWithoutFeedback
            style={{
              flex: 1,
            }}
            onPress={() => {
              setcalandermodal(false);
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" && "padding"}
              style={[GlobalStyles.fullwidth, GlobalStyles.flex1]}
            >
              <View style={Pickup_History_styles.calanderpicker_view}>
                <CalendarPicker
                  startFromMonday={true}
                  allowRangeSelection={false}
                  minDate={new Date(2018, 1, 1)}
                  width={337}
                  height={281}
                  maxDate={new Date(2050, 6, 3)}
                  weekdays={["M", "T", "W", "T", "F", "S", "S"]}
                  monthTitleStyle={{
                    fontSize: 11,
                    fontFamily: "Poppins_600SemiBold",
                    color: "#7D828D",
                  }}
                  yearTitleStyle={{
                    fontSize: 11,
                    fontFamily: "Poppins_600SemiBold",
                    color: "#7D828D",
                  }}
                  dayLabelsWrapper={{
                    borderColor: "white",
                  }}
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
                  previousTitle="<"
                  nextTitle=">"
                  todayBackgroundColor="#51AB1D"
                  selectedDayColor="#51AB1D"
                  selectedDayTextColor="white"
                  scaleFactor={375}
                  nextTitleStyle={{
                    fontSize: 18,
                  }}
                  previousTitleStyle={{
                    fontSize: 18,
                  }}
                  textStyle={{
                    color: "#707070",
                    fontSize: 11,
                    fontFamily: "Poppins_500Medium",
                  }}
                  onDateChange={onDateChange}
                />
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>
        {/* <NoInternet internet={nointernet} /> */}
      </View>
    </View>
  );
}
