import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import utils from '../core/utils'

export default function Thumbnail({ url, size }) {
  return (
    <Image
      source={utils.thumbnail(url)}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
      }}
    />
  )
}

const styles = StyleSheet.create({})