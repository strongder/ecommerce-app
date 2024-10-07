import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddressByUser,
  deleteAddress,
  updateDefaultAddress,
} from "../redux/AddressSlice";
import AddressItem from "../components/AddressItem";

const AddressScreen = () => {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const listAddress = useSelector((state: any) => state.addresses.addresses);
  const currentUser = useSelector((state: any) => state.users.currentUser);
  const [defaultAddress, setDefaultAddress] = useState<number | null>(null);

  useEffect(() => {
    const userId: any = currentUser?.id;
    if (userId) {
      dispatch(fetchAddressByUser(userId));
    }
  }, [dispatch, currentUser]);

  const handleDeleteAddress = (id: number) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa địa chỉ này không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: () => dispatch(deleteAddress(id)),
        },
      ],
      { cancelable: false }
    );
  };
  useEffect(() => {
    if (defaultAddress) {
      dispatch(updateDefaultAddress(defaultAddress));
      navigation.goBack();
    }
  }, [dispatch, defaultAddress]);

  const renderAddressItem = ({ item }: { item: any }) => (
    <View style={styles.addressItem}>
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => setDefaultAddress(item.id)}
          style={styles.checkbox}
        >
          {(defaultAddress === item.id || item.defaultAddress === true) && (
            <Text style={styles.checkmark}>✔️</Text>
          )}
        </TouchableOpacity>
        <AddressItem item={item} />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Sửa"
          onPress={() => navigation.navigate("EditAddress", { id: item.id })}
          color="#007BFF"
        />
        <Button
          title="Xóa"
          onPress={() => handleDeleteAddress(item.id)}
          color="#FF4136"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {listAddress.length > 0 ? (
        <FlatList
          data={listAddress}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAddressItem}
        />
      ) : (
        <Text style={styles.emptyMessage}>Chưa có địa chỉ nào.</Text>
      )}
      <TouchableOpacity>
        <Button
          title="Thêm địa chỉ"
          onPress={() => navigation.navigate("AddAddress")}
          color="#007BFF"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8F9FA",
  },
  addressItem: {
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#6c757d",
    marginTop: 20,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "#686868",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkmark: {
    color: "green",
    fontSize: 20,
  },
});

export default AddressScreen;
