import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, Alert } from 'react-native'
import { CustomButton, CustomInput, CustomAlert } from '../../components'
import { SEND_PASSWORD_RESET_EMAIL } from '../../firebase'

const Resetpassword = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [isShow, setIsShow] = useState(false)
    const [isSuccess, setIsSuccess] = useState(true)
    const [title, setTitle] = useState('')

    const SetIsShow = () => {
        setIsShow(false)
    }

    return (
        <View style={styles.container}>
            {
                isSuccess ? (
                    isShow ? <CustomAlert
                        name='checkcircleo'
                        title='Success'
                        description='Please check your email and Sign up'
                        color={Colors.blue}
                        navigation={navigation}
                        nameScreen='Login'
                        SetIsShow={SetIsShow}
                        isSuccess={isSuccess}
                    /> : null
                ) : (
                    isShow ? <CustomAlert
                        name='exclamationcircleo'
                        title='Unsuccessful'
                        description={title}
                        color={'#FF0000'}
                        navigation={navigation}
                        nameScreen='Login'
                        SetIsShow={SetIsShow}
                        isSuccess={isSuccess} /> : null
                )

            }
            <Image source={require('../../assets/images/reset.png')} resizeMode='cover' />
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
            <CustomButton title='Reset Password' color={Colors.blue} onPress={() => {
                if (!email) {
                    setIsShow(true)
                    setIsSuccess(false)
                    setTitle('Please fill information')
                } else {
                    SEND_PASSWORD_RESET_EMAIL(email, setIsShow, setIsSuccess, setTitle)
                }
            }
            } />
        </View>
    )
}

export default Resetpassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 10,
        alignItems: 'center'
    },
})
