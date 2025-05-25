import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
  TextInput,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { fetchDefaultAddress } from "../redux/AddressSlice";
import { placeOrder } from "../redux/OrderSlice";
import { fetchCart } from "../redux/CartSlice";
import { createPayment } from "../redux/PaymentSlice";
import AddressItem from "../components/AddressItem";
import axiosInstance from "../api";

const CheckoutScreen = ({ navigation, route }: any) => {
  const { cart } = route.params;
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [total, setTotal] = useState<number>(cart.total);
  // Đã bỏ OTP khỏi Checkout
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.users.currentUser);
  const defaultAddress = useSelector(
    (state: any) => state.addresses.defaultAddress
  );

  useEffect(() => {
    dispatch(fetchDefaultAddress());
  }, [dispatch]);



  const handleCheckout = async () => {
    if (!defaultAddress) {
      Alert.alert("Thông báo", "Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    // Bỏ xác thực OTP, đặt hàng trực tiếp
    processOrder();
  };

  const processOrder = async () => {
    const data = {
      userId: currentUser?.id,
      addressId: defaultAddress?.id,
      paymentMethod,
    };

    const action = await dispatch(placeOrder({ data, param: { total } }));
    if (placeOrder.fulfilled.match(action)) {
      const orderId = action.payload.id;
      if (paymentMethod === "COD") {
        navigation.navigate("OrderHistory");
      } else {
        handleVnpayPayment(orderId);
      }
    }
    dispatch(fetchCart(currentUser.id));
  };

  const handleVnpayPayment = async (orderId: number) => {
    const payment = await dispatch(createPayment({ orderId })).unwrap();
    if (payment && payment.paymentUrl) {
      navigation.navigate("VnpayPayment", { paymentUrl: payment.paymentUrl });
    }
  };



  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          <Pressable
            style={{ paddingHorizontal: 20 }}
            onPress={() => navigation.navigate("Address")}
          >
            {defaultAddress ? (
              <AddressItem item={defaultAddress} />
            ) : (
              <Text style={styles.selectAddressText}>Chọn địa chỉ</Text>
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
          <Text style={styles.text}>
            Đơn hàng: {cart.total.toLocaleString("vi-VN")} VNĐ
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
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  scrollContainer: { paddingBottom: 80 },
  section: { marginBottom: 5 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  text: { paddingHorizontal: 20 },
  totalText: { fontSize: 20, color: "red", fontWeight: "bold", marginTop: 8 },
  checkoutButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  timerText: { fontSize: 16, color: "red", marginBottom: 10 },
  otpInput: {
    borderBottomWidth: 1,
    width: "80%",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 5 },
  modalButtonText: { color: "white", fontWeight: "bold" },
  selectAddressText: { fontSize: 16, textAlign: "center", paddingVertical: 5 },
});

export default CheckoutScreen;
