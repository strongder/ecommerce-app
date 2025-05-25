import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import axiosInstance from "../api";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/AuthSlice";
import { fetchCurrentUser } from "../redux/UserSlice";
import { RootState } from "../store";

const LoginScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const [isLogin, setIsLogin] = useState(false);
  const [isOtpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [loginEmail, setLoginEmail] = useState(""); // Lưu email đã đăng nhập thành công
  const dispatch = useDispatch();
  const userCurrent: any = useSelector(
    (state: RootState) => state.users.currentUser
  );

  useEffect(() => {
    if (isLogin) {
      dispatch(fetchCurrentUser());
      navigation.navigate("Main");
    }
  }, [isLogin]);

  // Xử lý đếm ngược OTP
  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (isOtpModalVisible && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      closeOtpModal();
      setErrorMessage("Mã OTP đã hết hạn, vui lòng thử lại.");
    }
    return () => clearInterval(countdown);
  }, [isOtpModalVisible, timer]);

  const handleLogin = async () => {
    console.log("Đang xử lý đăng nhập...");
    if (!email || !password) {
      setErrorMessage("Email và mật khẩu không được bỏ trống.");
      return;
    }
    try {
      const action = await dispatch(login({ email, password }));
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        // Đăng nhập thành công, mở modal OTP ngay lập tức
        setLoginEmail(email);
        setOtpModalVisible(true);
        setTimer(60);
        handleSendOtp(email); // Gửi OTP nhưng không chờ
      } else {
        setErrorMessage("Đăng nhập thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi, vui lòng thử lại.");
      console.log(error);
    }
  };

  const handleSendOtp = async (emailToSend: string) => {
    try {

      console.log("Gửi OTP đến email:", emailToSend);
      const res = await axiosInstance.post(
        `/auth/otp/send?email=${encodeURIComponent(emailToSend)}`
      );
      if (res.data.code === 200) {
        setTimer(60);
      } else {
        setErrorMessage("Gửi OTP thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      setErrorMessage("Gửi OTP thất bại, vui lòng thử lại.");
      console.log(error);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length === 6) {
      try {
        const res = await axiosInstance.post(
          `/auth/otp/verify?email=${encodeURIComponent(loginEmail)}&otp=${otp}`
        );
        if (res.data.code === 200) {
          setOtpModalVisible(false);
          setOtp("");
          setTimer(60);
          setIsLogin(true);
        } else {
          setErrorMessage("Xác thực OTP thất bại, vui lòng thử lại.");
          alert("Xác thực OTP thất bại, vui lòng thử lại.");
        }
      } catch (error) {
        setErrorMessage("Xác thực OTP thất bại, vui lòng thử lại.");
        alert("Xác thực OTP thất bại, vui lòng thử lại.");
        console.log(error);
      }
    } else {
      setErrorMessage("Mã OTP không hợp lệ, vui lòng thử lại.");
      alert("Mã OTP không hợp lệ, vui lòng thử lại.");
    }
  };

  const closeOtpModal = () => {
    setOtpModalVisible(false);
    setOtp("");
    setTimer(60);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo}>
        <Image
          style={styles.imageLogo}
          source={require("../assets/logo-ecommerce.png")}
        />
      </View>

      <KeyboardAvoidingView
        behavior="padding"
        style={styles.keyboardAvoidingView}
      >
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <MaterialIcons
              style={styles.icon}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Nhập Email"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <AntDesign
              name="lock1"
              size={24}
              color="gray"
              style={styles.icon}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              style={styles.input}
              placeholder="Nhập mật khẩu"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.forgotPassword}>Quên mật khẩu</Text>
        </View>

        <Pressable onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={styles.registerLink}
        >
          <Text style={styles.registerText}>Chưa có tài khoản? Đăng ký</Text>
        </Pressable>
        {/* <Pressable
          onPress={() => navigation.navigate("WebAuthn")}
          style={styles.registerLink}
        >
          <Text style={styles.registerText}>Đăng nhập bằng vân tay</Text>
        </Pressable> */}
      </KeyboardAvoidingView>

      {/* Modal OTP */}
      {isOtpModalVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập mã OTP</Text>
            <Text style={styles.timerText}>Mã OTP hết hạn sau: {timer}s</Text>
            <TextInput
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={6}
              placeholder="Nhập OTP"
              value={otp}
              onChangeText={setOtp}
            />
            <Pressable style={styles.modalButton} onPress={handleVerifyOtp}>
              <Text style={styles.modalButtonText}>Xác nhận</Text>
            </Pressable>
            <Pressable style={[styles.modalButton, { backgroundColor: '#ccc', marginTop: 10 }]} onPress={closeOtpModal}>
              <Text style={[styles.modalButtonText, { color: '#333' }]}>Huỷ</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Modal OTP styles
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  timerText: { fontSize: 16, color: 'red', marginBottom: 10 },
  otpInput: {
    borderBottomWidth: 1,
    width: '80%',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, width: 120, alignItems: 'center' },
  modalButtonText: { color: 'white', fontWeight: 'bold' },
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    marginTop: 50,
  },
  logo: {
    marginTop: 50,
    width: 300,
    height: 100,
  },
  imageLogo: {
    width: "100%",
    height: "100%",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center", // Center content vertically
  },
  centered: {
    alignItems: "center",
  },
  headerText: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 12,
    color: "#041E42",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  inputWrapper: {
    marginTop: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D0D0D0",
    paddingVertical: 5,
    borderRadius: 5,
  },
  icon: {
    marginLeft: 8,
  },
  input: {
    color: "gray",
    marginVertical: 10,
    width: 300,
    fontSize: 16,
  },
  footer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  forgotPassword: {
    color: "#007FFF",
    fontWeight: "500",
  },
  loginButton: {
    width: 200,
    backgroundColor: "#FEBE10",
    borderRadius: 6,
    padding: 15,
    marginTop: 80,
    alignSelf: "center",
  },
  loginButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 15,
  },
  registerText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
  },
});

export default LoginScreen;
