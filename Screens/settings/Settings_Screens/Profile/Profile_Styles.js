import { StyleSheet } from "react-native";

const Profile_Styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffe613",
  },
  imgview: {
    marginTop: 60,
    width: "100%",
  },
  hello_txt: {
    color: "#51ab1d",
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },
  childcontainer: {
    height: "128%",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    backgroundColor: "white",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 30,
  },
  home_txt: {
    fontSize: 20,
    marginTop: 50,
    fontWeight: "bold",
    alignSelf: "center",
  },
  name_View: {
    margin: "10%",
  },
  backStyle: {
    paddingTop: "8%",
    paddingLeft: "6%",
  },
  headerTitle: {
    paddingLeft: "35%",
    paddingTop: "10%",
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
    paddingBottom: "2.2%",
  },
  Profile_img: {
    width: "100%",
    marginTop: 15,
    alignContent: "center",
    alignItems: "center",
  },
  Driver_Data: {
    marginTop: 15,
    width: "60%",
  },
  header: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
  },
  alignright: {
    marginTop: 5,
    paddingLeft: 110,
  },
  shadowSet: {
    height: "100%",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 20,
  },
  h1: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
  detailtxt: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "gray",
  },
});

export default Profile_Styles;
