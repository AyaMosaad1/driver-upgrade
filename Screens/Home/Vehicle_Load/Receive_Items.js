import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { CommonActions, useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Api from "../../../Api/Api";
import ApiController from "../../../Api/ApiController";
import OwnStorage from "../../../Api/StorageController";
import GlobalColors from "../../../Utils/GlobalColors";
import Toast from "react-native-root-toast";
import GlobalStyles from "../../../Utils/GlobalStyles";
import Header_Global from "../../../Components/Header_Global";
import SelectDropdown from "react-native-select-dropdown";
import strings from "../../../constants/lng/LocalizedStrings";
import { useDispatch } from "react-redux";
import { RecycleLocations } from "../../../Redux/Reducers/Recycle_Request_Info";

export default function Receive_Items({ route }) {
  const dispatch = useDispatch();

  const { RR_id } = route.params;
  const [comments, setcomments] = useState("");
  const [customerstaffName, setcustomerstaffName] = useState("");
  const [showloaderM, setshowloaderM] = useState(false);

  var api = new ApiController();
  var localdata = new OwnStorage();
  const [Products, setproducts] = useState([]);
  const [Response, Setresponse] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const Units = [strings.KG, strings.Unit];
  const navigation = useNavigation();
  const [pickedImagePath, setPickedImagePath] = useState("");
  const [pickedImage, setPickedImage] = useState("");

  const showImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      const newfile = {
        uri: result.uri,
        name: result.uri.split("/").pop(),
        type: "image/jpg",
      };

      setPickedImagePath(result.uri.split("/").pop());
      setPickedImage(newfile);
      console.log(result.uri);
    }
  };

  // This function is triggered when the "Open camera" button pressed
  useEffect(async () => {
    console.log("request id", RR_id);
    await getproducts();
  }, [RR_id]);
  const getproducts = async () => {
    let path = "recycles/" + RR_id + "";

    Api.request("get", path)
      .then((response) => {
        console.log("RR Response", response.data.products);
        Setresponse(response.data);

        setproducts(response.data.products);
        setcustomerstaffName(response.data.customer.first_name);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          Toast.show("You are Blocked by the Admin");
          navigation.navigate("Login");
        }
        console.log("error", error);
        for (const [key, value] of Object.entries(error.response.data.errors)) {
          console.log(`${key}: ${value}`);
          Toast.show(`${key}: ${value}`);
        }
      });
  };

  const presshandler = () => {
    Keyboard.dismiss();
  };
  const Submit = async () => {
    setshowloaderM(true);
    var token = await localdata.getvalue("api_token_Driver");

    const finalVal = { products: Products };
    const formdata = new FormData();

    finalVal["products"].forEach((value, i) => {
      formdata.append("products[" + i + "][product_id]", value.id);
      formdata.append("products[" + i + "][wtqt]", value.wtqt);
      if (value.unit == "" || value.unit == undefined) {
        setshowloaderM(false);

        Toast.show("Please Add Unit");
      } else {
        formdata.append("products[" + i + "][unit]", value.unit);
        formdata.append("driver_comments", comments);
        formdata.append("delivered_by", customerstaffName);
        formdata.append("img_receive", pickedImage);
        formdata.append("_method", "PATCH");

        console.log("data to send", formdata);
        let path = "recycles/" + RR_id + "/receive";

        api
          .ReceiveItems(token, path, formdata)
          .then((response) => {
            console.log("updated response status", response);
            dispatch(RecycleLocations([]));

            setshowloaderM(false);
            const resetAction = CommonActions.reset({
              index: 0,
              routes: [{ name: "PickupReq" }],
            });
            navigation.dispatch(resetAction);
            Toast.show("Request marked as Received");
          })
          .catch((error) => {
            setshowloaderM(false);
            if (error.response.status == 401) {
              Toast.show("You are Blocked by the Admin");
              navigation.navigate("Login");
            }
            Toast.show(error.response.data.message);
          });
      }
    });
  };
  const renderitem = (item, i) => {
    return (
      <View key={i}>
        <Text style={styles.Heading}>{item.title}</Text>
        <TextInput
          style={styles.Notes}
          keyboardType="number-pad"
          onChangeText={(Text) => {
            let data = [...Products];
            data[i].wtqt = Text;
          }}
        >
          {item.wtqt}
        </TextInput>
        <Text style={styles.Heading}>{strings.UNITS}</Text>

        <SelectDropdown
          buttonStyle={styles.Units}
          buttonTextStyle={{ fontSize: 16 }}
          data={Units}
          onSelect={(selectedItem, index) => {
            let data = [...Products];
            data[i].unit = selectedItem;
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item;
          }}
        />
      </View>
    );
  };
  if (Products == "" || Products == undefined) {
    return (
      <View
        style={[
          styles.container,
          {
            // Try setting `flexDirection` to `"row"`.
            flexDirection: "column",
          },
        ]}
      >
        <Header_Global
          Title={strings.RECEIVEITEMS}
          BackIcon={true}
          Onpress={() => {
            navigation.navigate("Customers_Location");
          }}
        />
        <TouchableWithoutFeedback onPress={() => presshandler()}>
          <View style={GlobalStyles.cardview}>
            <View
              style={[
                GlobalStyles.cardview,
                { backgroundColor: "white", paddingTop: "15%" },
              ]}
            >
              <ActivityIndicator
                style={{ flex: 1 }}
                size="large"
                color={GlobalColors.Green}
              ></ActivityIndicator>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  } else {
    return (
      <ScrollView style={{ backgroundColor: GlobalColors.Yellow }}>
        <View style={{ marginTop: "10%" }}>
          <Header_Global
            Title={strings.RECEIVEITEMS}
            BackIcon={true}
            Onpress={() => {
              navigation.navigate("Customers_Location");
            }}
          />
          <View style={{ height: "2%" }}></View>
          <TouchableWithoutFeedback onPress={() => presshandler()}>
            <View
              style={{
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                shadowColor: "black",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 2,
                elevation: 20,
              }}
            >
              <View
                style={[
                  {
                    backgroundColor: "white",
                    paddingTop: "10%",
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    shadowColor: "black",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 2,
                    elevation: 20,
                  },
                ]}
              >
                <View style={styles.View_False}>
                  <Text style={styles.txtheading}>
                    {strings.RECEIVEDQUANTITY}
                  </Text>
                  {Products.map(renderitem)}
                  <Text style={styles.Heading}>{strings.DRIVERSCOMMENT}</Text>
                  <TextInput
                    textAlignVertical="top"
                    multiline={true}
                    placeholder={strings.THISISDUMMYTXT}
                    style={styles.Driver_Comments}
                    onChangeText={(Text) => {
                      setcomments(Text);
                    }}
                  ></TextInput>

                  <Text style={styles.Heading}>{strings.UPLOADIMG}</Text>

                  <View style={styles.Notes}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.Heading}>{pickedImagePath}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          showImagePicker();
                        }}
                      >
                        <Image
                          source={require("../../../assets/uploadimg.png")}
                        ></Image>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.Heading}>{strings.DeliveredBy}</Text>
                  <TextInput
                    style={styles.Notes}
                    editable={false}
                    onChangeText={(Text) => {
                      setcustomerstaffName(Text);
                    }}
                  >
                    {customerstaffName}
                  </TextInput>

                  <View style={styles.ButtonView}>
                    <TouchableOpacity
                      style={styles.Button}
                      onPress={() => {
                        Submit();
                      }}
                    >
                      <View style={[GlobalStyles.FlexDirectionRow]}>
                        {showloaderM && (
                          <ActivityIndicator
                            size="small"
                            color="white"
                            style={[GlobalStyles.activityIndicator]}
                          ></ActivityIndicator>
                        )}
                        <Text style={GlobalStyles.ButtonTextMain}>
                          {strings.SUBMIT}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ marginTop: 50 }}></View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE713",
  },
  txtheading: {
    color: GlobalColors.Green,
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    paddingBottom: "2%",
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
  ButtonTxt: {
    color: "white",
    fontSize: 17,
    fontFamily: "Poppins_500Medium",
  },
  Heading: {
    color: "black",
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    marginTop: "2%",
  },
  ButtonView: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "3%",
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

  View_False: {
    marginRight: "5%",
    marginLeft: "5%",
    marginTop: "0%",
    marginBottom: "5%",
  },
  Notes: {
    borderWidth: 0.8,
    padding: 5,
    borderColor: "#E4E9F3",
    borderRadius: 6,
    backgroundColor: "white",
    marginTop: "2%",
    height: 43,
    width: "100%",
  },
  Units: {
    borderWidth: 0.8,
    padding: 5,
    borderColor: "#E4E9F3",
    borderRadius: 6,
    backgroundColor: "white",
    marginTop: "2%",
    height: 43,
    width: "30%",
  },
  Driver_Comments: {
    borderWidth: 0.8,
    padding: 5,
    borderColor: "#E4E9F3",
    borderRadius: 6,
    backgroundColor: "white",
    marginTop: "2%",
    height: 83,
  },
});
