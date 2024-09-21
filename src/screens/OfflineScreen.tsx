import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';

import { offlineCurrencyDate } from '../data/offlineCurrencyData';
import { getDate } from '../helpers/asyncStorage';

const OfflineScreen = () => {
  const [offlineDate, setOfflineDate] = useState<any>(offlineCurrencyDate);

  useEffect(() => {
    const fetchDate = async () => {
      const date = await getDate();
      console.log(date);
      if (date !== null) {
        setOfflineDate(date);
      }
    };

    fetchDate();
  }, []);

  return (
    <Layout style={styles.container}>
      <Layout>
        <Text category="h1"> /\_/\ </Text>
        <Text category="h1">( o.o )</Text>
        <Text category="h1">
          {" "}
          {">"} ^ {"<"}{" "}
        </Text>
      </Layout>

      <Layout style={styles.warning}>
        <Text category="h6" style={styles.warningText}>
          It looks like you're offline... Using conversion rate data from{" "}
        </Text>
        <Text style={styles.dateText}>
          {offlineDate}
        </Text>
        <Text category="h6" style={styles.disclaimer}>
          If you want to use the latest conversion rates, please connect to the
          Internet.
        </Text>
      </Layout>

      <Text category="h1">Tippy</Text>
    </Layout>
  );
};

export default OfflineScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  warning: {
    width: '80%',
    padding: 25,
  },
  warningText: {
    textAlign: 'center'
  },
  dateText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:25
  },
  disclaimer: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 10
  }
});
