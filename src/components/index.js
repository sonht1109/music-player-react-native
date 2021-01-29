import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { songs } from '../songs';

export default function Player() {
    return (
        <View>
            <Text>{songs[0].title}</Text>
            <Icon name="play-circle-outline" size={20} color='black' />
        </View>
    )
}

const styles = StyleSheet.create({})
