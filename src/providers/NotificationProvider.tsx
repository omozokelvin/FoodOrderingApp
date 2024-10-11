import { registerForPushNotificationsAsync } from '@/lib/notifications';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import * as Notifications from 'expo-notifications';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function NotificationProvider({ children }: PropsWithChildren) {
  const { profile } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  console.log({
    expoPushToken,
    notification: JSON.stringify(notification, null, 2),
  });

  const savePushToken = async (newToken?: string) => {
    setExpoPushToken(newToken || '');

    if (!newToken) {
      return;
    }

    // console.log('got  herere', newToken, profile?.id);
    // update the token in the database

    await supabase
      .from('profiles')
      .update({
        expo_push_token: newToken,
      })
      .eq('id', profile?.id!);
  };

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        savePushToken(token);
      })
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );

      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return <>{children}</>;
}
