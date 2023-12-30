import { StyleSheet } from "react-native";
const Notifications_Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE713",
  },
  innerContainer: {
    flex: 10,

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
    paddingLeft: "25%",
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
    padding: 15,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#51AB1D",
    justifyContent: "space-between",
    paddingHorizontal: "8%",
  },
  modalview: {
    marginTop: "50%",
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
  home_txt: {
    fontSize: 20,
    paddingLeft: "30%",
    fontWeight: "bold",
    alignSelf: "center",
  },
  loadmore: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 90,
  },
});
export default Notifications_Styles;
