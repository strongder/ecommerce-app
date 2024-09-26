import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { orders } from "../data";
import OrderItem from "../components/OrderItem";
const OrderHistoryScreen = ({ navigation }: any) => {
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const filteredOrders =
    selectedStatus === "ALL"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        {["ALL", "PENDING", "SHIPPING", "COMPLETED", "CANCELLED"].map(
          (status) => (
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
          )
        )}
      </View>
      <FlatList
        data={filteredOrders}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("OrderDetail", { order: item })}
          >
            <OrderItem item={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  topbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  topbarItem: {
    paddingVertical: 10,
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
