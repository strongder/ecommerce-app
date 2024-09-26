import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const notifications = [
    { id: '1', message: 'Đơn hàng của bạn đã được giao!', type: 'order' },
    { id: '2', message: 'Giảm giá 20% cho sản phẩm mới!', type: 'promotion' },
    { id: '3', message: 'Sản phẩm bạn yêu thích đã có hàng!', type: 'stock' },
];

const NotificationScreen = ({ navigation }: any) => {
    const handleNotificationPress = (type: any) => {
        // Chuyển tiếp đến trang chi tiết tương ứng
        navigation.navigate(type === 'order' ? 'OrderDetail' : 'PromotionDetail');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thông báo</Text>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleNotificationPress(item.type)} style={styles.notificationItem}>
                        <Text style={styles.notificationText}>{item.message}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 30,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    notificationItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    notificationText: {
        fontSize: 16,
    },
});

export default NotificationScreen;