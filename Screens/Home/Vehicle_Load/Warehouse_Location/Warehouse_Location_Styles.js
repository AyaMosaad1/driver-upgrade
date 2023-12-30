import { StyleSheet } from "react-native";

const Warehouse_Location_Styles = StyleSheet.create({
  innerContainerAddress: {
    flexDirection: "row",
    alignItems: "center",
    padding: "3%",
  },
  innerContainerroute: {
    flexDirection: "row",
    alignItems: "center",
    padding: "4%",
  },
  Button: {
    marginTop: 20,
    height: 50,
    borderColor: "black",
    borderRadius: 4,
    backgroundColor: "#53ab1b",
    width: 286,
    alignContent: "center",
    alignItems: "center",
    padding: 10,
  },
  innerContainerrow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "2%",
  },
  innerContainertime: {
    flexDirection: "row",
    alignItems: "center",
    padding: "2%",
    marginLeft: "10%",
  },
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
    paddingTop: "5%",
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
  mapview: {
    marginRight: "5%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
    height: "55%",
    marginLeft: "5%",
  },
  header: {
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
  },
  headerTitle: {
    paddingLeft: "20%",
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
  routedetails: {
    borderWidth: 0.8,
    borderColor: "#E4E9F3",
    borderRadius: 6,
    backgroundColor: "white",
    marginRight: "5%",
    marginLeft: "5%",
    marginTop: "2%",
  },
  txt_info_loc: {
    color: "#6E6E6E",
    fontSize: 14,
    paddingLeft: 8,
    fontFamily: "Poppins_500Medium",
  },
});
export default Warehouse_Location_Styles;
