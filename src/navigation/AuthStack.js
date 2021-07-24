import React, { useState, useEffect } from 'react'
import { TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { createStackNavigator } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
    Login,
    Onboard,
    Signup,
    Home
} from '../screens'
import { Colors } from '../constants'

const Stack = createStackNavigator();

const AuthStack = () => {

    const [isFirstLaunch, setIsFirstLaunch] = useState(null)
    let routeName

    useEffect(() => {
        AsyncStorage.getItem('alreadyLaunched').then(value => {
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
                            <TouchableOpacity
                                style={{ marginLeft: 5 }}
                                onPress={() => navigation.navigate('Login')}>
                                <AntDesign name="arrowleft" size={30} color={Colors.black} />
                            </TouchableOpacity>
                        )

                    }
                })}
            />
            <Stack.Screen name="Home" component={Home} options={{ header: () => null }} />
        </Stack.Navigator>
    )
}

export default AuthStack
