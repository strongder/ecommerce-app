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
  const [otp, setOtp] = useState("");
  const [isOtpModalVisible, setOtpModalVisible] = useState(false);
  const [timer, setTimer] = useState(60);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.users.currentUser);
  const defaultAddress = useSelector(
    (state: any) => state.addresses.defaultAddress
  );

  useEffect(() => {
    dispatch(fetchDefaultAddress());
  }, [dispatch]);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (isOtpModalVisible && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      closeOtpModal();
      Alert.alert("Hết thời gian", "Mã OTP đã hết hạn, vui lòng thử lại.");
    }
    return () => clearInterval(countdown);
  }, [isOtpModalVisible, timer]);

  const handleCheckout = async () => {
    if (!defaultAddress) {
      Alert.alert("Thông báo", "Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    handleSendOtp();
    setOtpModalVisible(true);
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

  const handleOtpSubmit = () => {
    if (otp.length === 6) {
      handleVerifyOtp();
    } else {
      Alert.alert("Lỗi", "OTP không hợp lệ, vui lòng thử lại");
    }
  };

  const closeOtpModal = () => {
    setOtpModalVisible(false);
    setOtp("");
    setTimer(60);
  };

  const handleSendOtp = async () => {
    try {
      const action = await axiosInstance.post(
        `/auth/otp/send?email=${encodeURIComponent(currentUser.email)}`
      );
      if (action.data.code === 200) {
        setTimer(60);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length === 6) {
      try {
        const action = await axiosInstance.post(
          `/auth/otp/verify?email=${encodeURIComponent(
            currentUser.email
          )}&otp=${otp}`
        );
        if (action.data.code === 200) {
          setOtpModalVisible(false);
          setOtp("");
          setTimer(60);
          Alert.alert("Thành công", "Xác thực OTP thành công.");
          processOrder();
        } else {
          Alert.alert("Lỗi", "Xác thực OTP thất bại, vui lòng thử lại.");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Lỗi", "Xác thực OTP thất bại, vui lòng thử lại.");
      }
    } else {
      Alert.alert("Lỗi", "Mã OTP không hợp lệ, vui lòng thử lại.");
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

      <Modal
        visible={isOtpModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeOtpModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập mã OTP</Text>
            <Text style={styles.timerText}>Mã OTP hết hạn sau: {timer}s</Text>
            <TextInput
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={6}
              placeholder="Nhập OTP"
              value={otp}
              onChangeText={setOtp}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleOtpSubmit}
            >
              <Text style={styles.modalButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
