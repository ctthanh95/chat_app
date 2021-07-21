import React from 'react'
import { Button, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import Onboarding from 'react-native-onboarding-swiper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Feather from 'react-native-vector-icons/Feather'
import { Colors, Fonts } from '../../constants'

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
                <Feather name='chevron-right' size={30} color={Colors.primary} />
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
                navigation.replace('Login')
                AsyncStorage.setItem('alreadyLaunched', 'false')
            }}
            onDone={() => {
                navigation.navigate('Login')
                AsyncStorage.setItem('alreadyLaunched', 'false')
            }}
            pages={[
                {
                    backgroundColor: '#fff',
                    image: <Image source={require('../../assets/images/onboard-1.png')} />,
                    title: 'Onboarding',
                    subtitle: 'Done with React Native Onboarding Swiper',
                },
                {
                    backgroundColor: '#fff',
                    image: <Image source={require('../../assets/images/onboard-2.png')} />,
                    title: 'Onboarding',
                    subtitle: 'Done with React Native Onboarding Swiper',
                },
                {
                    backgroundColor: '#fff',
                    image: <Image source={require('../../assets/images/onboard-3.png')} />,
                    title: 'Onboarding',
                    subtitle: 'Done with React Native Onboarding Swiper',
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
        marginRight: 10
    },
    wrapText: {
        width: 80,
        height: 40,
        borderRadius: 25,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: Fonts.bold,
        fontSize: 18
    }
})
