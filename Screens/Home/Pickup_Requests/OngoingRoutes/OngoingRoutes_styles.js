import { StyleSheet } from "react-native";
const OngoingRoute_styles = StyleSheet.create({
  containercard: {
    flex: 0.45,
    backgroundColor: "#FFFFFF",
    marginLeft: 20,
    marginTop: "1%",
    marginBottom: "1%",
    marginRight: 20,
    borderRadius: 6,
    borderColor: "#E4E9F3",
    borderWidth: 0.5,
  },
  innerContainerMain: {
    marginTop: "6%",
    paddingLeft: 15,
    marginBottom: "10%",
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: "1%",
    paddingRight: "4%",
  },
  innerContainerAddress: {
    flexDirection: "row",
    width: "80%",

    alignItems: "center",

    paddingTop: "4%",
  },
  text1: {
    color: "#6E6E6E",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
  text2: {
    fontWeight: "300",
    color: "#fb7a7b",
    paddingTop: "1%",
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
  Container: {
    flex: 1,
  },
  Totalcustomer: {
    paddingTop: "2%",
    paddingLeft: "5%",
    paddingRight: "5%",
    flexDirection: "row",
    paddingBottom: "5%",
    justifyContent: "space-between",
  },
  heading1: {
    fontSize: 16,
    color: "#51AB1D",
    fontFamily: "Poppins_600SemiBold",
  },
  heading2: {
    fontSize: 14,
    color: "#6E6E6E",
    fontFamily: "Poppins_600SemiBold",
  },
});
export default OngoingRoute_styles;
