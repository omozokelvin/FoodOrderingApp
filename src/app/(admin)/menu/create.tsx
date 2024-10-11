import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from '@/api/products';
import AppButton from '@/components/AppButton';
import { defaultPizzaImage } from '@/components/ProductListItem';
import RemoteImage from '@/components/RemoteImage';
import TextField from '@/components/TextField';
import AppColors from '@/constants/AppColors';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import { randomUUID } from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FormikProvider, useFormik } from 'formik';
import React from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';

type Formik = {
  name: string;
  price: string;
  image: string | null;
};

export default function CreateProductScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = +idString;

  const isUpdating = !!id;

  const { data: product } = useProduct(id);
  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const router = useRouter();

  const formik = useFormik<Formik>({
    enableReinitialize: true,
    initialValues: {
      name: product?.name || '',
      price: product?.price ? product.price.toString() : '',
      image: product?.image || null,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Name is required'),
      price: Yup.number()
        .typeError('Price must be a number')
        .required('Price is required')
        .positive('Price must be a positive number'),
      image: Yup.string().nullable(),
    }),
    onSubmit: async (values, { setSubmitting, resetForm, setFieldValue }) => {
      // debugger;
      setSubmitting(true);

      if (values.image?.startsWith('file://')) {
        const imagePath = await uploadImage(values?.image!);
        values.image = imagePath;
        setFieldValue('image', imagePath);
      }

      const options = {
        onSuccess: () => {
          setSubmitting(false);
          resetForm();
          router.back();
        },
      };

      if (!isUpdating) {
        insertProduct(
          {
            name: values.name,
            price: parseFloat(values.price),
            image: values.image,
          },
          options
        );

        return;
      }

      updateProduct(
        {
          id,
          name: values.name,
          price: parseFloat(values.price),
          image: values.image,
        },
        options
      );
    },
  });

  const {
    handleSubmit,
    touched,
    errors,
    isSubmitting,
    values,
    setFieldValue,
    handleChange,
    handleBlur,
    setSubmitting,
    resetForm,
  } = formik;

  // console.log({ isSubmitting, errors, values });

  const uploadImage = async (image: string) => {
    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: 'base64',
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = 'image/png';
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, decode(base64), { contentType });

    // console.error({ error });

    if (!data?.path) {
      Alert.alert(error?.message || 'Failed to upload image');
      return '';
    }

    return data.path;
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!!result?.canceled) {
      return;
    }

    // const imagePath = await uploadImage(result.assets[0].uri);

    // console.log({ imagePath });

    setFieldValue('image', result.assets[0].uri);

    // setFieldValue('image', result.assets[0].uri);
  };

  const onDelete = () => {
    setSubmitting(true);

    deleteProduct(id, {
      onSuccess: () => {
        setSubmitting(false);
        resetForm();

        router.replace('/(admin)');
      },
    });
  };

  const confirmDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this product', [
      {
        text: 'Cancel',
      },
      {
        text: 'Delete',
        onPress: onDelete,
        style: 'destructive',
      },
    ]);
  };

  return (
    <FormikProvider value={formik}>
      <View style={styles.container}>
        <Stack.Screen
          options={{ title: isUpdating ? 'Update Product' : 'Create Product' }}
        />

        {values.image?.startsWith('file://') ? (
          <Image
            source={{ uri: values.image || defaultPizzaImage }}
            style={styles.image}
          />
        ) : (
          <RemoteImage
            path={values.image}
            fallback={defaultPizzaImage}
            style={styles.image}
          />
        )}

        <Text style={styles.textButton} onPress={pickImage}>
          Select image
        </Text>

        <TextField
          id="name"
          label="Name"
          placeholder="Name"
          value={values.name}
          touched={touched?.name}
          error={errors?.name}
          onChangeText={handleChange('name')}
          onBlur={handleBlur('name')}
        />

        <TextField
          id="price"
          label="Price ($)"
          placeholder="9.99"
          keyboardType="numeric"
          value={values.price}
          onChangeText={handleChange('price')}
          onBlur={handleBlur('price')}
          touched={touched.price}
          error={errors.price}
        />

        <AppButton
          text={isUpdating ? 'Update' : 'Create'}
          onPress={() => handleSubmit()}
          loading={isSubmitting}
        />

        {isUpdating && (
          <Text style={styles.textButton} onPress={confirmDelete}>
            Delete
          </Text>
        )}
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
    color: AppColors.light.error,
    marginVertical: 10,
  },
});
