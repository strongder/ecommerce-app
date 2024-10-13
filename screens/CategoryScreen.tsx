import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { categories, products } from "../data";
import ProductItem from "../components/ProductItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByCategory } from "../redux/ProductSlice";

const CategoryScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [isActiveId, setIsActiveId] = useState<number>();
  const listProductByCategory = useSelector(
    (state: any) => state.products.listProductByCategory
  );
  const {parentCategory, subCategories} = useSelector((state: any) => state.categories);

  const handleFetchProductByCategory = (id: number) => {
    setIsActiveId(id);
    dispatch(fetchProductByCategory(id));
  };
  return (
    <View style={styles.container}>
      <View style={styles.category}>
        <Text style={styles.sectionTitle}>{parentCategory.name}</Text>
        <FlatList
          horizontal
          scrollEnabled={true}
          data={subCategories}
          renderItem={({ item }) => (
            <Pressable
              style={isActiveId === item.id ? styles.categoryItemActive :styles.categoryItem}
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
      {/* {category && } */}
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
    fontSize: 20,
    paddingLeft: 10,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoryItem: {
    padding: 10,
    backgroundColor: "#AFEEEE",
    borderRadius: 5,
    marginRight: 10,
  },
  categoryItemActive: {
    padding: 10,
    backgroundColor: "orange",
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
