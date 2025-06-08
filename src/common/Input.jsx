import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

export default function Input({ placeholder, value, setValue, error, setError, secureTextEntry = false }) {
  return (
    <View>
      {
        error && (
          <Text
            style={{
              color: error ? '#ff5555' : '#70747a',
              marginTop: 6,
              marginBottom: -3,
              paddingLeft: 16
            }}
          >
            {error}
          </Text>
        )
      }
      <TextInput
        autoCapitalize='none'
        autoComplete='off'
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor="#fff"
        onChangeText={text => {
          setValue(text)
          if (error) {
            setError('')
          }
        }}
        value={value}

        style={{
          backgroundColor: '#190733',
          borderWidth: 1,
          borderColor: error ? '#ff5555' : 'transparent',
          borderRadius: 12,
          height: 52,
          paddingHorizontal: 16,
          fontSize: 14,
          marginTop: 10,
          color: '#fff',
        }} />
    </View>
  )
}

const styles = StyleSheet.create({})