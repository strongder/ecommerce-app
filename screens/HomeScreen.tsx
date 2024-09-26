import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { products, categories } from "../data";
import ProductItem from "../components/ProductItem";

const HomeScreen = () => {
  const navigation: any = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    console.log(searchTerm);
    navigation.navigate("SearchPage", { key: searchTerm });
  };
  const renderProductList = (title: string, data: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        // contentContainerStyle={styles.listProduct}
        scrollEnabled={false}
        data={data}
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.searchContainer}>
          <Pressable style={styles.searchBox}>
            <AntDesign
              style={styles.searchIcon}
              name="search1"
              size={24}
              color="black"
            />
            <TextInput
              placeholder="Search"
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={handleSearch}
            />
          </Pressable>
        </View>

        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri: "https://colour.vn/wp-content/uploads/mau-banner-quang-cao-khuyen-mai.jpg",
            }}
            style={styles.bannerImage}
          />
        </View>

        <View style={styles.section}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.sectionTitle}>Danh mục</Text>
            <Text style={{alignItems: "center"}} onPress={()=>navigation.navigate("Category")}>
              Chi tiết
              <AntDesign name="right" size={18} color="black" />
            </Text>
          </View>
          <FlatList
            horizontal
            scrollEnabled={true}
            data={categories}
            renderItem={({ item }) => (
              <Pressable
             style={styles.categoryItem}
                onPress={() =>
                  navigation.navigate("Category", { category: item })
                }
              >
                <View style={{ alignItems: 'center', gap: 20}}>
                  <Image source={{ uri: item.image }} style={{ width: 80, height: 80, borderRadius: 50}}></Image>
                  <Text style={styles.categoryText}>{item.name}</Text>
                </View>
              </Pressable>
            )}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={true}
          />
        </View>
        {renderProductList("Featured Products", products)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "white",
  },
  listProduct: {
    
  },
  productItem: {
    flex: 1,
    margin: 5, // Thêm khoảng cách 10 giữa các sản phẩm (5 cho mỗi bên)
  },
  searchContainer: {
    backgroundColor: "#00CED1",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 7,
    gap: 10,
    backgroundColor: "white",
    borderRadius: 3,
    height: 30,
    flex: 1,
  },
  searchIcon: {
    paddingLeft: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
  },
  bannerContainer: {
    padding: 10,
  },
  bannerImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 10,
  },
  section: {
    padding: 10,
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
});
