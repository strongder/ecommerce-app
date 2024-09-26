// screens/CheckoutScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { userAddresses } from '../data';

type RootStackParamList = {
  OrderConfirmation: undefined;
  // Thêm các màn hình khác nếu cần
};

type CheckoutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderConfirmation'>;

interface CheckoutScreenProps {
  navigation: any;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation }) => {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Giả sử đây là tổng giá trị đơn hàng từ giỏ hàng
  const subtotal = 250000;
  const tax = subtotal * 0.1; // 10% thuế
  const shippingFee = 30000; // Phí vận chuyển cố định
  const total = subtotal + tax + shippingFee;

  const handleCheckout = () => {
    // Xử lý logic thanh toán ở đây
    // Sau khi xử lý xong, chuyển đến trang xác nhận đơn hàng
    navigation.navigate('VnpayPayment');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thanh toán</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
        <Picker
          selectedValue={selectedAddress}
          onValueChange={(itemValue) => setSelectedAddress(itemValue)}
          style={styles.picker}
        >
          {userAddresses.map((address: any, index: number) => (
            <Picker.Item key={index} label={`${address.street}, ${address.city}`} value={address.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        <Picker
          selectedValue={paymentMethod}
          onValueChange={(itemValue) => setPaymentMethod(itemValue)}
        >
          <Picker.Item label="Thanh toán khi nhận hàng (COD)" value="cod" />
          <Picker.Item label="Thẻ tín dụng/ghi nợ" value="card" />
          <Picker.Item label="Ví điện tử" value="ewallet" />
        </Picker>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tổng chi phí</Text>
        <Text>Tạm tính: {subtotal.toLocaleString('vi-VN')} VNĐ</Text>
        <Text>Thuế (10%): {tax.toLocaleString('vi-VN')} VNĐ</Text>
        <Text>Phí vận chuyển: {shippingFee.toLocaleString('vi-VN')} VNĐ</Text>
        <Text style={styles.totalText}>Tổng cộng: {total.toLocaleString('vi-VN')} VNĐ</Text>
      </View>

      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Xác nhận đặt hàng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  checkoutButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;