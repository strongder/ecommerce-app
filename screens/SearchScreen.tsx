import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { products } from "../data";
import AntDesign from "@expo/vector-icons/AntDesign";
import ProductItem from "../components/ProductItem";

const SearchScreen = ({ navigation, route }: any) => {
  console.log(route.params)
  const [filter, setFilter] = useState("Liên quan"); // Bộ lọc mặc định
  const [results, setResults] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState(route.params.key); // Giả sử Product là kiểu dữ liệu sản phẩm

  const handleSearch = () => {
    const filteredResults = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(filteredResults);
  };

  const applyFilter = (selectedFilter: string) => {
    setFilter(selectedFilter);
    // Logic để sắp xếp results dựa trên filter
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <AntDesign name="arrowleft" size={26} color="black" onPress={() => navigation.goBack()}/>
        <TextInput
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
         <AntDesign
              
              name="search1"
              size={24}
              color="black"
            />
      </View>

      <View style={styles.filterContainer}>
        {["Liên quan", "Mới nhất", "Bán chạy"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => applyFilter(item)}
            style={styles.filterButton}
          >
            <Text style={{ fontWeight: filter === item ? "bold" : "normal" }}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        scrollEnabled={false}
        data={products}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    gap:10,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  searchInput: {
    justifyContent:"center",
    alignItems:"center",
    flex:1,
    fontSize: 16,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  filterButton: {
    padding: 10,
  },
  productItem: {
    flex: 1,
    gap: 10
  },
});

export default SearchScreen;
