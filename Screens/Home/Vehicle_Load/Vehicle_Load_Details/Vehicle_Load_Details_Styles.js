import { StyleSheet } from "react-native";
const Vehicle_Load_Details_Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE713",
  },
  itemsimgview: {
    paddingTop: "2%",
    flexDirection: "row",
  },
  innerContainer: {
    flex: 10,
    paddingTop: "10%",
    paddingHorizontal: "4%",
    backgroundColor: "transparent",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    backgroundColor: "white",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 30,
  },
  glocation: {
    marginRight: "5%",
    height: 37.33,
    width: 28,
  },
  header: {
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
  },
  headerTitle: {
    paddingLeft: "30%",
    paddingTop: "10%",
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    fontWeight: "700",
    // fontFamily:'Inter_900Black',
    paddingBottom: "2.2%",
  },
  backStyle: {
    paddingTop: "8%",
    paddingLeft: "6%",
  },
  dataContainer: {
    margin: 35,
  },
  filterStyle: {
    fontSize: 12,
    fontWeight: "bold",
    paddingBottom: 10,
    paddingLeft: 5,
    fontFamily: "Poppins_600SemiBold",
  },

  calenderView: {
    flexDirection: "row",
    padding: 5,
    borderWidth: 1.9,
    borderRadius: 6,
    borderColor: "#51AB1D",
    paddingLeft: "8%",
  },
  home_txt: {
    fontSize: 20,
    paddingLeft: "30%",
    fontWeight: "bold",
    alignSelf: "center",
  },
  Heading1: {
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
  },
  idtxt: {
    fontSize: 14,
    color: "#7D828D",
    fontFamily: "Poppins_500Medium",
  },
  itemquantity: {
    fontSize: 10,
    paddingTop: "1%",
    color: "black",
    fontFamily: "Poppins_600SemiBold",
  },
  headingaddress: {
    fontSize: 14,
    paddingTop: "4%",
    color: "black",
    fontFamily: "Poppins_600SemiBold",
  },
  detailaddress: {
    fontSize: 14,
    color: "#7D828D",
    fontFamily: "Poppins_500Medium",
  },
  headingtime: {
    fontSize: 16,
    paddingTop: "4%",
    color: "black",
    fontFamily: "Poppins_500Medium",
  },
  time: {
    fontSize: 12,
    paddingTop: "4%",
    paddingRight: "2%",
    color: "#6E6E6E",
    fontFamily: "Poppins_500Medium",
  },
  notes: {
    height: 60,
    fontSize: 12,
    paddingRight: "4%",
    paddingTop: "4%",
    color: "black",
    fontFamily: "Poppins_400Regular",
  },
  warehousemanager: {
    fontSize: 16,
    paddingTop: "4%",
    color: "#51AB1D",
    fontFamily: "Poppins_600SemiBold",
  },
});
export default Vehicle_Load_Details_Styles;
