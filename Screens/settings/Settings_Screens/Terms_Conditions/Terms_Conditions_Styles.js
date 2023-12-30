import { StyleSheet } from "react-native";
const Terms_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE713",
  },

  innerContainer: {
    flex: 10,
    paddingTop: "10%",
    paddingLeft: "5%",
    paddingRight: "5%",
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
    paddingLeft: "25%",
    paddingTop: "10%",
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    fontWeight: "700",
    // fontFamily:'Inter_900Black',
    paddingBottom: "2.2%",
  },
  headerTitle_privacy: {
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    // fontFamily:'Inter_900Black',
    paddingBottom: "2.2%",
  },
  backStyle: {
    paddingTop: "8%",
    paddingLeft: "6%",
  },
});
export default Terms_styles;
