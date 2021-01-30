import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Slider from '@react-native-community/slider';
import TrackPlayer, {useTrackPlayerProgress} from 'react-native-track-player'

export default function TrackSlider() {

    const {duration, position} = useTrackPlayerProgress()

    const onSeekTo = (value)=> {
        TrackPlayer.seekTo(value)
    }

    const formatTime = (time) => {
        const min = Math.floor(time / 60)
        const sec = Math.ceil(time - min*60)
        return min + ':' + `${sec < 10 ? '0' + sec : sec}`
    }

    return (
        <View style={{paddingHorizontal: 20}}>
            <Slider
            minimumValue={0}
            maximumValue={duration}
            value={position}
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="#ffffffa4"
            thumbTintColor="#fff"
            onSlidingComplete={onSeekTo}
            />
            <View style={{justifyContent: 'space-between', flexDirection: "row"}}>
                <Text style={styles.time}>{formatTime(position)}</Text>
                <Text style={styles.time}>{formatTime(duration)}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    time: {
        fontSize: 12,
        color: "white"
    }
})
