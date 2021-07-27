import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Spinner from 'react-native-loading-spinner-overlay'
import { GET_ALL_USER, } from '../../firebase'
import { DimensionDevice, Fonts } from '../../constants'

const Home = () => {
    const [allUsers, setAllUsers] = useState([])
    const [spinner, setSpinner] = useState(false)

    useEffect(() => {
        GET_ALL_USER(setAllUsers, setSpinner)
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.wrapUser}>
                <Image
                    style={styles.image}
                    resizeMode='contain'
                    source={{ uri: 'https://huyhoanhotel.com/wp-content/uploads/2016/05/765-default-avatar.png' }}
                />
                <View style={styles.wrapText}>
                    <Text style={styles.text}>Name</Text>
                    <TouchableOpacity>
                        <AntDesign name={'setting'} size={20} color={'white'} />
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={allUsers}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity style={styles.wrapItem}>
                            <Image style={styles.itemImage} source={{ uri: item.image === '' ? 'https://huyhoanhotel.com/wp-content/uploads/2016/05/765-default-avatar.png' : item.image }} />
                            <Text style={styles.itemText}>{item.name}</Text>
                        </TouchableOpacity>
                    )
                }}
            />
            <Spinner
                visible={spinner}
                textContent={'Loading...'}
                textStyle={{ color: Colors.white }}
            />
        </View >
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    wrapUser: {
        backgroundColor: '#4A4654',
        width: '100%',
        height: DimensionDevice.windowHeight / 4,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    wrapText: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        justifyContent: 'space-around',
        width: 150,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 999,
        marginVertical: 5
    },
    text: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        paddingHorizontal: 5,
        color: Colors.white,
    },
    wrapItem: {
        backgroundColor: '#EFF2F9',
        width: '100%',
        height: 75,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        padding: 20,
        flexDirection: 'row',
    },
    itemText: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        color: Colors.black,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 999,
        marginRight: 20
    }
})
