import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";

const ProfileScreen = ({ navigation }: any) => {
  const handleLogout = () => {
    navigation.navigate("Login");
  };
  // Dữ liệu hồ sơ mẫu
  const profileData = {
    avatarUrl:
      "https://th.bing.com/th/id/OIP.T3gMvmoO0cxYUWgp7K8LXAHaLH?w=228&h=342&c=7&o=5&dpr=1.1&pid=1.20", // Link ảnh đại diện
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+123456789",
    address: "123 Main St, City, Country",
  };

  // Dữ liệu lịch sử thanh toán mẫu
  const paymentHistory = [
    { id: 1, amount: "$120.00", date: "2023-09-01", status: "Completed" },
    { id: 2, amount: "$55.50", date: "2023-08-15", status: "Pending" },
  ];

  // Dữ liệu lịch sử đơn hàng mẫu
  const orderHistory = [
    {
      id: 1,
      product: "Nike Air Max 90",
      date: "2023-09-10",
      status: "Delivered",
    },
    {
      id: 2,
      product: "Adidas Ultraboost",
      date: "2023-08-20",
      status: "Shipped",
    },
  ];

  const renderPaymentItem = ({ item }: any) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyText}>Amount: {item.amount}</Text>
      <Text style={styles.historyText}>Date: {item.date}</Text>
      <Text style={styles.historyText}>Status: {item.status}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Phần ảnh đại diện và tên */}
      <View style={styles.header}>
        <Image source={{ uri: profileData.avatarUrl }} style={styles.avatar} />
        <Text style={styles.name}>{profileData.name}</Text>
        <Text style={styles.email}>{profileData.email}</Text>
      </View>

      {/* Thông tin cá nhân */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Phone:</Text>
          <Text style={styles.infoValue}>{profileData.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Address:</Text>
          <Text style={styles.infoValue}>{profileData.address}</Text>
        </View>
      </View>

      <View style={styles.historySection}>
        <TouchableOpacity onPress={() => navigation.navigate("OrderHistory")}>

        <Text style={styles.sectionTitle}>Lịch sử đơn hàng</Text>
        </TouchableOpacity>
      </View>
      {/* Lịch sử thanh toán */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Lịch sử thanh toán</Text>
      </View>

      <TouchableOpacity
        style={styles.buttonLogout}
        onPress={() => handleLogout()}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Thiết kế giao diện
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#888",
  },
  infoContainer: {
    marginVertical: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoTitle: {
    fontSize: 16,
    color: "#333",
  },
  infoValue: {
    fontSize: 16,
    color: "#555",
  },
  historySection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  historyText: {
    fontSize: 16,
    color: "#555",
  },
  buttonLogout: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
