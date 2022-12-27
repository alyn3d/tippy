import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as eva from '@eva-design/eva';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { ApplicationProvider } from '@ui-kitten/components';
import { Home } from './src/screens/Home';

export default function App() {
  const colorScheme = useColorScheme();
  //console.log(colorScheme);
  useEffect(() => {
    const setNavBarColorScheme = async () => {
      if (colorScheme === 'light') {
        await NavigationBar.setBackgroundColorAsync("white");
        await NavigationBar.setButtonStyleAsync("light");
      } else {
        await NavigationBar.setBackgroundColorAsync("#222B45");
        await NavigationBar.setButtonStyleAsync("dark");
      }
    }

    setNavBarColorScheme();
  }, []);

  return (
      <ApplicationProvider {...eva} theme={colorScheme === 'light' ? eva.light : eva.dark}>
        <ExpoStatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Home />
      </ApplicationProvider>    
  );
};
