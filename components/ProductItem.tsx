import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const ProductItem = ({ product }: any) => {
  console.log(product.discount);
  return (
    <View style={styles.container}>
      {product.discount > 0 && (
        <View style={styles.discount}>
          <Text style={styles.textDiscount}>{product.discount}%</Text>
        </View>
      )}

      <Image
        source={{ uri: product.imageUrls[0].imageUrl }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{product.price} VNĐ</Text>
        <Text style={styles.sold}>Đã bán: {product.quantitySold}</Text>
        <Text style={styles.rating}>Đánh gia: {product.rating} ⭐</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  discount: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "red",
    padding: 4,
    zIndex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  textDiscount: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  info: {
    marginTop: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 14,
    color: "#e91e63",
  },
  sold: {
    fontSize: 12,
    color: "#666",
  },
  rating: {
    fontSize: 12,
    color: "#666",
  },
});

export default ProductItem;
