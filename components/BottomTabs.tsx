import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NotificationScreen from "../screens/NotificationScreen";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../redux/CartSlice";
import { fetchNotifications } from "../redux/NotiffiSlice";
import useSocket from "../hook/useSocket";
import AsyncStorage from "@react-native-async-storage/async-storage";
const BottomTabs = () => {
  const Tab = createBottomTabNavigator();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.users.currentUser);
  const listNotification = useSelector((state: any) => state.notifications.notifications);
  const [notifications, setNotifications] = useState<any>([]);
  const token =  AsyncStorage.getItem("token")+"" ;
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchCart(currentUser.id));
      dispatch(fetchNotifications(currentUser.id));
    }
  }, [currentUser, dispatch]);
  useEffect(() => {
    if (listNotification) {
      setNotifications(listNotification);
    }
  }, [listNotification]);
  const handleNotification = (data: any) => {
    console.log("data", data);
    setNotifications((prev: any)=>[data, ...prev]);
  }
  const connected = useSocket(`/queue/notification/${currentUser.id}`, token, handleNotification);
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="home" size={24} color="008E97" />
            ) : (
              <AntDesign name="home" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="person" size={24} color="008E97" />
            ) : (
              <Ionicons name="person-outline" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Notification"
        options={{
          tabBarLabel: "Notification",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="notifications" size={24} color="black" />
            ) : (
              <Ionicons name="notifications-outline" size={24} color="black" />
            ),

        }}
        children={() => <NotificationScreen notifications={notifications} />}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: "Cart",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <AntDesign name="shoppingcart" size={24} color="008E97" />
            ) : (
              <AntDesign name="shoppingcart" size={24} color="black" />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({});
