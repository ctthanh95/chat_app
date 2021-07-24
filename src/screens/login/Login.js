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
import { SIGNIN } from '../../firebase'
import { CustomButton, CustomImageButton, CustomInput } from '../../components'
import { Colors, Fonts } from '../../constants'

const Login = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    return (
        <ScrollView>
            <View style={styles.container}>
                <Image source={require('../../assets/images/logo.png')} resizeMode='cover' />
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
                <CustomButton title='Sign In' onPress={() => SIGNIN(email, password, navigation)} />
                <TouchableOpacity style={styles.wrapForgot} onPress={() => Alert.alert('a')}>
                    <Text style={styles.textForgot}>Forgot Password?</Text>
                </TouchableOpacity>
                <CustomImageButton
                    name="facebook"
                    title='Sign In with Facebook'
                    color="#4867aa"
                    backgroundColor="#e6eaf4"
                    onPress={() => Alert.alert('a')}
                />
                <CustomImageButton
                    name="google"
                    title='Sign In with Google'
                    color="#de4d41"
                    backgroundColor="#f5e7ea"
                    onPress={() => Alert.alert('a')}
                />
                <TouchableOpacity
                    style={styles.wrapForgot}
                    onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.textForgot}>
                        Don't have an acount? Create here
                    </Text>
                </TouchableOpacity>
            </View>
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
