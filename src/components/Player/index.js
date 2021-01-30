import React, { useEffect, useRef, useState } from 'react'
import { Animated, SafeAreaView, StyleSheet, Dimensions, View, Text } from 'react-native'
import { songs } from '../../songs';
import Controller from './Controller';
import TrackSlider from './TrackSlider';
import TrackPlayer, { CAPABILITY_PAUSE, CAPABILITY_PLAY, CAPABILITY_SKIP_TO_NEXT, CAPABILITY_SKIP_TO_PREVIOUS } from 'react-native-track-player'
import TrackPlayerEvents from 'react-native-track-player/lib/eventTypes';

const { width } = Dimensions.get('window')

export default function Player() {

    const [songIndex, setSongIndex] = useState(0)

    const scrollX = useRef(new Animated.Value(0)).current
    const position = useRef(Animated.divide(scrollX, width)).current
    const slider = useRef(null)
    const index = useRef(0);
    const isPlayerReady = useRef(false);
    const isItFromUser = useRef(true)

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
                    // controls on notification tab
                    capabilities: [
                        CAPABILITY_PLAY,
                        CAPABILITY_PAUSE,
                        CAPABILITY_SKIP_TO_NEXT,
                        CAPABILITY_SKIP_TO_PREVIOUS,
                    ],
                });
                TrackPlayer.addEventListener(TrackPlayerEvents.PLAYBACK_TRACK_CHANGED, async () => {
                    const trackId = (await TrackPlayer.getCurrentTrack()) - 1
                    console.log('trackId', trackId, 'index', index.current);
                    // trackId can be -1 when queue is loading
                    if (trackId !== index.current && trackId > 0) {
                        setSongIndex(trackId)
                        isItFromUser.current = false
                        if (trackId > index.current) {
                            goNext()
                        }
                        else {
                            goPrev()
                        }
                        isItFromUser.current = true;
                    }
                })

                // interrupt when sound is playing from other app
                // go with alwaysPauseOnInterruption: true
                TrackPlayer.addEventListener(TrackPlayerEvents.REMOTE_DUCK, e => {
                    if(e.paused){
                        TrackPlayer.pause()
                    }
                    else TrackPlayer.play()
                })
            })
            .catch(err => console.log(err))

        //fire when no songs is in queue
        return () => {
            scrollX.removeAllListeners()
            TrackPlayer.destroy()
            exitPlayer()
        }
    }, [])

    useEffect(() => {
        if(isPlayerReady.current && isItFromUser.current){
            TrackPlayer.skip(songs[songIndex].id)
            .then(() => {
                console.log('track changed')
            })
            .catch(err => console.log(err))
        }
        index.current = songIndex;
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

    const exitPlayer = async () => {
        try {
          await TrackPlayer.stop();
        } catch (error) {
          console.error('exitPlayer', error);
        }
      };

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
    // console.log('song', songIndex)

    return (
        <SafeAreaView style={styles.container}>
            {/* artwork of song */}
            <SafeAreaView style={styles.list}>
                <Animated.FlatList
                    ref={slider}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    scrollEventThrottle={16}
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
