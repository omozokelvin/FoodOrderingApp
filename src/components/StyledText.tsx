import { AppText } from '@/components/Themed';
import { TextProps } from 'react-native';

export function MonoText(props: TextProps) {
  return (
    <AppText {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />
  );
}
