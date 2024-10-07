import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import OrderItem from "../components/OrderItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderByUser } from "../redux/OrderSlice";

const OrderHistoryScreen = ({ navigation }: any) => {
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const dispatch = useDispatch();
  const orders = useSelector((state: any) => state.orders.listOrderByUser) || []; // Ensure it's an array
  const currentUser = useSelector((state: any) => state.users.currentUser);

  useEffect(() => {
    if (currentUser?.id) {
      
      dispatch(fetchOrderByUser(currentUser.id));
    }
  }, [dispatch, currentUser]);

  const filteredOrders =
    selectedStatus === "ALL"
      ? orders.filter((order: any) => order) // Filter out undefined items
      : orders.filter((order: any) => order?.status === selectedStatus);

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.topbar}>
          {[
            "ALL",
            "PENDING",
            "PENDING PAYMENT",
            "PROCESSING",
            "COMPLETED",
            "CANCELLED",
            "PAID",
          ].map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setSelectedStatus(status)}
              style={styles.topbarItem}
            >
              <Text
                style={
                  selectedStatus === status
                    ? styles.activeText
                    : styles.inactiveText
                }
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {filteredOrders.length > 0 && (
        <FlatList
          data={filteredOrders}
          renderItem={({ item }) => {
            if (!item || !item.id) return null; // Check if item is valid
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("OrderDetail", { orderId: item.id })
                }
              >
                <OrderItem item={item} />
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => (item && item.id ? item.id.toString() : Math.random().toString())} // Fallback key
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    padding: 16,
    paddingBottom: 60
  },
  topbar: {
    flexDirection: "row",
    paddingBottom: 10,
  },
  topbarItem: {
    paddingVertical: 10,
    paddingHorizontal: 15, // Thêm khoảng cách giữa các nút
  },
  activeText: {
    fontWeight: "bold",
    color: "blue",
  },
  inactiveText: {
    color: "black",
  },
  orderItem: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
});

export default OrderHistoryScreen;
