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
  const repeat = useRef(0)

  useEffect(() => {
    scrollX.addListener(({ value }) => {
      const toIndex = Math.round(value / width)
      setSongIndex(toIndex)
    })
    TrackPlayer.setupPlayer()
      .then(async () => {
        console.log('Player ready')
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
          // console.log('playbackChange', e)
          const trackId = (await TrackPlayer.getCurrentTrack()) - 1
          // currentTrack can be 0 when queue is loading
          console.log('trackID ', trackId, 'current ', index.current, 'repeat', repeat.current)
          if (trackId !== index.current && trackId > 0) {
            isItFromUser.current = false
            // setSongIndex(trackId)
            // if(trackId > index.current){
            //     goNext()
            // }
            // else goPrev()
            if (repeat.current === 1) {
              TrackPlayer.skip(songs[trackId - 1].id)
              isItFromUser.current = true
            }
            else goNext()
          }
        })

        TrackPlayer.addEventListener(TrackPlayerEvents.PLAYBACK_QUEUE_ENDED, (e) => {
          console.log('queue end', e)
          isItFromUser.current = false
          if (repeat.current === 1 && e.track) {
            TrackPlayer.skip(songs[e.track - 1].id)
          }
          if (repeat.current === 2) {
              TrackPlayer.skip(songs[0].id)
              .then(() => slider.current.scrollToOffset({
                offset: 0
              }))
              .catch(err => console.log(err))
              index.current = 0
          }
          isItFromUser.current = true
        })

        // interrupt when sound is playing from other app
        // go with alwaysPauseOnInterruption: true
        TrackPlayer.addEventListener(TrackPlayerEvents.REMOTE_DUCK, e => {
          if (e.paused) {
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
    if (isPlayerReady.current && isItFromUser.current) {
      TrackPlayer.skip(songs[songIndex].id)
        .then(() => {
          console.log('track changed')
        })
        .catch(err => console.log(err))
    }
    index.current = songIndex;
  }, [songIndex])

  const goNext = async () => {
    try {
      // cannot use songindex here
      // coz songindex here is different from songindex that is out of this block
      let offset = index.current + 1
      if(repeat.current === 2 && index.current === songs.length - 1){
        offset = 0
      }

      slider.current.scrollToOffset({
        offset: width * offset
      })
      // await TrackPlayer.play();
      isItFromUser.current = true
    }
    catch (err) {
      console.log(err)
    }
  }

  const goPrev = async () => {
    try {
      let offset = index.current - 1
      if(repeat.current === 2 && index.current === 0){
        offset = songs.length - 1
      }

      slider.current.scrollToOffset({
        offset: width * offset
      })
      // await TrackPlayer.play();
      isItFromUser.current = true
    }
    catch (err) {
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
          scrollEventThrottle={16}
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
        onRepeat={() => {
          if(repeat.current === 2) repeat.current = 0
          else ++repeat.current
        }}
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
