import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { categories, products } from "../data";
import ProductItem from "../components/ProductItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByCategory } from "../redux/ProductSlice";

const CategoryScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const listProductByCategory = useSelector(
    (state: any) => state.products.listProductByCategory
  );
  const {category, categories} = useSelector((state: any) => state.categories);
  const handleFetchProductByCategory = (id: number) => {
    dispatch(fetchProductByCategory(id));
  };
  return (
    <View style={styles.container}>
      <View style={styles.category}>
        <Text style={styles.sectionTitle}>Danh mục sản phẩm</Text>
        <FlatList
          horizontal
          scrollEnabled={true}
          data={categories}
          renderItem={({ item }) => (
            <Pressable
              style={styles.categoryItem}
              onPress={() =>
               handleFetchProductByCategory(item.id)
              }
            >
              <View style={{ alignItems: "center", gap: 20 }}>
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 80, height: 80, borderRadius: 50 }}
                ></Image>
                <Text style={styles.categoryText}>{item.name}</Text>
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={true}
        />
      </View>
      {category && <Text>{category?.name}</Text>}
      {listProductByCategory && (
        <FlatList
          contentContainerStyle={styles.listProduct}
          scrollEnabled={false}
          data={listProductByCategory}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("ProductDetail", { product: item })
              }
              style={styles.productItem}
            >
              <ProductItem product={item} />
            </Pressable>
          )}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          numColumns={2}
        />
      )}
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  category: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoryItem: {
    padding: 10,
    backgroundColor: "#AFEEEE",
    borderRadius: 5,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
  },

  listProduct: {},
  productItem: {
    flex: 1,
    margin: 5, 
  },
});
