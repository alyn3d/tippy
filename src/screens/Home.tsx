import React, { useState, useEffect } from 'react';
import { StyleSheet, Share, Pressable, StatusBar, Linking } from 'react-native';
import { Layout, Text, Input, ButtonGroup, Button, Select, SelectItem, IndexPath, Popover } from '@ui-kitten/components';


export const Home = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<any>(new IndexPath(0));
  const [currencyISO, setCurrencyISO] = useState('');
  const [billValue, setBillValue] = useState<number>(0);
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [people, setPeople] = useState<number>(1);
  const [currencyData, setCurrencyData] = useState<any>({});
  const [visible, setVisible] = useState(false);

  const currencies = ['EUR','USD','RON','BGN','CZK','DKK','GBP','CAD','HUF','PLN','NOK','SEK','TRY'];

  useEffect(() => {
    fetch(`https://api.frankfurter.app/latest?from=${currencyISO}`)
      .then(resp => resp.json())
      .then((data) => {
        setCurrencyData(data.rates);
      })
      .catch(err => console.log(err));
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
    switch (selectedCurrency.row) {
      case 1:
        return 'USD';
        break;
      case 2:
        return 'RON';
        break;
      case 3:
        return 'BGN';
        break;
      case 4:
        return 'CZK';
        break;
      case 5:
        return 'DKK';
        break;
      case 6:
        return 'GBP';
        break;
      case 7:
        return 'CAD';
        break;
      case 8:
        return 'HUF';
        break;
      case 9:
        return 'PLN';
        break;
      case 10:
        return 'NOK';
        break;
      case 11:
        return 'SEK';
        break;
      case 12:
        return 'TRY';
        break;
      default: 
        return 'EUR'
    };
  };

  const shareDialog = () => {
    Share.share({
      message:
        `Our total was ${billValue} ${currencyISO}. Adding a tip of ${tipPercentage}% and splitting the total between ${people} people, you owe exactly ${calculateTotalPerPerson()} ${currencyISO}`,
      title: 'Calculated tips'
    });
  };
  
  const renderExchangeRates = () => {
    let getExchangeValues = currencies.filter( (el) => { return el != currencyISO } );
    //console.log(currencyData);
    return currencyData ? getExchangeValues.map( (item, idx) => {
      let convertedValue = ( billValue * parseFloat(currencyData[item]) ).toFixed(2);
      return <Text style={{display: 'flex', width:110}} category='h6' key={idx}><Text category='label'>{item}</Text>: {convertedValue.split('.')[0].length > 4 ? convertedValue.slice(0, 5) : convertedValue}</Text>;
    }) : null;
  }

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
                  <Pressable onPress={() => Linking.openURL('https://linktr.ee/alyn3d')}>
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
            <SelectItem title='EUR' />
            <SelectItem title='USD' />
            <SelectItem title='RON' />
            <SelectItem title='BGN' />
            <SelectItem title='CZK' />
            <SelectItem title='DKK' />
            <SelectItem title='GBP' />
            <SelectItem title='CAD' />
            <SelectItem title='HUF' />
            <SelectItem title='PLN' />
            <SelectItem title='NOK' />
            <SelectItem title='SEK' />
            <SelectItem title='TRY' />
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