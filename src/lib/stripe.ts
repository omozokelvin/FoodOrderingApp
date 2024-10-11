import { supabase } from '@/lib/supabase';
import {
  initPaymentSheet,
  presentPaymentSheet,
} from '@stripe/stripe-react-native';
import { Alert } from 'react-native';

// Payments
const fetchPaymentSheetParams = async (amount: number) => {
  // Create payment session for our customer
  const { data, error } = await supabase.functions.invoke('payment-sheet', {
    body: { amount },
  });

  if (data) {
    return data;
  }

  Alert.alert(`Error: ${error?.message ?? 'no data'}`);
  return {};
};

export const initializePaymentSheet = async (amount: number) => {
  console.log('Initializing payment sheet, for: ', amount);
  const { paymentIntent, publishableKey, customer, ephemeralKey } =
    await fetchPaymentSheetParams(amount);

  if (!publishableKey || !paymentIntent) {
    return;
  }

  await initPaymentSheet({
    merchantDisplayName: 'FoodOrderingApp',
    // customerId: customer,
    paymentIntentClientSecret: paymentIntent,
    customerId: customer,
    customerEphemeralKeySecret: ephemeralKey,
    defaultBillingDetails: {
      name: 'Jane Doe',
    },
    returnURL: 'yourapp://payment-result', // Add your return URL here
  });
};

export const openPaymentSheet = async () => {
  const { error } = await presentPaymentSheet();

  if (error) {
    Alert.alert(error.message);
    return false;
  }

  return true;
};
