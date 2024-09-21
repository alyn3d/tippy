import React, { useEffect, useState, Suspense } from 'react';
import { useColorScheme } from 'react-native';

import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import * as Network from 'expo-network';

import Home from './src/screens/Home';
import LoadingScreen from './src/screens/LoadingScreen';
import OfflineScreen from './src/screens/OfflineScreen';

// This is used to clear data from storage (testing purposes)
//import {clearAllData} from './src/helpers/asyncStorage';


export default function App() {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [showOffline, setShowOffline] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();

  // clearAllData();
  
  const getOfflineMode = async () => {
    const networkState = await Network.getNetworkStateAsync();
    setIsOffline(!networkState.isInternetReachable);
    setLoading(false);
  }

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

    getOfflineMode();
  }, []);

  useEffect(() => {
    if (loading) return;
    
    if (isOffline) {
      setShowOffline(true);
      setTimeout(() => {
        setIsOffline(false);
      }, 2000);
    } else {
      setShowOffline(false);
    }
  }, [loading, isOffline]);

  const ShowHome = () => {
    return !loading && <Home isOffline={isOffline} />;
  };

  return (
      <ApplicationProvider {...eva} theme={colorScheme === 'light' ? eva.light : eva.dark}>
        <ExpoStatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Suspense fallback={<LoadingScreen />}>
          {showOffline && <OfflineScreen />}
          {loading ? <LoadingScreen /> : <ShowHome />}
        </Suspense>
      </ApplicationProvider>    
  );
};
