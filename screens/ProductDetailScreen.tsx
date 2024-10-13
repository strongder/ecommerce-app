import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Button,
} from "react-native";
import Swiper from "react-native-swiper";
import { Picker } from "@react-native-picker/picker";
import ReviewItem from "../components/ReviewItem";
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart } from "../redux/CartSlice";
import { configAxios } from "../api";
import Modal from "react-native-modal";
import { fetchReviewByProduct } from "../redux/ReviewSlice";
import { fetchProductById } from "../redux/ProductSlice";
const { width: viewportWidth } = Dimensions.get("window");

const ProductDetailScreen = ({ route, navigation }: any) => {
  const { productId } = route.params;
  const dispatch = useDispatch();
  const [currentReviewPage, setCurrentReviewPage] = useState<number>(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedClassification, setSelectedClassification] = useState("");
  const currentUser = useSelector((state: any) => state.users.currentUser);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const product = useSelector((state: any) => state.products.product);
  // Kiểm tra nếu product hoặc product.varProducts là undefined
  const classifications =
    product?.varProducts &&
    product?.varProducts?.map((varProduct: any) => {
      const attributes = varProduct.attribute; // Lấy tất cả các thuộc tính
      const classificationString = Object.keys(attributes)
        .map((key) => attributes[key])
        .join(", ");
      return {
        id: varProduct.id,
        label: classificationString,
      };
    });
  useEffect(() => {
    if (classifications && classifications.length > 0) {
      setSelectedClassification(classifications[0].id);
    }
  }, [classifications]);

  useEffect(() => {
    configAxios(navigation);
    if (productId) dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  const reviews = useSelector((state: any) => state.reviews.reviews);

  useEffect(() => {
    const newParam = {
      pageNum: currentReviewPage,
    };
    if (product?.id) {
      dispatch(
        fetchReviewByProduct({ productId: product.id, param: newParam })
      );
    }
  }, [dispatch, currentReviewPage, product]);

  const handleAddToCart = () => {
    const data = {
      quantity: quantity,
      varProductId: selectedClassification,
    };
    const userId = currentUser.id;
    console.log(data, userId);
    dispatch(addProductToCart({ userId, data }));
    dispatch(fetchProductById(product.id));
    setIsModalVisible(false); // Đóng modal sau khi thêm vào giỏ hàng
  };

  const openModal = () => {
    setIsModalVisible(true); // Hiển thị modal
  };

  const handleMoreReview = async () => {
    setCurrentReviewPage(currentReviewPage + 1);
  };

  return (
    <>
      {product && (
        <ScrollView style={styles.container}>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: "#ccc",
              marginBottom: 10,
            }}
          >
            {product.imageUrls && (
              <Swiper
                showsButtons={false}
                width={viewportWidth}
                height={200}
                style={{ borderWidth: 1, marginBottom: 10 }}
              >
                {product?.imageUrls?.map((item: any, index: number) => (
                  <View key={index}>
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.image}
                    />
                  </View>
                ))}
              </Swiper>
            )}
          </View>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>
            {product?.price?.toLocaleString("de-DE")}Đ
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>Đánh giá: {product.rating} / 5</Text>
            <Image
              source={{
                uri: "https://media.doisongvietnam.vn/u/tungseo/uploads/2016/09/cach-ve-ngoi-sao-19-9-2016-2.jpg",
              }}
              style={{ width: 25, height: 25, marginLeft: 5 }}
            ></Image>
          </View>

          <Text style={styles.stock}>Đã bán: {product.quantitySold}</Text>
          <Pressable style={styles.addCart} onPress={openModal}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              Thêm vào giỏ hàng
            </Text>
          </Pressable>

          <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => setIsModalVisible(false)}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chọn phân loại và số lượng</Text>
              <View style={styles.pickerContainer}>
                <Text style={styles.modalText}>Phân loại:</Text>
                <Picker
                  selectedValue={selectedClassification}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    setSelectedClassification(itemValue)
                  }
                >
                  {classifications?.map(
                    (classification: any, index: number) => (
                      <Picker.Item
                        key={index}
                        label={classification.label}
                        value={classification.id}
                      />
                    )
                  )}
                </Picker>
              </View>
              <View style={styles.quantityContainer}>
                <Text style={styles.modalText}>Số lượng:</Text>
                <TextInput
                  style={styles.quantityInput}
                  keyboardType="numeric"
                  value={String(quantity)}
                  onChangeText={(text) => setQuantity(Number(text))}
                />
              </View>
              <Button title="Thêm vào giỏ hàng" onPress={handleAddToCart} />
            </View>
          </Modal>

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
            <Text style={styles.commentTitle}>Đánh giá</Text>
            {reviews && (
              <FlatList
                data={reviews}
                contentContainerStyle={styles.listReview}
                renderItem={({ item }) => <ReviewItem review={item} />}
                keyExtractor={(item: any) => item?.id}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            )}
            <Pressable onPress={handleMoreReview}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  paddingVertical: 5,
                }}
              >
                Xem thêm
              </Text>
            </Pressable>
          </View>

          <View style={styles.relatedProductsSection}>
            <Text style={styles.relatedProductsTitle}>Related Products</Text>
          </View>
        </ScrollView>
      )}
    </>
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
    height: 250,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
    color: "#333",
  },
  addCart: {
    backgroundColor: "#f39c12",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginVertical: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e60023",
    marginVertical: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rating: {
    fontSize: 16,
    color: "#000",
  },
  stock: {
    fontSize: 16,
    color: "#000",
    marginVertical: 0,
  },
  pickerContainer: {
    marginVertical: 10,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderRadius: 5,
  },
  commentSection: {
    marginVertical: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
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
    color: "#333",
  },
  relatedProductsSection: {
    marginVertical: 16,
  },
  relatedProductsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  relatedProduct: {
    marginRight: 10,
    alignItems: "center",
  },
  relatedProductImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  modalContainer: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: 60,
    textAlign: "center",
    borderRadius: 5,
  },
  listReview: {
    flexDirection: "column",
    width: "100%",
  },
});

export default ProductDetailScreen;
