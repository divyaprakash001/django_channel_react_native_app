import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  StatusBar,
} from 'react-native';

import './src/core/fontawesome'

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './src/screens/Splash';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import Home from './src/screens/Home';
import Message from './src/screens/Message';
import Search from './src/screens/Search';
import useGlobal from './src/core/global';

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  }
}

const Stack = createNativeStackNavigator();

function App() {

  const initialized = useGlobal(state => state.initialized)
  const authenticated = useGlobal(state => state.authenticated)
  const init = useGlobal(state => state.init)

  // const [initialized, setInitialized] = useState(true)
  // const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    init()
  }, [])



  return (
    <NavigationContainer theme={LightTheme}>
      <StatusBar barStyle='dark-content' />

      <Stack.Navigator>
        {!initialized ? (
          <>
            <Stack.Screen name='Splash' component={Splash} />
          </>
        ) : !authenticated ? (
          <>
            <Stack.Screen name='SignIn' component={SignIn} />
            <Stack.Screen name='SignUp' component={SignUp} />
          </>
        ) : (

          <>
            <Stack.Screen name='Home' component={Home} />
            <Stack.Screen name='Search' component={Search} />
            <Stack.Screen name='Message' component={Message} />
          </>
        )}




      </Stack.Navigator>

    </NavigationContainer >
  );
}

const styles = StyleSheet.create({
  splashSection: {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
  },
})

export default App;
