import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Colors, Fonts } from '../../constants'
import { CustomButton, CustomImageButton, CustomInput } from '../../components'

const Signup = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPasswoord, setConfirmPasswoord] = useState()
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Create an account</Text>
            <CustomInput
                name='user'
                labelValue={email}
                onChangeText={userEmail => setEmail(userEmail)}
                placeholder='Email'
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <CustomInput
                name='lock'
                labelValue={password}
                onChangeText={userPassword => setPassword(userPassword)}
                placeholder='Password'
                secureTextEntry={true}
            />
            <CustomInput
                name='lock'
                labelValue={confirmPasswoord}
                onChangeText={userConfirmPassword => setPassword(userConfirmPassword)}
                placeholder='Confirm Password'
                secureTextEntry={true}
            />
            <View style={styles.wrapText}>
                <Text style={styles.textPrivate}>
                    By registering, you confirm that you accept our
                </Text>
                <TouchableOpacity onPress={() => alert('Terms Clicked!')}>
                    <Text style={[styles.textPrivate, { color: '#e88832' }]}>
                        Terms of service
                    </Text>
                </TouchableOpacity>
                <Text style={styles.textPrivate}> and </Text>
                <Text style={[styles.textPrivate, { color: '#e88832' }]}>
                    Privacy Policy
                </Text>
            </View>
            <CustomImageButton
                name="facebook"
                title='Sign Up with Facebook'
                color="#4867aa"
                backgroundColor="#e6eaf4"
                onPress={() => Alert.alert('a')}
            />
            <CustomImageButton
                name="google"
                title='Sign Up with Google"
                btnType="google"'
                color="#de4d41"
                backgroundColor="#f5e7ea"
                onPress={() => Alert.alert('a')}
            />
            <TouchableOpacity
                style={styles.wrapForgot}
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.textForgot}>
                    Have an account? Sign In
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default Signup

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 10,
        alignItems: 'center'
    },
    text: {
        fontFamily: Fonts.bold,
        fontSize: 28,
        marginBottom: 10,
        color: Colors.blue,
    },
    wrapText: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 35,
        justifyContent: 'center',
    },
    textPrivate: {
        fontSize: 13,
        fontWeight: '400',
        fontFamily: Fonts.bold,
        color: 'grey',
    },
    wrapForgot: {
        marginVertical: 15
    },
    textForgot: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.blue,
        fontFamily: Fonts.bold,
    }
})
