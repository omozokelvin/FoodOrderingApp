import AppButton from '@/components/AppButton';
import TextField from '@/components/TextField';
import AppColors from '@/constants/AppColors';
import { supabase } from '@/lib/supabase';
import { Link, Stack } from 'expo-router';
import { FormikProvider, useFormik } from 'formik';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import * as Yup from 'yup';

type Formik = {
  email: string;
  password: string;
};

export default function SignInScreen() {
  const formik = useFormik<Formik>({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object().shape({
      email: Yup.string().required('Name is required'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password should be at least 6 characters'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);

        const { email, password } = values;

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw new Error(error?.message);
        }

        resetForm();
      } catch (error) {
        Alert.alert((error as Error)?.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    handleSubmit,
    touched,
    errors,
    isSubmitting,
    values,
    handleChange,
    handleBlur,
  } = formik;

  return (
    <FormikProvider value={formik}>
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Sign in' }} />

        <TextField
          id="email"
          label="Email"
          placeholder="Email"
          value={values.email}
          touched={touched?.email}
          error={errors?.email}
          onChangeText={handleChange('email')}
          onBlur={handleBlur('email')}
        />

        <TextField
          id="password"
          label="Password"
          placeholder="Password"
          value={values.password}
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
          touched={touched.password}
          error={errors.password}
          secureTextEntry
        />

        <AppButton
          text={'Sign in'}
          onPress={() => handleSubmit()}
          loading={isSubmitting}
        />

        <Link style={styles.textButton} href="/sign-up">
          Create an account
        </Link>
      </View>
    </FormikProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: AppColors.light.tint,
    marginVertical: 10,
  },
});
