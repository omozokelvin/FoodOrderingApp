import AppButton from '@/components/AppButton';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  return (
    <View>
      <Text>Profile</Text>

      <AppButton
        text="Sign out"
        onPress={async () => {
          await supabase.auth.signOut();
          router.push('/(auth)/sign-in');
        }}
      />
    </View>
  );
}
