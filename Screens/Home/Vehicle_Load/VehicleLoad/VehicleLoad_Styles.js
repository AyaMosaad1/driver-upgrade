import { StyleSheet } from "react-native";
const VehicleLoad_Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE713",
  },
  innerContainerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: "1%",
    paddingRight: "4%",
  },
  innerContainer: {
    flex: 10,
    paddingTop: "15%",
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
});
export default VehicleLoad_Styles;
