import React, { useState } from 'react'
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { songs } from '../../songs'
import Icon from 'react-native-vector-icons/Ionicons'

export default function SongList({isShowModel, songIndex, changeSongIndex}) {

    const onSetSongIndex = (index) => {
        if(index !== songIndex){
            changeSongIndex(index)
        }
        else changeSongIndex()
    }

    const modalItem = (item, index) => {
        return (
            <TouchableOpacity
                key={item.id}
                style={{
                    flexDirection: "row", padding: 20,
                    alignItems: "center",
                    backgroundColor: songIndex === index 
                    ? "rgba(255, 255, 255, 0.5)" : "rgb(26, 26, 26)",
                }}
                onPress={() => onSetSongIndex(index)}
                >
                <Image
                    source={item.artwork}
                    style={{ width: 45, height: 45, marginRight: 20, borderRadius: 40 }} />
                <View>
                    <Text
                    style={{ color: 'white', fontSize: 16, flexWrap: 'wrap' }}>
                        {item.title}
                    </Text>
                    
                    <Text
                    style={{ color: 'white', opacity: 0.8, fontSize: 12, flexWrap: 'wrap' }}>
                        {item.artist}
                    </Text>
                </View>
                <Icon
                name="radio-outline"
                size={songIndex === index ? 20 : 0} color="white"
                style={{marginLeft: "auto"}}
                />
            </TouchableOpacity>
        )
    }

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={isShowModel}
        >
            <View style={styles.modal}>
                <TouchableOpacity
                style={{
                    paddingVertical: 30,
                    backgroundColor: "rgb(26, 26, 26)",
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: 'center'
                }}
                onPress={() => changeSongIndex()}
                >
                    <Text style={{ color: 'white', fontSize: 20 }}>
                        YOUR LIST
                    </Text>
                    <Icon
                    name="chevron-down-outline"
                    size={30}
                    color="white"
                    style={{position: 'absolute', right: 10}}
                    />
                </TouchableOpacity>
                <ScrollView style={styles.modalInner}>
                    {songs.map((item, index) => modalItem(item, index))}
                </ScrollView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        backgroundColor: "rgba(26, 26, 26, 0.6)",
        // backgroundColor: "white",
        justifyContent: "center",
        alignItems: 'center'
    },
    modalInner: {
        width: "100%",
        backgroundColor: "rgba(26, 26, 26, 0.6)",
        flex: 1
    }
})
