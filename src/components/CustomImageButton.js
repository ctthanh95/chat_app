import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { DimensionDevice, Colors, Fonts } from '../constants'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const CustomImageButton = ({ name, title, color, backgroundColor, ...rest }) => {
    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: backgroundColor }]}
            {...rest}>
            <View style={styles.icon}>
                <FontAwesome name={name} size={30} color={color} />
            </View>
            <View style={styles.wrapText}>
                <Text style={[styles.text, { color: color }]}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default CustomImageButton

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        width: '100%',
        height: DimensionDevice.windowHeight / 15,
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 5
    },
    icon: {
        width: 30,
    },
    wrapText: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: Fonts.bold,
    }
})
