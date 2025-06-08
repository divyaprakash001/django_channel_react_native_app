import { useEffect, useLayoutEffect } from 'react';
import {
  Animated, SafeAreaView, StatusBar, StyleSheet, Text, View
} from 'react-native';
import React from 'react';
import Title from '../common/Title';

export default function Splash({ navigation }) {

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [])

  const translateY = new Animated.Value(0);
  const duration = 800;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([

        Animated.timing(translateY, {
          toValue: 20,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }).start()
      ])
    )
  }, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
      }}
    >
      <StatusBar barStyle='light-content' />
      <Animated.View style={[{ transform: [{ translateY }] }]}>
        <Title text={"Realtime Chat"} color={"white"} />
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})