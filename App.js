/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Player from './src/components/Player/index';

export default function App() {
  return (
    <View style={{flex: 1, backgroundColor: "#1a1a1a"}}>
      <Player />
    </View>
  )
}

// const styles = StyleSheet.create({})