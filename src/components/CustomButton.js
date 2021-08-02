import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { DimensionDevice, Colors, Fonts } from '../constants'

const CustomButton = ({ title, color, ...rest }) => {
    return (
        <TouchableOpacity style={[styles.button, {
            backgroundColor: color,
        }]} {...rest}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton

const styles = StyleSheet.create({
    button: {
        marginVertical: 10,
        width: '100%',
        height: DimensionDevice.windowHeight / 15,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    text: {
        fontSize: 18,
        color: Colors.white,
        fontFamily: Fonts.regular,
        fontWeight: 'bold',
    }
})
