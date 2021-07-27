import React from 'react'
import { Button, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import Onboarding from 'react-native-onboarding-swiper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Feather from 'react-native-vector-icons/Feather'
import { Colors, Fonts } from '../../constants'
import { SET_ITEM } from '../../asyncstorage'

const Onboard = ({ navigation }) => {
    const Skip = ({ ...props }) => {
        return (
            <TouchableOpacity style={[styles.wrapText, { marginLeft: 10 }]} {...props}>
                <Text style={styles.text}>Skip</Text>
            </TouchableOpacity>
        )
    }
    const Next = ({ ...props }) => {
        return (
            <TouchableOpacity style={styles.wrapButton} {...props}>
                <Feather name='chevron-right' size={30} color={Colors.black} />
            </TouchableOpacity>
        )
    }
    const Done = ({ ...props }) => {
        return (
            <TouchableOpacity style={[styles.wrapText, { marginRight: 10 }]} {...props}>
                <Text style={styles.text}>Start</Text>
            </TouchableOpacity>
        )
    }
    return (
        <Onboarding
            DoneButtonComponent={Done}
            SkipButtonComponent={Skip}
            NextButtonComponent={Next}
            onSkip={() => {
                SET_ITEM('alreadyLaunched', 'false').then(() => navigation.replace('Login'))
            }}
            onDone={() => {
                SET_ITEM('alreadyLaunched', 'false').then(() => navigation.navigate('Login'))
            }}
            titleStyles={{
                color: 'black',
                fontFamily: Fonts.bold,
                fontSize: 30
            }}
            subTitleStyles={{
                color: 'white',
                fontFamily: Fonts.light,
                fontSize: 15,

            }}
            pages={[
                {
                    backgroundColor: '#33CC33',
                    image: <Image source={require('../../assets/images/onboard-1.png')} />,
                    title: 'Connect to the World',
                    subtitle: 'A New Way To Connect With The World',
                },
                {
                    backgroundColor: '#00CCFF',
                    image: <Image source={require('../../assets/images/onboard-2.png')} />,
                    title: 'Share Your Favorites',
                    subtitle: 'Share Your Thoughts With Similar Kind of People',
                },
                {
                    backgroundColor: '#CD853F',
                    image: <Image source={require('../../assets/images/onboard-3.png')} />,
                    title: 'Become The Star',
                    subtitle: "Let The Spot Light Capture You",
                },
            ]}
        />
    )
}

export default Onboard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    wrapText: {
        width: 80,
        height: 40,
        borderRadius: 10,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: Fonts.bold,
        fontSize: 18
    }
})
