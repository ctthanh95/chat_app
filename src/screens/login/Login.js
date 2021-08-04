import React, { useState, useEffect } from 'react'
import {
    Button,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    TouchableOpacity,
    ScrollView
} from 'react-native'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import Spinner from 'react-native-loading-spinner-overlay'
import messaging from '@react-native-firebase/messaging'
import firebase from '@react-native-firebase/app'
import {
    SIGN_IN,
    LOGIN_WITH_FACEBOOK,
    LOGIN_WITH_GOOGLE,
    GET_CURRENT_USER_GOOGLE,
    GET_CURRENT_USER_FACEBOOK
} from '../../firebase'
import { CustomButton, CustomImageButton, CustomInput, CustomAlert } from '../../components'
import { Colors, Fonts } from '../../constants'
import { GET_ITEM } from '../../asyncstorage'

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [spinner, setSpinner] = useState(false)
    const [title, setTitle] = useState('')
    const [isShow, setIsShow] = useState(false)
    const [token, setToken] = useState('')

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '376268813058-4utruuio1kndakt69n5dites36ajerrd.apps.googleusercontent.com',
        })
    }, [])

    useEffect(() => {
        messaging().getToken(firebase.app().options.messagingSenderId).then((result) => { setToken(result) })
    }, [])

    const CheckUser = async () => {
        setSpinner(true)
        const id = await GET_ITEM('ID')
        if (id) {
            navigation.navigate('Home')
            setSpinner(false)
        }
        setSpinner(false)
    }

    const SetIsShow = () => {
        setIsShow(false)
    }

    useEffect(() => {
        CheckUser()
    }, [])

    return (
        <ScrollView>
            {
                isShow ? <CustomAlert
                    name='exclamationcircleo'
                    title='Login unsuccessful'
                    description={title}
                    color={'#FF0000'}
                    navigation={navigation}
                    SetIsShow={SetIsShow}
                    isSuccess={false}
                /> : null
            }
            <View style={styles.container}>
                <Image source={require('../../assets/images/logo.png')} resizeMode='cover' />
                <CustomInput
                    name='mail'
                    value={email}
                    onChangeText={userEmail => setEmail(userEmail)}
                    placeholder='Email'
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <CustomInput
                    name='lock'
                    value={password}
                    onChangeText={userPassword => setPassword(userPassword)}
                    placeholder='Password'
                    secureTextEntry={true}
                />
                <CustomButton
                    title='Sign In'
                    color={Colors.blue}
                    onPress={() => {
                        if (!email || !password) {
                            setIsShow(true)
                            setTitle('Please fill information')
                        } else if (password.length < 6) {
                            setIsShow(true)
                            setTitle('Password must be at least 6 characters')
                        } else {
                            SIGN_IN(email, password, navigation, setSpinner, setIsShow, setTitle, setEmail, setPassword,)
                        }
                    }}
                />
                <TouchableOpacity style={styles.wrapForgot} onPress={() => Alert.alert('a')}>
                    <Text style={styles.textForgot}>Forgot Password?</Text>
                </TouchableOpacity>
                <CustomImageButton
                    name="facebook"
                    title='Sign In with Facebook'
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
                    onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.textForgot}>
                        Don't have an acount? Create here
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

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        backgroundColor: Colors.white
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
