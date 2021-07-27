import React, { useState, useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {
    Login,
    Onboard,
    Signup,
    Home
} from '../screens'
import { SIGN_OUT } from '../firebase'
import { CustomHeader } from '../components'
import { REMOVE_ITEM, GET_ITEM } from '../asyncstorage'
import { Colors } from '../constants'

const Stack = createStackNavigator();

const AuthStack = () => {

    const [isFirstLaunch, setIsFirstLaunch] = useState(null)
    let routeName

    useEffect(() => {
        GET_ITEM('alreadyLaunched').then(value => {
            if (value === null) {
                setIsFirstLaunch(true)
            } else {
                setIsFirstLaunch(false)
            }
        })
    }, [])

    if (isFirstLaunch === null) {
        return null
    } else if (isFirstLaunch === true) {
        routeName = 'Onboard'
    } else {
        routeName = 'Login'
    }

    return (
        <Stack.Navigator initialRouteName={routeName}>
            <Stack.Screen name="Onboard" component={Onboard} options={{ header: () => null }} />
            <Stack.Screen name="Login" component={Login} options={{ header: () => null }} />
            <Stack.Screen
                name="Signup"
                component={Signup}
                options={({ navigation }) => ({
                    title: '',
                    headerStyle: {
                        backgroundColor: '#f9fafd',
                        shadowColor: '#f9fafd',
                        elevation: 0
                    },
                    headerLeft: () => {
                        return (
                            <CustomHeader
                                name='arrowleft'
                                onPress={() => navigation.navigate('Login')}
                            />
                        )

                    }
                })}
            />
            <Stack.Screen
                name="Home"
                component={Home}
                options={({ navigation }) => ({
                    title: 'Messages',
                    headerStyle: {
                        backgroundColor: '#f9fafd',
                        shadowColor: '#f9fafd',
                        elevation: 0
                    },
                    headerLeft: '',
                    headerRight: () => {
                        return (
                            <CustomHeader
                                name='login'
                                onPress={() => {
                                    SIGN_OUT()
                                    navigation.navigate('Login')
                                }}
                            />
                        )

                    }
                })}
            />
        </Stack.Navigator>
    )
}

export default AuthStack
