import { StyleSheet } from "react-native";

const Login_Styles = StyleSheet.create({
  Main_container: {
    flex: 1,
    justifyContent: "space-around",
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
    justifyContent: "space-around",
    paddingBottom: 25,
  },
  logoViewStyle: {},
  LanguageViewM: {
    alignItems: "center",
    flexDirection: "row",
    marginRight: "5%",
    alignSelf: "flex-end",
  },
  LanguageDropdown: {
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#E4E9F3",
    borderRadius: 5,
  },
  LanguageTxt: {
    width: 50,
    alignContent: "center",
    alignItems: "center",
    padding: 10,
    fontSize: 12,
  },
  languageGlobe: {
    marginRight: "2%",
    height: 21,
    width: 21,
  },
  forgot_pass: {
    fontSize: 11,
    color: "#51ab1d",
    fontFamily: "Poppins_500Medium",
  },
  modal_view: {
    flex: 1,
    paddingTop: "30%",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
  warning_modal: {
    width: "90%",
    height: 153,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#707070",
    borderRadius: 8,
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

export default Login_Styles;
