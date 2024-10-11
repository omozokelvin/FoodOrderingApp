import { useProducts } from '@/api/products';
import ProductListItem from '@/components/ProductListItem';
import { Stack } from 'expo-router';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default function MenuScreen() {
  const { data: products, error, isLoading } = useProducts();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch products</Text>;
  }

  return (
    <View>
      <Stack.Screen
        options={{
          title: 'Menu',
        }}
      />

      <FlatList
        data={products}
        renderItem={({ item }) => <ProductListItem product={item} />}
        numColumns={2}
        contentContainerStyle={{
          gap: 10,
          padding: 10,
        }}
        columnWrapperStyle={{
          gap: 10,
        }}
      />
    </View>
  );
}
