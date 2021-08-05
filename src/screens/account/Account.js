import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import auth from '@react-native-firebase/auth'
import { CustomButton, CustomInput, CustomAlert } from '../../components'
import { Fonts, Colors } from '../../constants'
import { UPDATE_PASSWORD, DELETE_USER } from '../../firebase'

const Account = ({ navigation, route }) => {
    const { typeLogin } = route.params
    const [nPassword, setNPassword] = useState('')
    const [rNPassword, setRNPassword] = useState('')
    const [isShow, setIsShow] = useState(false)
    const [isSuccess, setIsSuccess] = useState(true)
    const [title, setTitle] = useState('')

    const SetIsShow = () => {
        setIsShow(false)
    }

    return (
        <ScrollView style={styles.container}>
            {
                isSuccess ? (
                    isShow ? <CustomAlert
                        name='checkcircleo'
                        title='Success'
                        description='Change password success'
                        color={Colors.blue}
                        navigation={navigation}
                        SetIsShow={SetIsShow}
                        nameScreen='Home'
                        titleButton='Go back'
                        isSuccess={isSuccess}
                    /> : null
                ) : (
                    isShow ? <CustomAlert
                        name='exclamationcircleo'
                        title='Unsuccessful'
                        description={title}
                        color={'#FF0000'}
                        navigation={navigation}
                        nameScreen='Home'
                        SetIsShow={SetIsShow}
                        isSuccess={isSuccess} /> : null
                )

            }
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('../../assets/images/change.png')} resizeMode='cover' />
                {
                    typeLogin === 'facebook' || typeLogin === 'google' ? (
                        <View style={{ marginTop: '45%' }} />
                    ) : (
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            <Text style={styles.text}>Change Password</Text>
                            <CustomInput
                                name='lock'
                                value={nPassword}
                                onChangeText={userPassword => setNPassword(userPassword)}
                                placeholder='New password'
                                secureTextEntry={true}
                            />
                            <CustomInput
                                name='lock'
                                value={rNPassword}
                                onChangeText={userPassword => setRNPassword(userPassword)}
                                placeholder='Confirm new password'
                                secureTextEntry={true}
                            />
                            <CustomButton
                                disabled={true}
                                opacity={0}
                                title='Save'
                                color={Colors.blue}
                                onPress={() => {
                                    if (!nPassword || !rNPassword) {
                                        setIsSuccess(false)
                                        setIsShow(true)
                                        setTitle('Please fill information')
                                    } else if (rNPassword.length < 6 || nPassword < 6) {
                                        setIsSuccess(false)
                                        setIsShow(true)
                                        setTitle('Password must be at least 6 characters')
                                    } else if (rNPassword !== nPassword) {
                                        setIsSuccess(false)
                                        setIsShow(true)
                                        setTitle('Password does not match')
                                    } else {
                                        UPDATE_PASSWORD(rNPassword, setIsShow, setIsSuccess,)
                                        setNPassword('')
                                        setRNPassword('')
                                    }
                                }} />
                        </View>
                    )
                }
                <CustomButton title='Delete account' color={'red'} onPress={() => {
                    DELETE_USER(navigation, setIsShow, setIsSuccess, setTitle)
                }} />
            </View>
        </ScrollView>
    )
}

export default Account

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 10,
    },
    text: {
        fontFamily: Fonts.bold,
        fontSize: 18,
        marginVertical: 15
    }
})
