import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, updateProfile } from "../redux/UserSlice";

const EditProfileScreen = ({ navigation, route }: any) => {
  const dispatch = useDispatch();
  const { currentUser } = route.params;

  const [username, setUsername] = useState(currentUser?.username || "");
  const [fullName, setFullName] = useState(currentUser?.fullName || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [password, setPassword] = useState<any>();
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleChooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };
  const handlePickImage = async () => {
    Alert.alert(
      "Chọn ảnh",
      "Chọn ảnh từ thư viện hoặc chụp ảnh mới",
      [
        {
          text: "Chụp ảnh",
          onPress: handleImagePicker,
        },
        {
          text: "Chọn ảnh",
          onPress: handleChooseImage,
        },
      ],
      { cancelable: true }
    );
  };

  const handleUpdateProfile = () => {
    const updatedUser = {
      username,
      fullName,
      phone,
      password,
      avatar,
    };
    if (!password) {
      delete updatedUser.password;
    }
    console.log("updated user", updatedUser);
    dispatch(updateProfile({ userId: currentUser.id, data: updatedUser }));
    navigation.goBack(); // Quay lại màn hình trước đó
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={handlePickImage}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
        </TouchableOpacity>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Mật khẩu mới</Text>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <Pressable style={styles.buttonContainer} onPress={handleUpdateProfile}>
        <Text style={{ color: "black", textAlign: "center" }}>Cập nhật</Text>
      </Pressable>
    </View>
  );
};

// Thiết kế giao 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "space-between", // Đảm bảo không gian giữa các thành phần
  },
  formContainer: {
    flex: 1,
    justifyContent: "center", // Đưa các trường nhập liệu vào giữa
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  buttonContainer: {
    padding: 12,
    backgroundColor: "orange",
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
  },
});

export default EditProfileScreen;