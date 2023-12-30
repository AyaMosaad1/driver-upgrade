import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
export default function History_Card({
  Name,
  Datelabel,
  Quantity,
  Item_Name,
  Addresslabel,
  Statuslabel,
  item_res,
}) {
  const navigation = useNavigation();
  ////////asim...

  const renderItems_wt = (item, i) => {
    return (
      <View key={i} style={styles.innerContainer}>
        <Text style={styles.text1}>{item.title}</Text>
        {<Text style={styles.text1}>{item.wtqt}</Text>}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Pickup_History_Detail", {
            item_res: item_res,
          });
        }}
      >
        <View style={styles.innerContainerMain}>
          {<Text style={styles.hidingH1}>{Name}</Text>}

          {Item_Name.map(renderItems_wt)}

          {
            <Text
              style={{
                paddingTop: "4%",
                color: "#6E6E6E",
                fontSize: 14,
                fontFamily: "Poppins_500Medium",
              }}
            >
              {Datelabel}
            </Text>
          }

          <View style={styles.innerContainerAddress}>
            {
              <Image
                style={{ marginRight: "3%", height: 24, width: 24 }}
                source={require("../../assets/location.png")}
              ></Image>
            }
            {
              <Text
                style={{
                  color: "#6E6E6E",
                  fontSize: 14,
                  fontFamily: "Poppins_500Medium",
                  width: "90%",
                }}
              >
                {Addresslabel}
              </Text>
            }
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 0.45,
    backgroundColor: "#FFFFFF",
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 6,
    borderColor: "#E4E9F3",
    borderWidth: 0.5,
    borderBottomColor: "transparent",
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
});
