import { FontAwesome } from '@expo/vector-icons';
import { ComponentProps } from 'react';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
export default function TabBarIcon(props: {
  name: ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}
