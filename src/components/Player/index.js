import React, { useEffect, useRef, useState } from 'react'
import { Animated, SafeAreaView, StyleSheet, Dimensions, View, Text } from 'react-native'
import { songs } from '../../songs';
import Controller from './Controller';
import TrackSlider from './TrackSlider';
import TrackPlayer from 'react-native-track-player'
import TrackPlayerEvents from 'react-native-track-player/lib/eventTypes';

const { width } = Dimensions.get('window')

export default function Player() {

    const [songIndex, setSongIndex] = useState(0)

    const scrollX = useRef(new Animated.Value(0)).current
    const position = useRef(Animated.divide(scrollX, width)).current
    const slider = useRef(null)
    const index = useRef(0);
    const isPlayerReady = useRef(false);

    useEffect(() => {
        scrollX.addListener(({ value }) => {
            const toIndex = Math.round(value / width)
            setSongIndex(toIndex)
        })
        TrackPlayer.setupPlayer()
            .then(async () => {
                console.log('player ready')
                await TrackPlayer.reset()
                await TrackPlayer.add([...songs])
                await TrackPlayer.skip(songs[songIndex].id)
                TrackPlayer.play()
                isPlayerReady.current = true

                TrackPlayer.updateOptions({
                    stopWithApp: true,
                    alwaysPauseOnInterruption: true,
                    // capabilities: [
                    //     Capability.Play,
                    //     Capability.Pause,
                    //     Capability.SkipToNext,
                    //     Capability.SkipToPrevious,
                    // ],
                });
                TrackPlayer.addEventListener(TrackPlayerEvents.PLAYBACK_TRACK_CHANGED, async () => {
                    // console.log('song end ')
                    const trackId = (await TrackPlayer.getCurrentTrack()) - 1
                    console.log('trackId', trackId, 'index', index.current);
                    // trackId can be -1 queue is loading
                    if (trackId !== index.current && trackId > 0) {
                        setSongIndex(trackId)
                        if (trackId > index.current) {
                            goNext()
                        }
                        else {
                            goPrev()
                        }
                    }
                })
            })
            .catch(err => console.log(err))

        // return () => {
        //     scrollX.removeAllListeners()
        //     TrackPlayer.destroy()
        // }
    }, [])

    useEffect(() => {
        if(isPlayerReady.current){
            TrackPlayer.skip(songs[songIndex].id)
            .then(() => {
                console.log('track changed')
            })
            .catch(err => console.log(err))
            index.current = songIndex;
        }
    }, [songIndex])

    const goNext = async() => {
        try{
            slider.current.scrollToOffset({
                offset: width * (songIndex + 1)
            })
            await TrackPlayer.play();
        }
        catch(err){
            console.log(err)
        }
    }

    const goPrev = async() => {
        try{
            slider.current.scrollToOffset({
                offset: width * (songIndex - 1)
            })
            await TrackPlayer.play();
        }
        catch(err){
            console.log(err)
        }
    }

    const renderItem = ({ item, index }) => {
        return (
            <Animated.View
                style={{
                    justifyContent: 'center',
                    alignItems: "center",
                    width: width,
                    transform: [
                        {
                            translateX: Animated.multiply(
                                Animated.add(position, -index), -100
                            )
                        }
                    ]
                }}>
                <Animated.Image
                    source={item.artwork}
                    style={{ width: 320, height: 320, borderRadius: 8 }}
                />
            </Animated.View>
        )
    }
    // console.log('songIndex', songIndex)

    return (
        <SafeAreaView style={styles.container}>
            {/* artwork of song */}
            <SafeAreaView style={styles.list}>
                <Animated.FlatList
                    ref={slider}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    pagingEnabled
                    data={songs}
                    renderItem={renderItem}
                    keyExtractor={item => 'song' + item.id}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: true }
                    )}
                />
            </SafeAreaView>

            {/* song detail */}
            <View style={{ flex: 0.15 }}>
                <Text style={styles.title}>
                    {songs[songIndex].title}
                </Text>
                <Text style={styles.artist}>
                    {songs[songIndex].artist}
                </Text>
            </View>

            {/* slider */}
            <View style={{ flex: 0.1 }}>
                <TrackSlider
                />
            </View>

            {/* controller */}
            <Controller
                goNext={goNext}
                goPrev={goPrev}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        flex: 0.6,
    },
    title: {
        fontSize: 30,
        color: "white",
        fontWeight: '700',
        textAlign: "center"
    },
    artist: {
        fontSize: 16,
        color: "white",
        textAlign: "center",
        opacity: 0.7
    }
})
