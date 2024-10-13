// screens/CheckoutScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { userAddresses } from "../data";
import AddressItem from "../components/AddressItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchDefaultAddress } from "../redux/AddressSlice";
import { asyncThunkCreator, current } from "@reduxjs/toolkit";
import { placeOrder } from "../redux/OrderSlice";
import axiosInstance from "../api";
import { fetchCart } from "../redux/CartSlice";
import { createPayment } from "../redux/PaymentSlice";

const CheckoutScreen = ({ navigation, route }: any) => {
  const { cart } = route.params;
  console.log(cart);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [total, setTotal] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(cart.total);
  const [shippingFee, setShippingFee] = useState<number>(30000);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.users.currentUser);

  const defaultAddress = useSelector(
    (state: any) => state.addresses.defaultAddress
  );
  useEffect(() => {
    setTotal(subtotal + shippingFee);
  }, [subtotal]);
  useEffect(() => {
    dispatch(fetchDefaultAddress());
  }, [dispatch]);

  const handleCheckout = async () => {
    if(!defaultAddress){
      Alert.alert("Thông báo", "Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    const data = {
      userId: currentUser?.id,
      addressId: defaultAddress?.id,
      paymentMethod: paymentMethod,
    };
    console.log(defaultAddress);
    
    const action = await dispatch(placeOrder({ data, param: {total}  }));
    if (placeOrder.fulfilled.match(action)) {
      const orderId = action.payload.id; // Assuming the orderId is in the payload
      if (paymentMethod === "COD") {
        navigation.navigate("OrderHistory");
      } else if (paymentMethod === "VNPAY") {
        handleVnpayPayment(orderId); // Pass the orderId to the payment function
      }
    }
    dispatch(fetchCart(currentUser.id));
  };

  const handleVnpayPayment: any = async (orderId: number) => {
    // Tạo dữ liệu thanh toán với orderId
    const data = {
      orderId: orderId,
      redirectUrl: "", // Bạn có thể thêm URL để điều hướng sau khi thanh toán hoàn tất
    };
    const payment = await dispatch(createPayment(data)).unwrap();
    if (payment && payment.paymentUrl) {
      navigation.navigate("VnpayPayment", { paymentUrl: payment.paymentUrl });
    }
  };

  const handleSelectAddress = () => {
    navigation.navigate("Address");
  };
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          <Pressable
            style={{ paddingHorizontal: 20 }}
            onPress={handleSelectAddress}
          >
            {defaultAddress ? (
              <AddressItem item={defaultAddress} />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  paddingVertical: 5,
                }}
              >
                Chọn địa chỉ
              </Text>
            )}
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <Picker
            selectedValue={paymentMethod}
            onValueChange={(itemValue) => setPaymentMethod(itemValue)}
          >
            <Picker.Item label="Thanh toán khi nhận hàng (COD)" value="COD" />
            <Picker.Item label="Ví điện tử (VNPay)" value="VNPAY" />
          </Picker>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi phí</Text>
          <Text style={{ paddingHorizontal: 20 }}>
            Đơn hàng: {subtotal.toLocaleString("vi-VN")} VNĐ
          </Text>
          <Text style={{ paddingHorizontal: 20 }}>
            Phí vận chuyển: {shippingFee.toLocaleString("vi-VN")} VNĐ
          </Text>
          <Text style={styles.totalText}>
            Tổng cộng: {total.toLocaleString("vi-VN")} VNĐ
          </Text>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Xác nhận đặt hàng</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    position: "relative", // Thêm dòng này nếu dùng Absolute Positioning
  },
  scrollContainer: {
    paddingBottom: 80, // Để tránh nội dung bị che khuất bởi nút
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  section: {
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  totalText: {
    fontSize: 20,
    color: "red",
    fontWeight: "bold",
    marginTop: 8,
  },
  checkoutButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CheckoutScreen;
