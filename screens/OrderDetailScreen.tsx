import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { cancelOrder, fetchOrderById } from "../redux/OrderSlice";

const OrderDetailScreen = ({ navigation, route }: any) => {
  const { orderId } = route.params;
  const dispatch = useDispatch();
  const order = useSelector((state: any) => state.orders.order);

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
  }, [dispatch]);

  const handleCancelOrder = () => {
    dispatch(cancelOrder(orderId));
  };

  return (
    <View style={styles.container}>
      {order !== null && (
        <>
          <ScrollView style={styles.scrollContainer}>
            <Text style={styles.title}>Chi tiết đơn hàng</Text>
            <Text style={styles.text}>Mã đơn hàng: {order.orderCode}</Text>
            <Text style={styles.text}>
              Phương thức thanh toán: {order.paymentMethod}
            </Text>
            <Text style={styles.text}>Trạng thái: {order.status}</Text>
            <Text style={styles.text}>
              Tổng tiền: {order?.total?.toLocaleString()} VNĐ
            </Text>
            <Text style={styles.text}>
              Ngày tạo: {new Date(order?.createdAt)?.toLocaleString()}
            </Text>

            <Text style={styles.subtitle}>Địa chỉ giao hàng</Text>
            <Text style={styles.text}>
              Người nhận: {order?.address?.recipientName}
            </Text>
            <Text style={styles.text}>Điện thoại: {order.address?.phone}</Text>
            <Text style={styles.text}>
              Địa chỉ: {order.address?.addressDetail}, {order.address?.ward},{" "}
              {order.address?.district}, {order.address?.city}
            </Text>

            <Text style={styles.subtitle}>Sản phẩm</Text>
            {order?.orderItems?.map((item: any) => (
              <View key={item.id} style={styles.productItem}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.text}>Tên sản phẩm: {item.name}</Text>
                  <Text style={styles.text}>
                    Giá: {item?.price?.toLocaleString("vi-VI")} VNĐ
                  </Text>
                  <Text style={styles.text}>Số lượng: {item.quantity}</Text>
                  <Text style={styles.text}>
                    Phân loại:{" "}
                    {Object.values(item.varProduct.attribute).join(",")}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.actionsContainer}>
            {order.status === "PENDING" && (
              <>
                <TouchableOpacity style={styles.buttonAction}>
                  <Text style={styles.buttonText}>
                    Đổi phương thức thanh toán
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonAction}
                  onPress={handleCancelOrder}
                >
                  <Text style={styles.buttonText}>Hủy đơn hàng</Text>
                </TouchableOpacity>
              </>
            )}

            {order.paymentMethod === "VNPAY" &&
              order.status === "PENDING PAYMENT" && (
                <TouchableOpacity style={styles.payment}>
                  <Text style={styles.buttonText}>Thanh toán ngay</Text>
                </TouchableOpacity>
              )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 16,
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 3,
    paddingHorizontal: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
  },
  productItem: {
    flexDirection: "row",
    marginBottom: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  productImage: {
    width: 90,
    height: 90,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },

  // Hành động đặt dưới cùng nhưng không cố định vị trí
  actionsContainer: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  buttonAction: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  payment: {
    backgroundColor: "orange",
    paddingVertical: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrderDetailScreen;
