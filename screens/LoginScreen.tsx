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
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/AuthSlice";
import { fetchCurrentUser } from "../redux/UserSlice";
import { RootState } from "../store";

const LoginScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [token, setToken] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const [isLogin, setIsLogin] = useState(false);
  const dispatch = useDispatch();
  const userCurrent: any = useSelector(
    (state: RootState) => state.users.currentUser
  );

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    };
    getToken();
  }, []);

  useEffect( () => {
    if (isLogin && token) {
      dispatch(fetchCurrentUser());
      navigation.goBack();
    }
  }, [isLogin, token]);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Email và mật khẩu không được bỏ trống.");
      return;
    }
    
    try {
      const action = await dispatch(login({ email, password }));
      if (login.fulfilled.match(action)) {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          setIsLogin(true);
        }
      } else {
        setErrorMessage("Đăng nhập thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi, vui lòng thử lại.");
      console.log(error);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          style={styles.logo}
          source={{
            uri: "https://assets.stickpng.com/thumbs/6160562276000b00045a7d97.png",
          }}
        />
      </View>

      <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
        <View style={styles.centered}>
          <Text style={styles.headerText}>Đăng nhập vào tài khoản của bạn</Text>
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <MaterialIcons style={styles.icon} name="email" size={24} color="gray" />
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
            <AntDesign name="lock1" size={24} color="gray" style={styles.icon} />
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
          <Text>Giữ trạng thái đăng nhập</Text>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    marginTop: 50,
  },
  logo: {
    width: 150,
    height: 100,
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
