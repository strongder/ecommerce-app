import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import ProductItem from "../components/ProductItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductBySearch } from "../redux/ProductSlice";
import { Picker } from "@react-native-picker/picker";

const SearchScreen = ({ navigation, route }: any) => {
  // const { key } = route.params.searchTerm;
  console.log("key", route.params.searchTerm);
  const [searchTerm, setSearchTerm] = useState<string>(route.params.searchTerm);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState<any>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [priceFilter, setPriceFilter] = useState<number | null>(null);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [discountFilter, setDiscountFilter] = useState<boolean>(false);
  const [results, setResults] = useState<any>([]);

  const dispatch = useDispatch();
  const products = useSelector(
    (state: any) => state.products.listProductSearch
  );

  const param = {
    query: searchTerm,
    pageNum: currentPage,
    price: priceFilter,
    rating: ratingFilter,
    discount: discountFilter,
  };

  useEffect(() => {
    handleSearchProduct();
  }, [dispatch, searchTerm, priceFilter, ratingFilter, discountFilter]);

  const handleSearchProduct = async () => {
    if (!loading && hasMore) {
      setLoading(true);
      console.log("---------", param);
      const action = await dispatch(fetchProductBySearch({ param }));
      console.log("+++++++++++++", param);
      if (fetchProductBySearch.fulfilled.match(action)) {
        if (action.payload.length === 0) {
          setHasMore(false);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
      handleSearchProduct();
    }
  };

  const applyFilter = (filterType: string, value: any) => {
    if (filterType === "price") setPriceFilter(value);
    if (filterType === "rating") setRatingFilter(value);
    if (filterType === "discount") setDiscountFilter(value);
    setCurrentPage(0);
    setResults([]); // Reset results when applying a new filter
    setHasMore(true);
  };

  const handleSearchPress = () => {
    setCurrentPage(0);
    setPriceFilter(0);
    setRatingFilter(0);
    setDiscountFilter(false);
    setResults([]); // Clear results when searching
    setHasMore(true);
    handleSearchProduct();
  };

  useEffect(() => {
    if (products) {
      // Duyệt qua các sản phẩm mới và chỉ thêm những sản phẩm chưa có trong results
      setResults((prevResults: any) => {
        const existingIds = new Set(prevResults.map((item: any)=> item.id)); // Lưu trữ các ID đã có
        const newProducts = products.filter((item: any) => !existingIds.has(item.id)); // Lọc sản phẩm mới
        return [...prevResults, ...newProducts]; // Thêm các sản phẩm mới vào results
      });
    }
  }, [products]);

  console.log(results);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <AntDesign name="arrowleft" size={26} color="black" onPress={() => navigation.goBack()} />
        <TextInput
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Nhập từ khóa tìm kiếm"
        />
        <TouchableOpacity onPress={handleSearchPress}>
          <AntDesign name="search1" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Bộ lọc */}
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={priceFilter}
          onValueChange={(itemValue) => applyFilter("price", itemValue)}
          style={styles.pickerPrice}
        >
          <Picker.Item label="Price" value={null} />
          <Picker.Item label="Giá < 50.000" value={50000} />
          <Picker.Item label="Giá < 100.000" value={100000} />
          <Picker.Item label="Giá < 200.000" value={200000} />
          <Picker.Item label="Giá < 500.000" value={500000} />
          <Picker.Item label="Giá < 500.000" value={1000000} />
        </Picker>

        <Picker
          selectedValue={ratingFilter}
          onValueChange={(itemValue) => applyFilter("rating", itemValue)}
          style={styles.pickerRating}
        >
          <Picker.Item label="Rating" value={null} />
          <Picker.Item label="5*" value={5} />
          <Picker.Item label="4*" value={4} />
          <Picker.Item label="3*" value={3} />
        </Picker>

        <TouchableOpacity onPress={() => applyFilter("discount", true)} style={styles.filterButton}>
          <Text style={{ color: discountFilter ? "red" : "black" }}>Discount</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate("ProductDetail", { product: item })}
            style={styles.productItem}
          >
            <ProductItem product={item} />
          </Pressable>
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        contentContainerStyle={styles.list}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        // ListFooterComponent={loading && <Text>Đang tải thêm...</Text>}
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
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    fontSize: 16,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  pickerPrice: {
    height: 40,
    width: 120, // Adjust width as necessary
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  pickerRating: {
    height: 40,
    width: 120, // Adjust width as necessary
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },

  filterButton: {
    padding: 10,
  },
  productItem: {
    flex: 1,
    margin: 5,
  },
  list: {
    paddingBottom: 20,
  },
});

export default SearchScreen;
