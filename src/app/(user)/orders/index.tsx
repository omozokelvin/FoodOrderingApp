import { useMyOrders } from '@/api/orders';
import OrderListItem from '@/components/OrderListItem';
import { Stack } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default function OrderScreen() {
  const { data: orders, isLoading, error } = useMyOrders();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch</Text>;
  }

  return (
    <View>
      <Stack.Screen options={{ title: 'Orders' }} />

      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderListItem order={item} />}
        contentContainerStyle={{ padding: 10, gap: 10 }}
      />
    </View>
  );
}