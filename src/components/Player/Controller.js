import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export default function Controller({goNext, goPrev, isPlaying, switchIsPlaying}) {
    return (
        <View style={styles.container}>

            <TouchableOpacity>
                <Icon
                name="repeat-outline" color="white" size={22}
                style={{opacity: 0.5}} />
            </TouchableOpacity>

            <TouchableOpacity onPress={goPrev}>
                <Icon name="play-back-outline" color="white" size={45} />
            </TouchableOpacity>

            <TouchableOpacity onPress={switchIsPlaying}>
                <Icon
                name={isPlaying ? 'pause-outline' : 'play-outline'}
                color="white"
                size={45} />
            </TouchableOpacity>

            <TouchableOpacity onPress={goNext}>
                <Icon name="play-forward-outline" color="white" size={45} />
            </TouchableOpacity>

            <TouchableOpacity>
                <Icon
                name="shuffle-outline" color="white" size={22}
                style={{opacity: 0.5}} />
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: 'center'
    }
})
