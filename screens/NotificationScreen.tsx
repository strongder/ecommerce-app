import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axiosInstance, { configAxios } from "../api";
import useSocket from "../hook/useSocket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../redux/NotiffiSlice";

const NotificationScreen = ({ navigation, notifications }: any) => {
  // const [notifications, setNotifications] = React.useState([]);
  const dispatch = useDispatch();

  const handleNotificationPress = (type: any) => {
    // Navigate to the respective screen based on notification type
    navigation.navigate(type === "order" ? "OrderDetail" : "PromotionDetail");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông báo</Text>
      {notifications && (
        <FlatList
          data={notifications}
          keyExtractor={(item: any) => item?.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleNotificationPress(item.type)}
              style={styles.notificationItem}
            >
              <Text style={styles.notificationText}>{item.message}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  notificationItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  notificationText: {
    fontSize: 16,
  },
});

export default NotificationScreen;
