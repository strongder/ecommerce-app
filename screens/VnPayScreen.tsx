import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import WebView from "react-native-webview";

const VnPayScreen = ({ route, navigation}: any) => {
  const { paymentUrl } = route.params;
  const [loading, setLoading] = useState(true);
  

  const handleNavigationStateChange = (navState: any) => {
    console.log("Navigation State:", navState);

    // Kiểm tra xem có chuyển hướng đến URL callback không
    if (navState.url.includes('vnpay-callback')) {

      const urlParams = new URLSearchParams(navState.url.split('?')[1]);
      const paymentStatus = urlParams.get('vnp_ResponseCode');
      
      if (paymentStatus === '00') {
        Alert.alert("Thông báo", "Thanh toán thành công!", [
          { text: "OK", onPress: () => navigation.goBack() } // Trở lại màn hình trước
        ]);
      } else {
        Alert.alert("Thông báo", "Thanh toán thất bại!", [
          { text: "OK", onPress: () => navigation.goBack() } // Trở lại màn hình trước
        ]);
      }
    }
  };

  return (
    <View style={styles.container}>
    {loading && <ActivityIndicator size="large" color="#0000ff" />}
    <WebView
      source={{ uri: paymentUrl }}
      style={styles.webview}
      onLoadStart={() => setLoading(true)} // Bắt đầu tải
      onLoadEnd={() => setLoading(false)} // Tải xong
      onHttpError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn("HTTP Error: ", nativeEvent);
      }}
      onNavigationStateChange={handleNavigationStateChange} // Xử lý thay đổi trạng thái điều hướng
    />
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
});

export default VnPayScreen;
