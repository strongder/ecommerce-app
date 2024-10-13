// screens/CartScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import CartItem from "../components/CartItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { removeProductFromCart, updateProductInCart } from "../redux/CartSlice";
import { fetchCurrentUser } from "../redux/UserSlice";
import { configAxios } from "../api";

const CartScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const  {cart} : any = useSelector((state: RootState) => state.carts);
  const currentUser: any = useSelector(
    (state: RootState) => state.users.currentUser
  );
  useEffect(() => {
    configAxios(navigation);
    dispatch(fetchCurrentUser())
  }, [ dispatch]);
  const handleCheckout = () => {
    navigation.navigate("Checkout", {cart : cart});
  };
  const removeItem = (id: number) => {
    const param = {
        cartItemId: id,
        userId: currentUser.id,  // Đảm bảo currentUser.id có giá trị đúng
    }
    console.log(param);
    dispatch(removeProductFromCart({ param }));  // Truyền param vào như đã định
};
  const updateItem = (id: number, quantity: number) => {
    // Update item in cart
    const param ={
      cartItemId: id,
      quantity: quantity,
      userId: currentUser.id,
    }
    console.log(param);
    dispatch(updateProductInCart({ param }));
  }

  return (
    <View style={styles.container}>
      {cart && (
        <>
          <FlatList
            data={cart?.cartItems}
            renderItem={({ item }) => (
              <CartItem cartItem={item} onRemove={removeItem} onUpdate={updateItem} />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Tổng cộng: {cart?.total?.toLocaleString("vi-VN")} VNĐ
            </Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>Tiến hành thanh toán</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f7f7f7",
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
    fontSize: 20,
    color: "red",
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
