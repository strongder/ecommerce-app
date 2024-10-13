import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

interface CartItemProps {
  cartItem: {
    id: number;
    quantity: number;
    price: number;
    name: string;
    image: string;
    varProduct: {
      id: number;
      attribute: any
      stock: number;
    };
    delete: boolean;
  }, 
  onRemove: (id: number) => void
  onUpdate: (id: number, quantity: number) => void
}
const CartItem: React.FC<CartItemProps> = ({ cartItem, onRemove, onUpdate }) => {
  const [quantity, setQuantity] = useState<number>(cartItem.quantity);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const handleUpdate = () => {
    onUpdate(cartItem.id, quantity);
  }
  useEffect(() => {
    handleUpdate();
  }, [quantity]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: cartItem.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{cartItem.name}</Text>
        <Text style={styles.price}>{Object.keys(cartItem.varProduct.attribute).map((key) => cartItem.varProduct.attribute[key])
      .join(", ")}</Text>
        <Text style={styles.price}>{cartItem.price.toLocaleString("de-DE")} VNĐ</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decreaseQuantity} style={styles.button}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity onPress={increaseQuantity} style={styles.button}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => onRemove(cartItem.id)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  category: {
    fontSize: 14,
    color: "#666",
  },
  price: {
    fontSize: 14,
    color: "#e91e63",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  button: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: "#ff5252",
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "#fff",
  },
});

export default CartItem;
