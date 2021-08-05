import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Spinner from 'react-native-loading-spinner-overlay'
import ImagePicker from 'react-native-image-crop-picker'
import ImgToBase64 from 'react-native-image-base64'
import moment from 'moment'
import { GET_ALL_USER, UPDATE_USER_IMAGE } from '../../firebase'
import { GET_ITEM } from '../../asyncstorage'
import { DimensionDevice, Fonts } from '../../constants'

const Home = ({ navigation }) => {
    const [allUsers, setAllUsers] = useState([])
    const [spinner, setSpinner] = useState(false)
    const [imageChoose, setImageChoose] = useState('')
    const [userName, setUserName] = useState('')
    const [sender, setSender] = useState('')
    const [typeLogin, setTypeLogin] = useState('')

    const Get_Id_From_Async = async () => {
        setSender(await GET_ITEM('ID'))
    }

    useEffect(() => {
        Get_Id_From_Async()
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            GET_ALL_USER(setAllUsers, setSpinner, setUserName, setImageChoose, setTypeLogin)
        });
        return unsubscribe;
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
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Account', {
                            typeLogin: typeLogin
                        })}
                    >
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
                                token: item.token,
                                sender: sender,
                                imageSender: imageChoose === '' ? 'https://huyhoanhotel.com/wp-content/uploads/2016/05/765-default-avatar.png' : imageChoose,
                                imageReceiver: item.image === '' ? 'https://huyhoanhotel.com/wp-content/uploads/2016/05/765-default-avatar.png' : item.image
                            })}
                        >
                            <View style={styles.wrapImageItem}>
                                <Image style={styles.itemImage} source={{ uri: item.image === '' ? 'https://huyhoanhotel.com/wp-content/uploads/2016/05/765-default-avatar.png' : item.image }} />
                            </View>
                            {
                                item.lastMessage === '' ? (
                                    <View style={[styles.wrapTextItem, { justifyContent: 'center' }]}>
                                        <Text nunumberOfLines={1} style={styles.name}>{item.name}</Text>
                                    </View>
                                ) : (
                                    <View style={styles.wrapTextItem}>
                                        <View style={styles.wrapTextItemChild}>
                                            <Text nunumberOfLines={1} style={styles.name}>{item.name}</Text>
                                            <Text nunumberOfLines={1} style={styles.time}>
                                                {
                                                    moment(item.lastTime + " " + item.lastDate, "HH:mm:ss YYYY-MM-DD").fromNow()

                                                }
                                            </Text>
                                        </View>
                                        <View style={styles.wrapTextItemChild}>
                                            <Text nunumberOfLines={1} style={styles.message}>{item.lastMessage}</Text>
                                            {/* <Text nunumberOfLines={1}>{item.lastMessage}</Text> */}
                                        </View>
                                    </View>
                                )
                            }
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
        fontSize: 18,
        paddingHorizontal: 5,
        color: Colors.white,
    },
    wrapItem: {
        backgroundColor: '#EFF2F9',
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
        padding: 10,
        flexDirection: 'row',
    },
    wrapImageItem: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 10
    },
    wrapTextItem: {
        height: '100%',
        flex: 4,
    },
    wrapTextItemChild: {
        flexDirection: 'row',
        width: '100%',
        height: '50%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    name: {
        color: Colors.black,
        fontFamily: Fonts.bold,
        fontSize: 18
    },
    time: {
        color: Colors.primary,
        fontFamily: Fonts.bold,
        fontSize: 12
    },
    message: {
        color: '#0000FF',
        fontFamily: Fonts.italic,
        fontSize: 16,
    }
})
