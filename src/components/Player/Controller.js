import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import TrackPlayer, { usePlaybackState } from 'react-native-track-player';

export default function Controller({ goNext, goPrev, onRepeat }) {

    const [repeat, setRepeat] = useState(0)
    // 0: no repeat
    // 1: repeat one
    // 2: repeat all
    const [shuffle, setShuffle] = useState(false)

    const switchRepeat = () => {
        setRepeat((prev) => {
            if (prev === 2) return 0
            return ++prev
        })
        onRepeat()
    }

    const playbackState = usePlaybackState()
    // 3 : playing
    // 2 : paused
    // 6, 8: loading

    const renderPlayButton = useMemo(() => {
        switch (playbackState) {
            case 3:
                return (
                    <Icon name='pause-outline' color="white" size={45} />
                )
            case 2:
                return (
                    <Icon name='play-outline' color="white" size={45} />
                )
            default:
                return <ActivityIndicator color="white" size="large" />
        }
    }, [playbackState])

    const switchIsPlaying = () => {
        if (playbackState === 3) {
            TrackPlayer.pause();
        } else if (playbackState === 2) {
            TrackPlayer.play();
        }
    }

    return (
        <View style={styles.container}>

            <TouchableOpacity onPress={switchRepeat}>
                <View style={{flexDirection: "row"}}>
                    <Icon
                        name="repeat-outline" color="white" size={22}
                        style={{ opacity: repeat !== 0 ? 1 : 0.4 }} />
                    <Text style={{color: "white", fontSize: 10, opacity: repeat === 1 ? 1 : 0}}>
                        1
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={goPrev}>
                <Icon name="play-back-outline" color="white" size={45} />
            </TouchableOpacity>

            <TouchableOpacity onPress={switchIsPlaying}>
                {renderPlayButton}
            </TouchableOpacity>

            <TouchableOpacity onPress={goNext}>
                <Icon name="play-forward-outline" color="white" size={45} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShuffle(prev => !prev)}>
                <Icon
                    name="shuffle-outline" color="white" size={22}
                    style={{ opacity: shuffle ? 1 : 0.4 }} />
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: 'center',
        // backgroundColor: "white"
    }
})
