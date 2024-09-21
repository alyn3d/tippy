import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage methods
export const storeData = async (value:any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('offlineCurrencyData', jsonValue);
  } catch (e) {
    console.error(e);
  }
};

export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('offlineCurrencyData');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
  }
};

export const storeDate = async (value:any) => {
  try {
    await AsyncStorage.setItem('offlineCurrencyDate', value);
  } catch (e) {
    console.error(e);
  }
};

export const getDate = async () => {
  try {
    const value = await AsyncStorage.getItem('offlineCurrencyDate');
    return value;
  } catch (e) {
    console.error(e);
  }
};

export const clearAllData = () => {
  AsyncStorage.getAllKeys()
      .then((keys:any) => AsyncStorage.multiRemove(keys))
      .then(() => alert('success'));
};
