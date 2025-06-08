import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Title({ text, color }) {
  return (
    <View>
      <Text style={{
        color: color,
        textAlign: 'center',
        fontSize: 48,
        fontFamily: 'LeckerliOne-Regular',
      }}>
        {text}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({})