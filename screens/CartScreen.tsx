// screens/CartScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CartItem from "../components/CartItem";
import { carts } from "../data";


const CartScreen= ({ navigation }: any) => {
  const [cartItems, setCartItems] = useState<any>([]);

  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const calculateTotal = (): void => {
    const newTotal = cartItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  };

  const updateQuantity = (id: string, newQuantity: number): void => {
    if (newQuantity < 1) return;
    const updatedItems = cartItems.map((item: any) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
  };

  const removeItem = (id: number): void => {
    const updatedItems = cartItems.filter((item: any) => item.id !== id);
    setCartItems(updatedItems);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ hàng</Text>
      <FlatList
        data={carts.cartItems}
        renderItem={({item}) => (
          <CartItem cartItem={item} onRemove={removeItem} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Tổng cộng: {carts.total.toLocaleString("vi-VN")} VNĐ
        </Text>
      </View>
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => navigation.navigate("Checkout")}
      >
        <Text style={styles.checkoutButtonText}>Tiến hành thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    fontSize: 24,
    paddingHorizontal: 16,
  },
  quantity: {
    fontSize: 18,
    paddingHorizontal: 16,
  },
  removeButton: {
    color: "red",
    marginTop: 8,
  },
  totalContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CartScreen;
