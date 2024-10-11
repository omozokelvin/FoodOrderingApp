import { useOrderDetails } from '@/api/orders';
import { useUpdateOrderSubscription } from '@/api/orders/subscriptions';
import OrderItemListItem from '@/components/OrderItemListItem';
import OrderListItem from '@/components/OrderListItem';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default function OrderDetailsScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = +idString;

  const { data: order, isLoading, error } = useOrderDetails(id);

  useUpdateOrderSubscription(id);

  return (
    <View style={{ padding: 10, gap: 20 }}>
      <Stack.Screen options={{ title: isLoading ? 'Order' : `Order #${id}` }} />

      {isLoading && <ActivityIndicator />}

      {!!error && <Text>Failed to fetch</Text>}

      {!order && !isLoading && <Text>Order not found</Text>}

      {!!order && (
        <FlatList
          data={order.order_items}
          renderItem={({ item }) => <OrderItemListItem item={item} />}
          contentContainerStyle={{ gap: 10 }}
          ListHeaderComponent={() => <OrderListItem order={order} />}
        />
      )}
    </View>
  );
}
