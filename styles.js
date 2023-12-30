import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  Main_container: {
    flex: 1,
    flexDirection: "column",
  },

  text: {
    color: "#51AB1D",
    fontSize: 21,
    marginTop: "15%",
    fontFamily: "Poppins_500Medium",
  },
  text_style_name: {
    fontSize: 18,
    flexDirection: "row",
    fontWeight: "bold",
    justifyContent: "space-between",
    color: "black",
    marginTop: 10,
  },

  text_input: {
    marginTop: 5,
    borderRadius: 5,
    padding: 12,
    width: 286,
    height: 45,
    color: "gray",
    borderWidth: 1,
    borderColor: "#E4E9F3",
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
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
  child_view: {
    flex: 1,
    marginTop: 10,
    alignContent: "center",
    alignSelf: "center",
  },
  logoViewStyle: {},
});

export default styles;
