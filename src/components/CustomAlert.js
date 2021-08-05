import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Modal, Button, Dimensions } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CustomButton from './CustomButton'
import { Colors, Fonts } from '../constants'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CustomAlert = ({ name, title, description, color, navigation, SetIsShow, isSuccess, nameScreen, titleButton }) => {

    const [modal, setModal] = useState(true)

    return (
        <Modal
            visible={modal}
            transparent={true}
            animationIn="slideInLeft"
            animationOut="slideOutRight"
            onRequestClose={() => setModal(!modal)}
        >
            <View style={styles.container}>
                <View style={styles.wrapModal}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                    {
                        isSuccess ? (
                            <View style={{ width: '100%' }}>
                                <CustomButton
                                    title={titleButton ? titleButton : 'Sing In'}
                                    color={Colors.blue}
                                    onPress={() => navigation.navigate(nameScreen)}
                                />
                                <CustomButton
                                    title='Cancel'
                                    color={Colors.primary}
                                    onPress={() => {
                                        setModal(!modal)
                                        SetIsShow()
                                    }}
                                />
                            </View>
                        ) : (
                            <View style={{ width: '100%', marginTop: 15 }}>
                                <CustomButton
                                    title='Retry'
                                    color={color}
                                    onPress={() => {
                                        setModal(!modal)
                                        SetIsShow()
                                    }}
                                />
                            </View>
                        )
                    }
                </View>
                <View style={styles.wrapImage}>
                    <View style={[styles.wrapIcon, { backgroundColor: color }]}>
                        <AntDesign name={name} size={30} color={'white'} />
                    </View>
                </View>
            </View>
        </Modal >
    )
}

export default CustomAlert

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    wrapModal: {
        backgroundColor: '#EFF2F9',
        width: windowWidth * 4 / 5,
        height: windowHeight * 2 / 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 10
    },
    wrapImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EFF2F9',
        position: 'absolute',
        top: (windowHeight * 3 / 5) / 2 - 40,
        padding: 5,
        borderColor: 'black'
    },
    wrapIcon: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontFamily: Fonts.bold,
        marginVertical: 20,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        fontFamily: Fonts.light,
        marginBottom: 15,
        textAlign: 'center',
    }
})
