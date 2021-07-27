import AsyncStorage from '@react-native-async-storage/async-storage'

export const SET_ITEM = async (name, value) => {
    try {
        await AsyncStorage.setItem(name, value)
    } catch (e) {
        console.log('SET_ITEM', e)
    }
}

export const GET_ITEM = async (name) => {
    try {
        const value = await AsyncStorage.getItem(name)
        return value
    } catch (e) {
        console.log('GET_ITEM', e)
    }
}

export const REMOVE_ITEM = async (name) => {
    try {
        await AsyncStorage.removeItem(name)
    } catch (e) {
        console.log('REMOVE_ITEM', e)
    }
}

