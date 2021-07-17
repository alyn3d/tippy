import React, { useState, useEffect } from 'react';
import { StyleSheet, Share, StatusBar } from 'react-native';
import { Layout, Text, Input, ButtonGroup, Button, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import axios from "axios";


export const Home = () => {
  const [selectedCurrency, setSelectedCurrency] = useState(new IndexPath(0));
  const [currencyISO, setCurrencyISO] = useState('');
  const [billValue, setBillValue] = useState(0);
  const [tipPercentage, setTipPercentage] = useState(15);
  const [people, setPeople] = useState(1);
  //Exchange rates
  const [usd, setUsd] = useState(0);
  const [eur, setEur] = useState(0);
  const [lei, setLei] = useState(0);

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
    let percentage = (parseFloat(billValue)/100)*parseInt(tipPercentage);
    let total = ( (parseFloat(billValue) + parseFloat(percentage)) / parseInt(people) ).toFixed(2);
    return isNaN(total) ? 0 : total;
  }

  const calculateTotalTipPerPerson = () => {
    let percentage = (billValue/100)*tipPercentage;
    return (parseFloat(percentage) / parseInt(people)).toFixed(2);
  }
  const getCurrencyISO = () => {
    switch (selectedCurrency.row) {
      case 1:
        return 'USD';
        break;
      case 2:
        return 'LEI';
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

  const fetchData = async () => {
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    //USD
    await axios.get(`https://ec.europa.eu/budg/inforeuro/api/public/monthly-rates?year=${year}&month=${month}&lang=en`)
    .then(res => {
      let data = res.data;
      let romania = data.filter(x => x.isoA3Code == 'RON');
      let usa = data.filter(x => x.isoA3Code == 'USD');
      let eur = data.filter(x => x.isoA3Code == 'EUR')
      console.log(romania, usa, eur);
      setUsd(usa[0].value);
      setLei(romania[0].value);
    })
    .catch(err => console.error('Error Loading Currencies', err));
  };
  useEffect(() => {
    fetchData();
  },[]);

  const exchangeUsd = () => {
    return (billValue * usd).toFixed(2);
  }
  const exchangeLei = () => {
    return (billValue * lei).toFixed(2);
  }
  const exchangeEurToLei = () => {
    return (billValue / lei).toFixed(2);
  }
  const exchangeEurToUsd = () => {
    return (billValue / usd).toFixed(2);
  }

  const renderExchangeRates = () => {
    switch(currencyISO) {
      case 'EUR':
        return (
          <>
            <Text category='h6'>{exchangeUsd()} USD</Text>
            <Text> / </Text>
            <Text category='h6' style={{textAlign:'right'}}>{exchangeLei()} LEI</Text>
          </>
        );
        break;
      case 'USD':
        return (
          <>
            <Text category='h6'>{exchangeEurToUsd()} EUR</Text>
          </>
        );
        break;
      case 'LEI':
        return (
          <>
            <Text category='h6'>{exchangeEurToLei()} EUR</Text>
          </>
        );
        break;
    }
  }

  useEffect(() => {
    setCurrencyISO(getCurrencyISO);
  }, [selectedCurrency]);

  return (
    <Layout style={styles.container}>
    <Layout style={styles.layout} level='1'>
      <Text category='h1' style={{marginBottom:20}}>Tippy<Text category='s2'>(like Clippy but for Tips)</Text></Text>
      <Text>How much is your bill?</Text>
      <Layout style={[styles.row]}>
        <Input
          style={[styles.input, {flex:1, paddingRight:10}]}
          size='large'
          placeholder={`0 ${currencyISO}`}
          keyboardType='phone-pad'
          onChangeText={(e) => setBillValue(e)}
        />
        <Select value={getCurrencyISO()} size='large' selectedIndex={selectedCurrency} onSelect={index => setSelectedCurrency(index)} style={[styles.input, {flex:.5}]}>
          <SelectItem title='EUR' />
          <SelectItem title='USD' />
          <SelectItem title='LEI' />
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
              <Button status='primary' style={{width:150}}>{people} {people != 1 ? 'persons' : 'person'}</Button>
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
          <Text>You are spending</Text>
          <Layout style={{flexDirection:'row'}}>
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
      <Layout style={{alignSelf:'center', justifyContent:'center', alignItems:'center', marginTop:25}}>
        <Text category='h6'> /\_/\ </Text>
        <Text category='h6'>( o.o )</Text>
        <Text category='h6'> {'>'} ^ {'<'} </Text>
      </Layout>
    </Layout>
  </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    margin: 15,
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