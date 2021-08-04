import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Image } from 'react-native'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import Spinner from 'react-native-loading-spinner-overlay'
import messaging from '@react-native-firebase/messaging'
import firebase from '@react-native-firebase/app'
import { Colors, Fonts } from '../../constants'
import { CustomButton, CustomImageButton, CustomInput, CustomAlert } from '../../components'
import {
    SIGN_UP,
    LOGIN_WITH_FACEBOOK,
    LOGIN_WITH_GOOGLE,
    GET_CURRENT_USER_GOOGLE,
    GET_CURRENT_USER_FACEBOOK
} from '../../firebase'

const Signup = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [spinner, setSpinner] = useState(false)
    const [isShow, setIsShow] = useState(false)
    const [isSuccess, setIsSuccess] = useState(true)
    const [title, setTitle] = useState('')
    const [token, setToken] = useState('')

    const SetIsShow = () => {
        setIsShow(false)
    }

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '376268813058-4utruuio1kndakt69n5dites36ajerrd.apps.googleusercontent.com',
        })
    }, [])

    useEffect(() => {
        messaging().getToken(firebase.app().options.messagingSenderId).then((result) => { setToken(result) })
    }, [])

    return (
        <ScrollView>
            {
                isSuccess ? (
                    isShow ? <CustomAlert
                        name='checkcircleo'
                        title='Success'
                        description='Registration successful'
                        color={Colors.blue}
                        navigation={navigation}
                        SetIsShow={SetIsShow}
                        isSuccess={isSuccess}
                    /> : null
                ) : (
                    isShow ? <CustomAlert
                        name='exclamationcircleo'
                        title='Registration unsuccessful'
                        description={title}
                        color={'#FF0000'}
                        navigation={navigation}
                        SetIsShow={SetIsShow}
                        isSuccess={isSuccess} /> : null
                )

            }
            <View style={styles.container}>
                <Image source={require('../../assets/images/signup.png')} resizeMode='cover' />
                <CustomInput
                    name='user'
                    value={name}
                    onChangeText={userName => setName(userName)}
                    placeholder='Name'
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#00000050"
                    autoCorrect={false}
                />
                <CustomInput
                    name='mail'
                    value={email}
                    onChangeText={userEmail => setEmail(userEmail)}
                    placeholder='Email'
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#00000050"
                    autoCorrect={false}
                />
                <CustomInput
                    name='lock'
                    value={password}
                    onChangeText={userPassword => setPassword(userPassword)}
                    placeholder='Password'
                    placeholderTextColor="#00000050"
                    secureTextEntry={true}
                />
                <View style={styles.wrapText}>
                    <Text style={styles.textPrivate}>
                        By registering, you confirm that you accept our
                    </Text>
                    <Text style={[styles.textPrivate, { color: '#e88832' }]}>
                        Terms of service
                    </Text>
                    <Text style={styles.textPrivate}> and </Text>
                    <Text style={[styles.textPrivate, { color: '#e88832' }]}>
                        Privacy Policy
                    </Text>
                </View>
                <CustomButton title='Sign Up' color={Colors.blue} onPress={() => {
                    if (!name || !email || !password) {
                        setIsShow(true)
                        setIsSuccess(false)
                        setTitle('Please fill information')
                    } else if (password.length < 6) {
                        setIsShow(true)
                        setIsSuccess(false)
                        setTitle('Password must be at least 6 characters')
                    } else {
                        SIGN_UP(
                            name, email, password, '', token,
                            setSpinner, setIsShow, setIsSuccess, setTitle,
                            setName, setEmail, setPassword
                        )

                    }
                }
                } />
                <CustomImageButton
                    name="facebook"
                    title='Sign Up with Facebook'
                    color="#4867aa"
                    backgroundColor="#e6eaf4"
                    onPress={() => LOGIN_WITH_FACEBOOK().then(() => {
                        GET_CURRENT_USER_FACEBOOK(navigation, token)
                    })}
                />
                <CustomImageButton
                    name="google"
                    title='Sign In with Google'
                    color="#de4d41"
                    backgroundColor="#f5e7ea"
                    onPress={() => LOGIN_WITH_GOOGLE().then(() => {
                        GET_CURRENT_USER_GOOGLE(navigation, token)
                    })}
                />
                <TouchableOpacity
                    style={styles.wrapForgot}
                    onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.textForgot}>
                        Have an account? Sign In
                    </Text>
                </TouchableOpacity>
            </View>
            <Spinner
                visible={spinner}
                textContent={'Loading...'}
                textStyle={{ color: Colors.white }}
            />
        </ScrollView>
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
