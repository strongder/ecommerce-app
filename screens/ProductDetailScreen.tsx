import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView,
  FlatList,
  TextInput,
  Dimensions,
} from "react-native";
import Swiper from "react-native-swiper";
import { Picker } from "@react-native-picker/picker";

const { width: viewportWidth } = Dimensions.get("window");

const ProductDetailScreen = ({ route, navigation }: any) => {
  const { product } = route.params;
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const [selectedClassification, setSelectedClassification] = useState("");

  const classifications = product.varProducts.map((varProduct: any) => {
    const attributes = varProduct.attribute; // Lấy tất cả các thuộc tính
    const classificationString = Object.keys(attributes)
      .map((key) => attributes[key])
      .join(", ");
    return classificationString;
  });

  const [comment, setComment] = useState("");

  const renderRelatedProduct = ({ item }: any) => (
    <View style={styles.relatedProduct}>
      <Image source={{ uri: item.image }} style={styles.relatedProductImage} />
      <Text>{item.name}</Text>
      <Text>${item.price}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={{ borderBottomWidth: 1, borderColor: "#ccc", marginBottom: 10 }}>
        <Swiper
          showsButtons={false}
          width={viewportWidth}
          height={200}
          style={{ borderWidth: 1, marginBottom: 10 }}
        >
          {product.imageUrls.map((item: any, index: number) => (
            <View key={index}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            </View>
          ))}
        </Swiper>
      </View>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <View style={styles.ratingContainer}>
        <Text style={styles.rating}>Đánh giá: {product.rating} / 5</Text>
        <Image
          source={{
            uri: "https://media.doisongvietnam.vn/u/tungseo/uploads/2016/09/cach-ve-ngoi-sao-19-9-2016-2.jpg",
          }}
          style={{ width: 25, height: 25, marginLeft: 5 }}
        ></Image>
      </View>

      <Text style={styles.stock}>Đã bán: {product.stock}</Text>

      <View style={styles.pickerContainer}>
        <Text style={{ fontWeight: "bold", fontSize: 16, marginVertical: 5 }}>
          Phân loại:
        </Text>
        <View style={{ borderWidth: 1 }}>
          <Picker
            selectedValue={selectedClassification}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedClassification(itemValue)}
          >
            {classifications.map((classification: string, index: number) => (
              <Picker.Item
                key={index}
                label={classification}
                value={classification}
              />
            ))}
          </Picker>
        </View>
      </View>
      <Button
        title="Add to Cart"
        onPress={() => {
          /* Add to cart logic */
        }}
      />

      <View style={styles.description}>
        <Text style={styles.descriptionTitle}>Mô tả</Text>
        <Text
          style={
            isDescriptionExpanded
              ? styles.descriptionContentActive
              : styles.descriptionContent
          }
        >
          {product.description}
        </Text>
        <Button
          title={isDescriptionExpanded ? "Thu gọn" : "Xem thêm"}
          onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
        />
      </View>
      <View style={styles.commentSection}>
        <Text style={styles.commentTitle}>Comments</Text>
        {/* <FlatList
            data={[]}
            renderItem={renderCommentItem}
            keyExtractor={(item: any) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
        /> */}
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          value={comment}
          onChangeText={setComment}
        />
        <Button
          title="Submit"
          onPress={() => {
            /* Submit comment logic */
          }}
        />
      </View>

      <View style={styles.relatedProductsSection}>
        <Text style={styles.relatedProductsTitle}>Related Products</Text>
        <FlatList
          data={[]}
          renderItem={renderRelatedProduct}
          keyExtractor={(item: any) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  image: {
    width: viewportWidth,
    justifyContent: "center",
    height: 200,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",

    marginVertical: 8,
  },

  price: {
    fontSize: 20,
    color: "#000",
    marginVertical: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 16,
    color: "#000",
    marginVertical: 8,
  },
  stock: {
    fontSize: 16,
    color: "#000",
    marginVertical: 8,
  },
  pickerContainer: {
    marginVertical: 8,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  commentSection: {
    marginVertical: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  descriptionContent: {
    color: "black",
    marginVertical: 16,
    height: 50,
  },
  descriptionContentActive: {
    color: "black",
    marginVertical: 16,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
  },
  relatedProductsSection: {
    marginVertical: 16,
  },
  relatedProductsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  relatedProduct: {
    marginRight: 10,
  },
  relatedProductImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});

export default ProductDetailScreen;
