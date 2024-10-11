import { useAdminOrders } from '@/api/orders';
import { useInsertOrderSubscription } from '@/api/orders/subscriptions';
import OrderListItem from '@/components/OrderListItem';
import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default function OrdersScreen() {
  const {
    data: orders,
    error,
    isLoading,
  } = useAdminOrders({ archived: false });

  useInsertOrderSubscription();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch</Text>;
  }

  return (
    <View>
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderListItem order={item} />}
        contentContainerStyle={{ padding: 10, gap: 10 }}
      />
    </View>
  );
}
