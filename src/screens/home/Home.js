import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Spinner from 'react-native-loading-spinner-overlay'
import ImagePicker from 'react-native-image-crop-picker'
import ImgToBase64 from 'react-native-image-base64'
import { GET_ALL_USER, UPDATE_USER_IMAGE } from '../../firebase'
import { GET_ITEM } from '../../asyncstorage'
import { DimensionDevice, Fonts } from '../../constants'

const Home = ({ navigation }) => {
    const [allUsers, setAllUsers] = useState([])
    const [spinner, setSpinner] = useState(false)
    const [imageChoose, setImageChoose] = useState('')
    const [userName, setUserName] = useState('')
    const [sender, setSender] = useState('')

    useEffect(async () => {
        setSender(await GET_ITEM('ID'))
        GET_ALL_USER(setAllUsers, setSpinner, setUserName, setImageChoose)
    }, [])

    const ChooseImage = () => {
        ImagePicker.openPicker({
            width: 120,
            height: 120,
            cropping: true
        }).then(image => {
            ImgToBase64.getBase64String(image.path)
                .then(base64String => {
                    let source = "data:image/jpeg;base64," + base64String
                    setImageChoose(image.path)
                    UPDATE_USER_IMAGE(sender, source)
                })
                .catch(err => console.log(err));
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.wrapUser}>
                <TouchableOpacity
                    onPress={ChooseImage}
                >
                    <Image
                        style={styles.image}
                        resizeMode='contain'
                        source={{ uri: imageChoose === '' ? 'https://huyhoanhotel.com/wp-content/uploads/2016/05/765-default-avatar.png' : imageChoose }}
                    />
                </TouchableOpacity>

                <View style={styles.wrapText}>
                    <Text style={styles.text}>{userName}</Text>
                    <TouchableOpacity>
                        <AntDesign name={'setting'} size={20} color={'white'} />
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={allUsers}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity
                            style={styles.wrapItem}
                            onPress={() => navigation.navigate('Chat', {
                                title: item.name,
                                receiver: item.id,
                                sender: sender,
                                imageSender: imageChoose,
                                imageReceiver: item.image === '' ? 'https://huyhoanhotel.com/wp-content/uploads/2016/05/765-default-avatar.png' : item.image
                            })}
                        >
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
        width: 200,
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
        height: 70,
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
