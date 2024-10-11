import AppButton from '@/components/AppButton';
import CartListItem from '@/components/CartListItem';
import { useCart } from '@/providers/CartProvider';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, Platform, Text, View } from 'react-native';

export default function CartScreen() {
  const { items, total, checkout, checkingOut } = useCart();

  return (
    <View style={{ padding: 10 }}>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{
          gap: 10,
        }}
      />

      <Text
        style={{
          marginTop: 20,
          fontSize: 20,
          fontWeight: '500',
        }}
      >
        Total: ${total}
      </Text>

      <AppButton text="Checkout" onPress={checkout} loading={checkingOut} />

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
