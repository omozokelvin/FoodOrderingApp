import AppColors from '@/constants/AppColors';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type Props = {
  text: string;
  loading?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  textColor?: string;
  // styles?: ViewStyle;
  // colors?: 'primary' | 'error' | 'success' | 'warning' | 'info';
} & ComponentPropsWithoutRef<typeof Pressable>;

const AppButton = forwardRef<View | null, Props>(
  ({ text, loading, variant = 'contained', ...pressableProps }, ref) => {
    const getContainerStyle = (): ViewStyle => {
      const mapper = {
        contained: styles.containedContainer,
        outlined: styles.outlinedContainer,
        text: styles.textContainer,
      };

      return { ...styles.container, ...mapper[variant] };
    };

    const getTextStyle = (): TextStyle => {
      const mapper = {
        contained: styles.containedText,
        outlined: styles.outlinedText,
        text: styles.text,
      };

      return { ...styles.text, ...mapper[variant] };
    };

    return (
      <Pressable
        ref={ref}
        {...pressableProps}
        style={getContainerStyle()}
        onPress={!loading ? pressableProps?.onPress : undefined}
        disabled={!!pressableProps?.disabled || loading}
      >
        {loading ? (
          <ActivityIndicator
            style={styles.spinner}
            color={variant === 'contained' ? '#fff' : AppColors.light.tint}
          />
        ) : (
          <Text style={getTextStyle()}>{text}</Text>
        )}
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 100,
    marginVertical: 10,
  },
  containedContainer: {
    backgroundColor: AppColors.light.tint,
  },
  outlinedContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: AppColors.light.tint,
  },
  textContainer: {
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.light.tint,
  },
  containedText: {
    color: 'white',
  },
  outlinedText: {
    color: AppColors.light.tint,
  },
  spinner: {
    height: 20,
  },
});

export default AppButton;
