import { Tables } from '@/database.types';

// export type Tables<T extends keyof Database['public']['Tables']> =
//   Database['public']['Tables'][T]['Row'];

// export type Enums<T extends keyof Database['public']['Enums']> =
//   Database['public']['Enums'][T];

export type PizzaSize = 'S' | 'M' | 'L' | 'XL';

export type CartItem = {
  id: string;
  product: Tables<'products'>;
  product_id: number;
  size: PizzaSize;
  quantity: number;
};

export type OrderStatus = 'New' | 'Cooking' | 'Delivering' | 'Delivered';

export const OrderStatusList: OrderStatus[] = [
  'New',
  'Cooking',
  'Delivering',
  'Delivered',
];

export type Order = Tables<'orders'>;

// {
//   id: number;
//   created_at: string;
//   total: number;
//   user_id: string;
//   status: OrderStatus;
//   order_items?: OrderItem[];
// };

export type OrderItem = {
  id: number;
  product_id: number;
  products: Tables<'products'>;
  order_id: number;
  size: PizzaSize;
  quantity: number;
};

export type Profile = Tables<'profiles'>;
