import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Spinner, Text } from '@ui-kitten/components';

const LoadingScreen = () => {
  return (
    <Layout style={styles.container}>
      <Layout>
        <Text category='h1'> /\_/\ </Text>
        <Text category='h1'>( o.o )</Text>
        <Text category='h1'> {'>'} ^ {'<'} </Text>
      </Layout>

      <Spinner size='giant' />

      <Text category='h1'>Tippy</Text>
    </Layout>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
});
