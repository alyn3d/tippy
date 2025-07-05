import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Share, Pressable, StatusBar, Linking } from 'react-native';
import { Layout, Text, Input, ButtonGroup, Button, Select, SelectItem, IndexPath, Popover } from '@ui-kitten/components';

// Helpers
import { offlineCurrencyData } from '../data/offlineCurrencyData';
import { fetchAllCurrenciesData } from '../helpers/getAllCurrencyData';
import { storeData, getData, storeDate, getDate } from '../helpers/asyncStorage';
import { getCurrentFormattedDate } from '../helpers/getFormattedDate';

interface HomeProps {
  isOffline: boolean
};

const Home: React.FC<HomeProps> = ({ isOffline }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<any>(new IndexPath(0));
  const [currencyISO, setCurrencyISO] = useState('');
  const [billValue, setBillValue] = useState<number>(0);
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [people, setPeople] = useState<number>(1);
  const [currencyData, setCurrencyData] = useState<any>({});
  const [offlineCurrencies, setOfflineCurrencies] = useState<any>(offlineCurrencyData);
  const [visible, setVisible] = useState(false);

  const currencies:string[] = ['EUR','USD','RON','BGN','CZK','DKK','GBP','CAD','HUF','PLN','NOK','SEK','TRY'];

  // Get the latest conversion rates for offline use
  useEffect(() => {
    const fetchOfflineData = async () => {
      const offlineCurrencyDataForAsyncStorage = await fetchAllCurrenciesData(currencies);

      storeData(offlineCurrencyDataForAsyncStorage);
      storeDate(getCurrentFormattedDate());
    }

    const initializeData = async () => {
      if (!isOffline) {
        await fetchOfflineData();
      }

      if (isOffline && await getData() !== null) {
        setOfflineCurrencies(await getData());
        storeDate(await getDate());
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (isOffline) {
      setCurrencyData(offlineCurrencies[currencyISO]);
    } else {
      fetch(`https://api.frankfurter.app/latest?from=${currencyISO}`)
      .then(resp => resp.json())
      .then((data) => {
        setCurrencyData(data.rates);
      })
      .catch(err => console.error(err));
    }
  }, [currencyISO]);

  const morePeople = () => {
    setPeople(people + 1);
  }
  const lessPeople = () => {
    people != 1 ? setPeople(people - 1) : null;
  }

  const biggerTip = () => {
    setTipPercentage(tipPercentage + 1);
  }
  const smallerTip = () => {
    tipPercentage != 0 ? setTipPercentage(tipPercentage - 1) : null;
  }

  const calculateTotalPerPerson = () => {
    let percentage = (billValue/100)*tipPercentage;
    let total:number = Number(( (billValue + percentage) / people ).toFixed(2));
    return isNaN(total) ? 0 : total;
  }

  const calculateTotalTipPerPerson = () => {
    let percentage:number = (billValue/100)*tipPercentage;
    return Number((percentage / people).toFixed(2));
  }
  const getCurrencyISO = () => {
    return currencies[selectedCurrency.row];
  };

  const shareDialog = () => {
    Share.share({
      message:
        `Our total was ${billValue} ${currencyISO}. Adding a tip of ${tipPercentage}% and splitting the total between ${people} people, you owe exactly ${calculateTotalPerPerson()} ${currencyISO}`,
      title: 'Calculated tips'
    });
  };
  
  const renderExchangeRates = useCallback(() => {
    let getExchangeValues = currencies.filter((el: any) => el !== currencyISO);
  
    // Prevent rendering until currencyData is available and has the required rates
    if (!currencyData || Object.keys(currencyData).length === 0) return null;

    return getExchangeValues.map((item: any, idx: number) => {
      // Only render if the rate exists for this currency
      const rate = parseFloat(currencyData[item]);
      if (isNaN(rate)) return null;
      const convertedValue = (billValue * rate).toFixed(2);
      return (
      <Text style={{ display: 'flex', width: 110 }} category="h6" key={idx}>
        <Text category="label">{item}</Text>:
        {convertedValue.split('.')[0].length > 4 ? convertedValue.slice(0, 5) : convertedValue}
      </Text>
      );
    });
  }, [currencyData, currencies, currencyISO, billValue]);

  useEffect(() => {
    setCurrencyISO(getCurrencyISO);
  }, [selectedCurrency]);

  const renderCat = () => {
    return (
      <Pressable onPress={() => setVisible(true)}>
        <Text category='h6'> /\_/\ </Text>
        <Text category='h6'>( o.o )</Text>
        <Text category='h6'> {'>'} ^ {'<'} </Text>
      </Pressable>
    )
  };

  return (
    <Layout style={styles.container}>
      <Layout style={styles.layout} level='1'>
        <Layout style={{display:'flex', flexDirection:'row', alignSelf:'center', justifyContent:'space-evenly', alignItems:'center', marginTop:5}}>
          <Text category='h1' style={{display:'flex', marginBottom:20,marginRight:25,alignSelf:'center', justifyContent:'center', alignItems:'center'}}>Tippy<Text category='s2'>(like Clippy but for Tips)</Text></Text>
            <Popover
              visible={visible}
              anchor={renderCat}
              onBackdropPress={() => setVisible(false)}>
                <Layout>
                  <Pressable onPress={() => Linking.openURL('https://alinion.dev')}>
                    <Text style={{padding:20}}>Find me on the web! 😻</Text>
                  </Pressable>
                </Layout>
            </Popover>                  
        </Layout>
        <Text>How much is your bill?</Text>
        <Layout style={[styles.row]}>
          <Input
            style={[styles.input, {flex:1, paddingRight:10}]}
            size='large'
            placeholder={`0 ${currencyISO}`}
            keyboardType='phone-pad'
            onChangeText={(e) => setBillValue(Number(e))}
          />
          <Select value={getCurrencyISO()} size='large' selectedIndex={selectedCurrency} onSelect={index => {setBillValue(0); setSelectedCurrency(index)}} style={[styles.input, {flex:.5}]}>
            {currencies.map((item:string) => <SelectItem key={item} title={item} />)}
          </Select>
        </Layout>
        <Layout style={{flexDirection:'column', alignSelf:'center'}}>
          <Text>Tip percentage:</Text>
          <Layout style={styles.row}>
              <ButtonGroup style={styles.buttonGroup} appearance='outline'>
                <Button onPress={smallerTip}>-</Button>
                <Button status='primary' style={{width:150}}>{tipPercentage + ' %'}</Button>
                <Button onPress={biggerTip}>+</Button>
              </ButtonGroup>
          </Layout>
        </Layout>
        <Layout style={{flexDirection:'column', alignSelf:'center'}}>
          <Text>Split bill between:</Text>
          <Layout style={styles.row}>
              <ButtonGroup style={styles.buttonGroup} appearance='outline'>
                <Button onPress={lessPeople}>-</Button>
                <Button status='primary' style={{width:150}}>{`${people} ${people != 1 ? 'persons' : 'person'}`}</Button>
                <Button onPress={morePeople}>+</Button>
              </ButtonGroup>
          </Layout>
        </Layout>
        <Layout style={styles.rowSpaceBetween}>
          <Layout style={[styles.center, styles.flex1]}>
            <Text>Total per person</Text>
            <Text category='h3'>{calculateTotalPerPerson()} {currencyISO}</Text>
          </Layout>
          <Layout style={[styles.center, styles.flex1]}>
            <Text style={{textAlign:'right'}}>Total tip per person</Text>
            <Text category='h3' style={{textAlign:'right'}}>{calculateTotalTipPerPerson()} {currencyISO}</Text>
          </Layout>
        </Layout>
        <Layout style={{alignSelf:'center', justifyContent:'center', alignItems:'center', marginTop:15}}>
          <Layout>
            <Text>Your bill was equal to</Text>
            <Layout style={{flexDirection:'row', width:'100%', flexWrap:'wrap', marginTop:5}}>
              {
                renderExchangeRates()
              }
            </Layout>
          </Layout>
        </Layout>
        <Layout style={{flexDirection:'column', alignSelf:'stretch'}}>
          <Button size='large' onPress={shareDialog} style={[styles.center, {marginTop:35, flexDirection:'row'}]}>
            Share with friend
          </Button>
        </Layout>
        <Text category='c2' style={{alignSelf:'center'}}>Simply hit the button and send your friend all the details.</Text>
      </Layout>
    </Layout>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    alignSelf: 'flex-start'
  },
  layout: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: StatusBar.currentHeight
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  center: {
    justifyContent: 'center'
  },
  flex1: {
    flex: 1
  },
  input: {
    marginVertical: 2,
    alignSelf: 'center'
  },
  buttonGroup: {
    margin: 2,
  },
});