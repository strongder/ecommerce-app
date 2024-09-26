import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const OrderDetailScreen = ({ route }: any) => {
  const { order } = route.params;

  const cancelOrder = () => {
    // Logic hủy đơn hàng
    console.log(`Hủy đơn hàng: ${order.orderCode}`);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Chi tiết đơn hàng</Text>
        <Text>Mã đơn hàng: {order.orderCode}</Text>
        <Text>Phương thức thanh toán: {order.paymentMethod}</Text>
        <Text>Trạng thái: {order.status}</Text>
        <Text>Tổng tiền: {order.total.toLocaleString()} VNĐ</Text>
        <Text>Ngày tạo: {new Date(order.createdAt).toLocaleString()}</Text>

        <Text style={styles.subtitle}>Địa chỉ giao hàng:</Text>
        <Text>{order.address.recipientName}</Text>
        <Text>{order.address.phone}</Text>
        <Text>
          {order.address.addressDetail}, {order.address.ward},{" "}
          {order.address.district}, {order.address.city}
        </Text>

        <Text style={styles.subtitle}>Sản phẩm:</Text>
        {order.orderItems.map((item: any) => (
          <View key={item.id} style={styles.productItem}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text>Tên sản phẩm: {item.name}</Text>
              <Text>Giá: {item.price.toLocaleString()} VNĐ</Text>
              <Text>Số lượng: {item.quantity}</Text>
              <Text>Kích thước: {item.varProduct.attribute.size}</Text>
              <Text>Màu sắc: {item.varProduct.attribute.color}</Text>
            </View>
          </View>
        ))}

        {order.status === "PENDING" && (
          <>
            <TouchableOpacity style={styles.buttonAction}>
              <Text style={styles.buttonText}>Đổi phương thức thanh toán</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonAction}>
              <Text style={styles.buttonText}>Hủy đơn hàng</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      {order.paymentMethod === "VNPAY" && order.status === "PENDING" && (
        <Button title="Thanh toán"></Button>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
  },
  productItem: {
    flexDirection: "row",
    marginBottom: 20, // Tăng khoảng cách giữa các sản phẩm
    padding: 12, // Tăng padding cho sản phẩm
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  productImage: {
    width: 90, // Tăng kích thước ảnh
    height: 90, // Tăng kích thước ảnh
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  buttonAction: {
    backgroundColor: "transparent", // Màu nền button
    paddingVertical: 10, // Khoảng cách trên dưới
    paddingHorizontal: 20, // Khoảng cách hai bên
    marginBottom: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText:{
    fontSize: 18,
    fontWeight: "600",
  }
});

export default OrderDetailScreen;
