import React, { ComponentPropsWithoutRef } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

type Props = {
  id: string;
  label?: string;
  touched?: boolean;
  error?: string;
} & ComponentPropsWithoutRef<typeof TextInput>;

export default function TextField(props: Props) {
  const { label, touched, error, ...textInputProps } = props;
  return (
    <View style={styles.field}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput style={styles.input} {...textInputProps} />

      {touched && error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
  },
  label: {
    color: 'gray',
    fontSize: 16,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
