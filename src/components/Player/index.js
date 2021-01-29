import React, { useEffect, useRef, useState } from 'react'
import { Animated, SafeAreaView, StyleSheet, Dimensions, View, Text } from 'react-native'
import { songs } from '../../songs';
import Controller from './Controller';

const {width, height} = Dimensions.get('window')

export default function Player() {

    const [songIndex, setSongIndex] = useState(0) 
    const scrollX = useRef(new Animated.Value(0)).current
    const position = useRef(Animated.divide(scrollX, width)).current
    const slider = useRef()
    const [isPlaying, setIsPlaying] = useState(true)

    useEffect(() => {
        scrollX.addListener(({value}) => {
            const toIndex = Math.round(value / width)
            setSongIndex(toIndex)
        })
        // return () => {
        //     scrollX.removeAllListeners()
        // }
    }, [])

    const goNext = () => {
        slider.current.scrollToOffset({
            offset: width * (songIndex + 1)
        })
    }

    const goPrev = () => {
        slider.current.scrollToOffset({
            offset: width * (songIndex - 1)
        })
    }

    const renderItem = ({item, index}) => {
        return(
            <Animated.View
            style={{
                justifyContent: 'center',
                alignItems: "center",
                width: width,
                transform: [
                    {translateX: Animated.multiply(
                        Animated.add(position, -index), -100
                    )}
                ]
            }}>
                <Animated.Image
                source={item.artwork}
                style={{width: 320, height: 320, borderRadius: 8}}
                />
            </Animated.View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* artwork of song */}
            <SafeAreaView style={styles.list}>
                <Animated.FlatList
                ref={slider}
                horizontal
                pagingEnabled
                data={songs}
                renderItem={renderItem}
                keyExtractor={item => 'song' + item.id}
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {x: scrollX}}}],
                    {useNativeDriver: true}
                )}
                />
            </SafeAreaView>

            {/* song detail */}
            <View style={{flex: 0.2}}>
                <Text style={styles.title}>{songs[songIndex].title}</Text>
                <Text style={styles.artist}>{songs[songIndex].artist}</Text>
            </View>
            
            {/* controller */}
            <Controller
            goNext={goNext}
            goPrev={goPrev}
            isPlaying={isPlaying}
            switchIsPlaying={() => setIsPlaying(prev => !prev)}
            style={{flex: 0.2}}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: 'center'
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
