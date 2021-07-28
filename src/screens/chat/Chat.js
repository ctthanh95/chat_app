import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Image } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ImagePicker from 'react-native-image-crop-picker'
import ImgToBase64 from 'react-native-image-base64'
import { Colors, Fonts, DimensionDevice } from '../../constants'
import { SEND_MESSAGE, RECEIVE_MESSAGE, GET_ALL_MESSAGES_BETWEEN_SENDER_RECEIVER } from '../../firebase'

const Chat = ({ route }) => {
    const { receiver, sender, imageSender, imageReceiver } = route.params
    const [spinner, setSpinner] = useState(false)
    const [message, setMessage] = useState('')
    const [allMessages, setAllMessages] = useState([])

    useEffect(() => {
        GET_ALL_MESSAGES_BETWEEN_SENDER_RECEIVER(sender, receiver, setAllMessages, setSpinner)
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
                    SEND_MESSAGE(sender, receiver, '', source)
                    RECEIVE_MESSAGE(sender, receiver, '', source)
                })
                .catch(err => console.log(err));
        });
    }


    const SendMessage = () => {
        if (message) {
            SEND_MESSAGE(sender, receiver, message, '')
            RECEIVE_MESSAGE(sender, receiver, message, '')
            setMessage('')
        }
    }

    return (
        <View style={styles.container}>
            <FlatList
                inverted
                style={{ marginBottom: 85 }}
                keyExtractor={(item, index) => index.toString()}
                data={allMessages}
                renderItem={({ item, index }) => {
                    return (
                        <View
                            style={[
                                styles.wrapMessage,
                                { alignSelf: sender === item.sender ? 'flex-end' : 'flex-start' }]}
                        >
                            {
                                item.message === '' ? (
                                    <View>
                                        {
                                            sender === item.sender ? (
                                                <View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <Image source={{ uri: item.imageMessage }} style={[styles.image, { marginRight: 5 }]} resizeMode='stretch' />
                                                        <View style={styles.wrapImage}>
                                                            <Image source={{ uri: imageSender }} style={styles.imageUser} resizeMode='stretch' />
                                                        </View>
                                                    </View>
                                                    <Text
                                                        style={[
                                                            styles.textTime,
                                                            {
                                                                marginRight: 35,
                                                                textAlign: 'right',
                                                            }
                                                        ]}
                                                    >
                                                        {item.day + " " + item.time}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={[styles.wrapImage, { marginRight: 5 }]}>
                                                            <Image source={{ uri: imageReceiver }} style={styles.imageUser} resizeMode='stretch' />
                                                        </View>
                                                        <Image source={{ uri: item.imageMessage }} style={styles.image} resizeMode='stretch' />
                                                    </View>
                                                    <Text
                                                        style={[
                                                            styles.textTime,
                                                            {
                                                                marginLeft: 35,
                                                                textAlign: 'left',
                                                            }
                                                        ]}
                                                    >
                                                        {item.day + " " + item.time}
                                                    </Text>
                                                </View>
                                            )
                                        }
                                    </View>
                                ) : (
                                    <View>
                                        {
                                            sender === item.sender ? (
                                                <View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5, justifyContent: 'flex-end' }}>
                                                        <View
                                                            style={[
                                                                styles.wrapText,
                                                                {
                                                                    backgroundColor: sender === item.sender ? Colors.blue : Colors.primary,
                                                                    marginRight: 5
                                                                }]}
                                                        >
                                                            <Text style={styles.text}>{item.message}</Text>
                                                        </View>
                                                        <View style={styles.wrapImage}>
                                                            <Image source={{ uri: imageSender }} style={styles.imageUser} resizeMode='stretch' />
                                                        </View>
                                                    </View>
                                                    <Text
                                                        style={[
                                                            styles.textTime,
                                                            {
                                                                marginRight: 35,
                                                                textAlign: 'right',
                                                            }
                                                        ]}
                                                    >
                                                        {item.day + " " + item.time}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5, justifyContent: 'flex-start' }}>
                                                        <View style={[styles.wrapImage, { marginRight: 5 }]}>
                                                            <Image source={{ uri: imageReceiver }} style={styles.imageUser} resizeMode='stretch' />
                                                        </View>
                                                        <View
                                                            style={[
                                                                styles.wrapText,
                                                                { backgroundColor: sender === item.sender ? Colors.blue : Colors.primary }]}
                                                        >
                                                            <Text style={styles.text}>{item.message}</Text>
                                                        </View>
                                                    </View>
                                                    <Text
                                                        style={[
                                                            styles.textTime,
                                                            {
                                                                marginLeft: 35,
                                                                textAlign: 'left',
                                                            }
                                                        ]}
                                                    >
                                                        {item.day + " " + item.time}
                                                    </Text>
                                                </View>
                                            )
                                        }
                                    </View>
                                )
                            }
                        </View>
                    )
                }}
            />
            <View View style={{ alignItems: 'center' }}>
                <View style={styles.wrapButton}>
                    <TouchableOpacity
                        style={styles.buttonLeft}
                        onPress={ChooseImage}
                    >
                        <AntDesign name={'picture'} size={25} color={'black'} />
                    </TouchableOpacity>
                    <View style={styles.wrapInput}>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Enter your massage here...'
                            placeholderTextColor="#00000080"
                            value={message}
                            onChangeText={setMessage}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.buttonRight}
                        onPress={() => SendMessage()}
                    >
                        <Ionicons name={'send-sharp'} size={20} color={'black'} />
                    </TouchableOpacity>
                </View>
            </View >
            <Spinner
                visible={spinner}
                textContent={'Loading...'}
                textStyle={{ color: Colors.white }}
            />
        </View >
    )
}

export default Chat

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: Colors.white,
    },
    wrapButton: {
        width: '100%',
        backgroundColor: '#EFF2F9',
        height: 70,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 10,
    },
    buttonLeft: {
        width: '10%',
        alignItems: 'center',
    },
    buttonRight: {
        width: '10%',
        alignItems: 'center',
    },
    wrapInput: {
        width: '75%',
        marginHorizontal: 5,
        alignItems: 'center',
    },
    textInput: {
        width: '100%',
        fontFamily: Fonts.regular,
        fontSize: 18,
        alignItems: 'center',
        height: 45,
        color: Colors.black,
        borderWidth: 1,
        borderColor: '#A8B6D4',
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    wrapMessage: {
        maxWidth: DimensionDevice.windowWidth * 2 / 3,
        marginVertical: 5,
    },
    wrapText: {
        padding: 10,
        height: 50,
        justifyContent: 'center',
        borderRadius: 10,
        flexDirection: 'row',
    },
    text: {
        color: Colors.white,
        fontSize: 16,
        fontFamily: Fonts.light,
    },
    image: {
        height: 150,
        width: DimensionDevice.windowWidth / 2,
        borderRadius: 5,
    },
    imageUser: {
        height: 30,
        width: 30,
        borderRadius: 999,
        alignItems: 'flex-end',
    },
    wrapImage: {
        justifyContent: 'flex-end'
    },
    textTime: {
        color: Colors.primary,
        fontSize: 12,
        fontFamily: Fonts.regular,
    }
})
