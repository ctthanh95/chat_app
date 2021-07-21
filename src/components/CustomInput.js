import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import { DimensionDevice, Colors, Fonts } from '../constants'

const CustomInput = ({ name, value, placeholder, ...rest }) => {
    return (
        <View style={styles.container}>
            <View style={styles.icon}>
                <Feather name={name} size={30} color={Colors.black} />
            </View>
            <TextInput
                style={styles.input}
                value={value}
                placeholder={placeholder}
                {...rest}
            />
        </View>
    )
}

export default CustomInput

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        width: '100%',
        height: DimensionDevice.windowHeight / 15,
        borderColor: Colors.border,
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        alignItems: 'center',
    },
    icon: {
        padding: 10,
        height: '100%',
        borderRightColor: Colors.border,
        borderRightWidth: 1,
        width: 50,
    },
    input: {
        padding: 10,
        flex: 1,
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: Colors.black,
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
    }
})
