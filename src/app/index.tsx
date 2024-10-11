import AppButton from '@/components/AppButton';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Link, Redirect, Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function IndexScreen() {
  const { session, loading, isAdmin } = useAuth();

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  if (!isAdmin) {
    return <Redirect href="/(user)" />;
  }

  return (
    <View
      style={{ flex: 1, justifyContent: 'center', padding: 10, rowGap: 10 }}
    >
      <Tabs.Screen options={{ headerShown: false }} />

      <Link href={'/(user)'} asChild>
        <AppButton text="User" variant="contained" />
      </Link>

      <Link href={'/(admin)'} asChild>
        <AppButton text="Admin" variant="outlined" />
      </Link>

      <AppButton
        text="Sign out"
        onPress={async () => await supabase.auth.signOut()}
        variant="text"
      />
    </View>
  );
}

// const styles = StyleSheet.create({
//   button: {
//     color: 'red',
//   },
// });
