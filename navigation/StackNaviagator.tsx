import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen";
import SearchScreen from "../screens/SearchScreen";
import CategoryScreen from "../screens/CategoryScreen";
import VnPayScreen from "../screens/VnPayScreen";
import AddressScreen from "../screens/AddressScreen";
import AddAddressScreen from "../screens/AddAddressScreen";
import PaymentHistory from "../screens/PaymentHistory";
import BottomTabs from "../components/BottomTabs";
import PaymentResultScreen from "../screens/PaymentResultScreen";
import ProductReviewScreen from "../screens/ProductReviewScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
const StackNaviagator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
      
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ headerShown: true, title: "Thanh toán" }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ headerShown: true, title: "Chi tiết sản phẩm" }}
        />
        <Stack.Screen
          name="OrderHistory"
          component={OrderHistoryScreen}
          options={{ headerShown: true, title: "Lịch sử đơn hàng" }}
        />
        <Stack.Screen
          name="PaymentHistory"
          component={PaymentHistory}
          options={{ headerShown: true, title: "Lịch sử thanh toán" }}
        />
        <Stack.Screen
          name="OrderDetail"
          component={OrderDetailScreen}
          options={{ headerShown: true, title: "Chi tiết đơn hàng" }}
        />
        <Stack.Screen
          name="SearchPage"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          options={{ headerShown: true, title: "Danh mục sản phẩm" }}
        />

        <Stack.Screen
          name="VnpayPayment"
          component={VnPayScreen}
          options={{ headerShown: true, title: "Thanh toán vnpay" }}
        />
        <Stack.Screen
          name="Address"
          component={AddressScreen}
          options={{ headerShown: true, title: "Danh sách địa chỉ" }}
        />

        <Stack.Screen
          name="AddAddress"
          component={AddAddressScreen}
          options={{ headerShown: true, title: "Thêm địa chỉ mới" }}
        />

        <Stack.Screen
          name="PaymentResult"
          component={PaymentResultScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ProductReview"
          component={ProductReviewScreen}
          options={{ headerShown: true, title: "Đánh giá sản phẩm" }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerShown: true, title: "Sửa thông tin" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNaviagator;

const styles = StyleSheet.create({});
