import { useState, useEffect, useLayoutEffect } from "react";
import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "../Screens/Login_Screen/Login_Screen";
import PickupReq from "../Screens/Home/Pickup_Requests/PickupReq/PickupReq";
import Pickup_History from "../Screens/Home/Pickup_History/Pickup_History";
import VehicleLoad from "../Screens/Home/Vehicle_Load/VehicleLoad/VehicleLoad";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Setting from "../Screens/settings/settings";
import Profile from "../Screens/settings/Settings_Screens/Profile/Profile";
import Notifications from "../Screens/Notifications/Notifications";
import { CustomTabBar } from "../Components/CustomTabBar";
import CustomSidebarMenu from "../Components/CustomSidebarMenu";
import Edit_Profile from "../Screens/settings/Settings_Screens/Edit_Profile/Edit_Profile";
import Vehicle_Load_Details from "../Screens/Home/Vehicle_Load/Vehicle_Load_Details/Vehicle_Load_Details";
import Warehouse_Location from "../Screens/Home/Vehicle_Load/Warehouse_Location/Warehouse_Location";
import Route_Start from "../Screens/Home/Vehicle_Load/Route_Start/Route_Start";
import False_Request from "../Screens/Home/Vehicle_Load/False_Request";
import Add_Request from "../Screens/Home/Vehicle_Load/Add_Request";
import Mark_Shedule from "../Screens/Home/Vehicle_Load/Mark_Shedule";
import Receive_Items from "../Screens/Home/Vehicle_Load/Receive_Items";
import Change_Password from "../Screens/settings/Settings_Screens/Change_Password/Change_Password";
import Privacy_Policy from "../Screens/settings/Settings_Screens/Privacy_Policy/Privacy_Policy";
import Terms_Conditions from "../Screens/settings/Settings_Screens/Terms_Conditions/Terms_Conditions";
import Home from "../Screens/Home/Home_Screen/Home_Screen";
import Pickup_History_Detail from "../Screens/Home/Pickup_History/Pickup_History_Detail";
import { useDispatch, useSelector } from "react-redux";
import OwnStorage from "../Api/StorageController";
import { connect } from "react-redux";
import Locationpicker from "../Screens/Home/Vehicle_Load/locationpicker";
import Forgot_Password from "../Screens/Forgot_Password/Forgot_Password";
import Customers_Location from "../Screens/Home/Pickup_Requests/PickupReq/Customers_Location/Customers_Location";
import Transfer_Route from "../Screens/Home/Transfer_Request/Transfer_Request";
import Transfer_Request_Submitt from "../Screens/Home/Transfer_Request/Transfer_Request_Submitt";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function Home_StackNavigation() {
  return (
    //////////////Main..Screen..../////////////////////////
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="DrawerMenu"
        screenOptions={{ headerShown: false, gestureEnabled: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="DrawerMenu" component={DrawerMenu} />
        <Stack.Screen name="Change_Password" component={Change_Password} />
        <Stack.Screen name="Privacy_Policy" component={Privacy_Policy} />
        <Stack.Screen name="Edit_Profile" component={Edit_Profile} />
        <Stack.Screen name="Forgot_Password" component={Forgot_Password} />

        <Stack.Screen name="Terms_Conditions" component={Terms_Conditions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export const DrawerMenu = ({ navigation, route }) => {
  return (
    <Drawer.Navigator
      initialRouteName="BottomTabNavigation"
      drawerContent={(props) => <CustomSidebarMenu {...props} />}
      screenOptions={{
        drawerType: "front",
        headerShown: false,
        swipeEdgeWidth: 0,
        drawerStyle: {
          width: "70%",
          borderBottomRightRadius: 12,
          borderTopRightRadius: 12,
        },
        overlayColor: "rgba(0,0,0,.5)",
      }}
    >
      <Drawer.Screen
        name="BottomTabNavigation"
        component={BottomTabNavigation}
        options={{
          drawerItemStyle: {
            display: "none",
          },
        }}
      />
    </Drawer.Navigator>
  );
};

export const BottomTabNavigation = ({ navigation, route }) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: false,
        gestureEnabled: false,
        tabBarStyle: { border: "none" },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Notifications" component={Notifications} />
      <Tab.Screen name="Setting" component={Setting} />
      <Tab.Screen name="PickupReq" component={PickupReq} />
      <Tab.Screen name="Pickup_History" component={Pickup_History} />
      <Tab.Screen
        name="Pickup_History_Detail"
        component={Pickup_History_Detail}
      />

      <Tab.Screen name="VehicleLoad" component={VehicleLoad} />
      <Tab.Screen name="Profile" component={Profile} />

      <Tab.Screen
        name="Vehicle_Load_Details"
        component={Vehicle_Load_Details}
      />
      <Tab.Screen name="Warehouse_Location" component={Warehouse_Location} />
      <Tab.Screen name="Customers_Location" component={Customers_Location} />

      <Tab.Screen name="Route_Start" component={Route_Start} />
      <Tab.Screen name="False_Request" component={False_Request} />
      <Tab.Screen name="Add_Request" component={Add_Request} />
      <Tab.Screen name="Mark_Shedule" component={Mark_Shedule} />
      <Tab.Screen name="Receive_Items" component={Receive_Items} />
      <Tab.Screen name="locationpicker" component={Locationpicker} />
      <Tab.Screen name="Transfer_Request" component={Transfer_Route} />
      <Tab.Screen
        name="Transfer_Request_Submitt"
        component={Transfer_Request_Submitt}
      />
    </Tab.Navigator>
  );
};

export default Home_StackNavigation;
