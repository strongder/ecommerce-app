import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Alert, TextInput } from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { addAddress } from "../redux/AddressSlice";
import { useNavigation } from "@react-navigation/native";

const AddAddressScreen: React.FC = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectCity, setSelectCity] = useState(""); // Lưu ID tỉnh
  const [selectDistrict, setSelectDistrict] = useState(""); // Lưu ID quận
  const [selectWard, setSelectWard] = useState(""); // Lưu ID xã

  const currentUser = useSelector((state: any) => state.users.currentUser);
  const [form, setForm] = useState({
    addressDetail: "",
    phone: "",
    recipientName: "",
    city: "",
    district: "",
    ward: "",
    userId: currentUser?.id,
  });
  const navigation: any = useNavigation();
  const dispatch = useDispatch();

  // Fetch list of provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://esgoo.net/api-tinhthanh/1/0.htm"
        );
        if (response.data.error === 0) {
          setProvinces(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts based on selected province
  const fetchDistricts = async (provinceId: string) => {
    try {
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`
      );
      if (response.data.error === 0) {
        setDistricts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  // Fetch wards based on selected district
  const fetchWards = async (districtId: string) => {
    try {
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/3/${districtId}.htm`
      );
      if (response.data.error === 0) {
        setWards(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  // Handle province selection change
  const handleProvinceChange = async (provinceId: string) => {
    setSelectCity(provinceId); // Lưu ID tỉnh
    setSelectDistrict(""); // Reset quận
    setSelectWard(""); // Reset xã
    setDistricts([]); // Reset danh sách quận
    setWards([]); // Reset danh sách xã
    const city: any = provinces.find(
      (province: any) => province.id === provinceId
    );
    setForm({ ...form, city: city.full_name });
    if (provinceId) {
      await fetchDistricts(provinceId);
    }
  };

  // Handle district selection change
  const handleDistrictChange = async (districtId: string) => {
    setSelectDistrict(districtId); // Lưu ID quận
    setSelectWard(""); // Reset xã
    setWards([]); // Reset danh sách xã
    const district: any = districts.find(
      (district: any) => district.id === districtId
    );
    setForm({ ...form, district: district.full_name }); // Lưu ID quận vào form
    if (districtId) {
      await fetchWards(districtId);
    }
  };

  // Handle ward selection change
  const handleWardChange = (wardId: string) => {
    setSelectWard(wardId); // Lưu ID xã
    const ward: any = wards.find((ward: any) => ward.id === wardId);
    setForm({ ...form, ward: ward.full_name }); // Lưu ID xã vào form
  };

  // Handle saving address
  const handleSaveAddress = () => {
    const { addressDetail, phone, recipientName } = form;

    if (
      !addressDetail ||
      !phone ||
      !recipientName ||
      !selectCity ||
      !selectDistrict ||
      !selectWard
    ) {
      Alert.alert("Thông báo", "Bạn cần nhập đầy đủ thông tin.");
      return;
    }
    dispatch(addAddress(form));

    // Get full names based on selected IDs
    const cityName: any = provinces.find(
      (province: any) => province.id === selectCity
    );
    const districtName: any = districts.find(
      (district: any) => district.id === selectDistrict
    );
    const wardName: any = wards.find((ward: any) => ward.id === selectWard);
    Alert.alert("Thông báo","Thêm địa chỉ thành công.");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên người nhận"
        value={form.recipientName}
        onChangeText={(text) => setForm({ ...form, recipientName: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập số điện thoại"
        value={form.phone}
        onChangeText={(text) => setForm({ ...form, phone: text })}
        keyboardType="phone-pad"
      />

      <Picker
        selectedValue={selectCity}
        style={styles.picker}
        onValueChange={handleProvinceChange}
      >
        <Picker.Item label="Chọn Tỉnh Thành" value="" />
        {provinces.map((province: any) => (
          <Picker.Item
            key={province.id}
            label={province.full_name}
            value={province.id}
          />
        ))}
      </Picker>

      <Picker
        selectedValue={selectDistrict}
        style={styles.picker}
        onValueChange={handleDistrictChange}
        enabled={selectCity !== ""}
      >
        <Picker.Item label="Chọn Quận Huyện" value="" />
        {districts.map((district: any) => (
          <Picker.Item
            key={district.id}
            label={district.full_name}
            value={district.id}
          />
        ))}
      </Picker>

      <Picker
        selectedValue={selectWard}
        style={styles.picker}
        onValueChange={handleWardChange}
        enabled={selectDistrict !== ""}
      >
        <Picker.Item label="Chọn Phường Xã" value="" />
        {wards.map((ward: any) => (
          <Picker.Item key={ward.id} label={ward.full_name} value={ward.id} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ chi tiết"
        value={form.addressDetail}
        onChangeText={(text) => setForm({ ...form, addressDetail: text })}
      />

      <Button title="Lưu Địa Chỉ" onPress={handleSaveAddress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#686868",
    borderRadius: 5,
  },
});

export default AddAddressScreen;
