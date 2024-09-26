import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import {WebView} from "react-native-webview";

const VnPayScreen = () => {
  const [loading, setLoading] = useState(true);
  // const [paymentUrl, setPaymentUrl] = useState(
  //   "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=40000000&vnp_Command=pay&vnp_CreateDate=20240926201818&vnp_CurrCode=VND&vnp_ExpireDate=20240926203318&vnp_IpAddr=0%3A0%3A0%3A0%3A0%3A0%3A0%3A1&vnp_Locale=vn&vnp_OrderInfo=Thanh+to%3Fn+%3F%3Fn+h%3F%3Fng+%235&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fv1%2Fpayment%2Fvn-pay-callback&vnp_TmnCode=B392S5MZ&vnp_TxnRef=20201514&vnp_Version=2.1.0&vnp_SecureHash=1d09a7b12301db04ee12ad6df2a579756fbc7a1342b7bd35f15feff9f4327f27afeaf5a966e7ecc716d5602fb425f454670ad4bf744407cfcf85f61775c673a2"
  // );

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "https://reactnative.dev/" }}
        style={{ flex: 1 }}
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
