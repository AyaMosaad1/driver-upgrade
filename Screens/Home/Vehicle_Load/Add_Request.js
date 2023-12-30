import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { CommonActions, useNavigation } from "@react-navigation/native";
import ApiController from "../../../Api/ApiController";
import OwnStorage from "../../../Api/StorageController";
import GlobalStyles from "../../../Utils/GlobalStyles";
import GlobalColors from "../../../Utils/GlobalColors";
import Toast from "react-native-root-toast";
import AddRequest_styles from "./AddRequest_styles";
import {
  RecycleItemDetail,
  RR_Customer_id,
} from "../../../Redux/Reducers/Recycle_Request_Info";
import { useDispatch } from "react-redux";
import strings from "../../../constants/lng/LocalizedStrings";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Add_Request = () => {
  var api = new ApiController();
  var localdata = new OwnStorage();
  var dispatch = useDispatch();
  const [lang, setLang] = useState("en");

  const [Products, setproducts] = useState([]);
  const [showItem, setShowItem] = useState(false);
  const [noproduct, setnoproduct] = useState(false);

  const [value, setvalue] = useState();
  const [itemSelected, setItemSelected] = useState(null);
  const [pickItems, setPickItems] = useState("");
  const [items, setitems] = useState([
    {
      img: "https://api.shorex.green/storage/2/conversions/quadra-thumbnail.jpg",
      product_id: 0,
      wtqt: "45",
    },
  ]);
  const [Customer_id, setCustomer_id] = useState("");

  const navigation = useNavigation();

  const onPressHandler = (myId) => {
    setShowItem(true);

    setItemSelected(myId);
  };

  useEffect(async () => {
    var token = await localdata.getvalue("api_token_Driver");
    // const lngData = await AsyncStorage.getItem("language");
    const lngData = 'en';
    console.log("langg", lngData);
    setLang(lngData);
    await getproducts(token);
  }, [1]);
  const getproducts = async (token) => {
    api
      .getproductitems(token)
      .then((res) => {
        if (res.data.Message !== undefined) {
        } else {
          console.log("response_products", res.data.data);

          if (res.data.data) {
            setnoproduct(true);
          }

          setproducts(res.data.data);
        }
      })
      .catch((error) => {
        console.log("error in Add Request Items:", error);
        if (error.response.status == 401) {
          Toast.show("You are Blocked by the Admin");
          navigation.navigate("Login");
        }
      });
  };

  const Productcard = (item) => {
    return (
      <View key={item.id}>
        <TouchableOpacity
          onPress={() => onPressHandler(item.id)}
          style={{ paddingLeft: "4%" }}
        >
          <View
            style={{
              flexDirection: "row",
              borderWidth: 0.8,
              borderColor: "#E4E9F3",
              backgroundColor: item.id === itemSelected ? "#FFE713" : "#E4E9F3",
              borderRadius: 5,
              marginTop: "2%",
              height: 65,
              width: "95%",
              alignItems: "center",
            }}
          >
            <Image
              style={{ marginLeft: "10%", height: 33, width: 33 }}
              source={{ uri: item.product_img.thumbnail }}
            />
            <Text style={AddRequest_styles.innerText}>
              {lang == "es" ? item.title_fr : item.title}
            </Text>
          </View>
        </TouchableOpacity>
        {item.id === itemSelected ? (
          <View>
            <Text style={AddRequest_styles.label}>
              {lang == "es" ? item.questions_fr : item.questions}
            </Text>
            <TextInput
              placeholder={strings.WTQTTEXT}
              style={{
                paddingLeft: 10,
                borderColor: "#E4E9F3",
                height: 45,
                marginHorizontal: "5%",
                borderWidth: 1.0,

                borderRadius: 3,
              }}
              keyboardType={"numeric"}
              onChangeText={(pickItems) => {
                item["value"] = { pickItems };
                setvalue(pickItems);

                // numbers = [...numbers, pickItems];
              }}
              onEndEditing={(pickItems) => {
                if (item.value == undefined) {
                } else {
                  if (
                    item.value.pickItems.toString() == undefined ||
                    item.value.pickItems.toString() == ""
                  ) {
                  } else {
                    let newArr = [...items];
                    newArr[item.id] = {
                      ...newArr[item.id],
                      product_id: item.id,
                      wtqt: item.value.pickItems.toString(),
                      img: item.product_img.thumbnail,
                    };
                    setitems(newArr);
                    console.log("valllll", items);
                  }
                }
              }}
              defaultValue={
                item.value == undefined ? null : item.value.pickItems.toString()
              }
            />
          </View>
        ) : null}
      </View>
    );
  };
  if (Products == "" || Products == undefined) {
    return (
      <View style={AddRequest_styles.container}>
        <View style={AddRequest_styles.header}>
          <TouchableOpacity
            style={AddRequest_styles.backStyle}
            onPress={() => {
              const resetAction = CommonActions.reset({
                index: 0,
                routes: [{ name: "PickupReq" }],
              });
              navigation.dispatch(resetAction);
            }}
          >
            <Image
              style={{ height: 16.97, width: 10.61 }}
              source={require("../../../assets/back.png")}
            />
          </TouchableOpacity>
          <Text style={AddRequest_styles.headerTitle}>
            {strings.ADDREQUEST}
          </Text>
          <View style={{ width: 30, height: 30 }} />
        </View>
        <View style={GlobalStyles.cardview}>
          <View
            style={[
              GlobalStyles.cardview,
              { backgroundColor: "white", justifyContent: "center" },
            ]}
          >
            {noproduct ? (
              <Text
                style={[AddRequest_styles.headerTitle, { textAlign: "center" }]}
              >
                {strings.NOPRODUCT}
              </Text>
            ) : (
              <ActivityIndicator
                style={{ flex: 1, alignSelf: "center" }}
                size="large"
                color={GlobalColors.Green}
              ></ActivityIndicator>
            )}
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: GlobalColors.Yellow,
        }}
      >
        <View style={AddRequest_styles.container}>
          <View style={AddRequest_styles.header}>
            <TouchableOpacity
              style={AddRequest_styles.backStyle}
              onPress={() => {
                const resetAction = CommonActions.reset({
                  index: 0,
                  routes: [{ name: "PickupReq" }],
                });
                navigation.dispatch(resetAction);
              }}
            >
              <Image
                style={{ height: 16.97, width: 10.61 }}
                source={require("../../../assets/back.png")}
              />
            </TouchableOpacity>
            <Text style={AddRequest_styles.headerTitle}>
              <View style={{ width: 30, height: 30 }} />
              {strings.ADDREQUEST}
            </Text>
            <View style={{ width: 30, height: 30 }} />
          </View>
          <View style={GlobalStyles.cardview}>
            <View
              style={[
                GlobalStyles.cardview,
                { backgroundColor: "white", marginTop: 10, height: 700 },
              ]}
            >
              <View style={AddRequest_styles.dataContainer}>
                <Text style={AddRequest_styles.containerText}>
                  {strings.CUSTOMER} ID
                </Text>
                <TextInput
                  placeholder={strings.PLEASEENTERCUSID}
                  placeholderTextColor={"gray"}
                  style={AddRequest_styles.Notes}
                  onChangeText={(Text) => {
                    setCustomer_id(Text);
                  }}
                ></TextInput>
                <Text style={AddRequest_styles.containerText}>
                  {strings.CHOOSERECYCLEITEM}
                </Text>
              </View>
              <ScrollView style={{ height: "90%" }}>
                <View>
                  {Products.map(Productcard)}
                  <TouchableOpacity
                    style={AddRequest_styles.btn_next}
                    onPress={() => {
                      if (Customer_id == "") {
                        Toast.show("Customer id cannot be empty");
                      } else {
                        if (items.length <= 1) {
                          Toast.show(strings.SELECTITEM);
                        } else {
                          // Toast.show(items.length);
                          console.log(items);
                          navigation.navigate("Mark_Shedule");
                          dispatch(RecycleItemDetail(items));
                          dispatch(RR_Customer_id(Customer_id));
                        }
                      }
                    }}
                  >
                    <Text style={AddRequest_styles.btn_txt}>
                      {strings.NEXT}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
        <Text style={{ marginTop: 100 }}></Text>
      </View>
    );
  }
};

export default Add_Request;
