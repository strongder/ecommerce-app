import { View, Text, Image, StyleSheet, FlatList } from "react-native";

const OrderItem = ({ item }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.status}>Trạng thái: {item.status}</Text>
      <FlatList
        style={styles.list}
        data={item.orderItems}
        renderItem={({ item }: any) => (
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.quantity}>Số lượng: {item.quantity}</Text>
              <Text style={styles.price}>Đơn giá: {item.price} VNĐ</Text>
            </View>
          </View>
        )}
      />
      <Text style={styles.totalPrice}>Tổng giá: {item.total} VNĐ</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  list: {
    width: "100%",
    gap:20
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 16,
    color: "#000",
  },
  price: {
    fontSize: 14,
    color: "#000",
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e91e63",
    marginTop: 10,
  },
  status: {
    fontSize: 15,
    color: "#4caf50",
    fontWeight: "bold",
    marginBottom: 10,
  },
});
export default OrderItem;
