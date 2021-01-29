import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { songs } from '../songs';

export default function Player() {
    return (
        <View>
            <Text>{songs[0].title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
