import { useInsertOrderItems } from '@/api/order-items';
import { useInsertOrder } from '@/api/orders';
import { Tables } from '@/database.types';
import { initializePaymentSheet, openPaymentSheet } from '@/lib/stripe';
import { CartItem } from '@/types';
import { randomUUID } from 'expo-crypto';
import { useRouter } from 'expo-router';
import { PropsWithChildren, createContext, useContext, useState } from 'react';

type Product = Tables<'products'>;

type CartType = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem['size']) => void;
  updateQuantity: (itemId: string, quantity: -1 | 1) => void;
  total: number;
  checkout: () => void;
  checkingOut: boolean;
};

const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {},
  checkingOut: false,
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkingOut, setCheckingOut] = useState(false);

  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();

  const router = useRouter();

  const updateQuantity = (itemId: string, quantity: -1 | 1) => {
    const updatedItems = items
      .map((item) =>
        item.id !== itemId
          ? item
          : {
              ...item,
              quantity: item.quantity + quantity,
            }
      )
      .filter((item) => item.quantity > 0);

    setItems(updatedItems);
  };

  const addItem = (product: Product, size: CartItem['size']) => {
    const existingItem = items.find(
      (item) => item?.product?.id === product?.id && item.size === size
    );

    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }

    // if already in cart, increase quantity
    const newCartItem: CartItem = {
      id: randomUUID(), //generate a unique id
      product,
      product_id: product.id,
      size,
      quantity: 1,
    };

    setItems((prevItems) => [newCartItem, ...prevItems]);
  };

  const total = items.reduce(
    (acc, item) => (acc += item.product.price * item.quantity),
    0
  );

  const clearCart = () => {
    setItems([]);
  };

  const checkout = async () => {
    setCheckingOut(true);

    await initializePaymentSheet(Math.floor(total * 100));

    const paid = await openPaymentSheet();

    if (paid) {
      insertOrder(
        { total },
        {
          onSuccess: saveOrderItems,
        }
      );
    }

    setCheckingOut(false);
  };

  const saveOrderItems = (order: Tables<'orders'>) => {
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      size: item.size,
    }));

    insertOrderItems(orderItems, {
      onSuccess: () => {
        clearCart();
        router.replace(`/(user)/orders/${order?.id}`);
      },
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        total,
        checkout,
        checkingOut,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartProvider;
