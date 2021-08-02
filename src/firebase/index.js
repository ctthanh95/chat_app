import React from "react"
import { Alert } from "react-native";
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import { LoginManager, AccessToken } from 'react-native-fbsdk-next'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import moment from 'moment'
import { SET_ITEM, REMOVE_ITEM } from '../asyncstorage'

const ADD_USER = (id, name, email, image) => {
    database()
        .ref('/users/' + id)
        .set({
            id: id,
            name: name,
            email: email,
            image: image,
        })
}

export const SIGN_UP = (name, email, password, image, setSpinner, setIsShow, setIsSuccess, setTitle, setName, setEmail, setPassword) => {
    setSpinner(true)
    auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
            let id = auth().currentUser.uid
            //ADD_USER(id, name, email, image);
            setSpinner(false)
            setIsShow(true)
            setIsSuccess(true)
            setName('')
            setEmail('')
            setPassword('')
        })
        .catch(error => {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setTitle('That email address is already in use!')
                    break
                case 'auth/invalid-email':
                    setTitle('That email address is invalid!')
                    break
                default:
                    setTitle(error)
            }
            setSpinner(false)
            setIsShow(true)
            setIsSuccess(false)
        });
}

export const SIGN_IN = (email, password, navigation, setSpinner, setIsShow, setTitle, setEmail, setPassword,) => {
    setSpinner(true)
    auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            SET_ITEM('ID', auth().currentUser.uid)
            setSpinner(false)
            setEmail('')
            setPassword('')
            navigation.navigate('Home')
        })
        .catch(error => {
            switch (error.code) {
                case 'auth/wrong-password':
                    setTitle('The password is invalid or the user does not have a password')
                    break
                case 'auth/user-not-found':
                    setTitle('There is no user record corresponding to this identifier. The user may have been deleted')
                    break
                case 'auth/invalid-email':
                    setTitle('The email address is badly formatted')
                    break
                default:
                    setTitle(error)
            }
            setIsShow(true)
            setSpinner(false)
        });
}

export const LOGIN_WITH_FACEBOOK = async () => {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
        throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
        throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
}

export const LOGIN_WITH_GOOGLE = async () => {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
}

export const GET_CURRENT_USER_GOOGLE = async (navigation) => {
    const currentUser = await GoogleSignin.getCurrentUser();
    const infoUser = currentUser.user
    let id = auth().currentUser.uid
    SET_ITEM('ID', id)
    ADD_USER(id, infoUser.name, infoUser.email, infoUser.photo)
    navigation.navigate('Home')
};

export const GET_CURRENT_USER_FACEBOOK = (navigation) => {
    const infoUser = auth().currentUser
    SET_ITEM('ID', infoUser.uid)
    ADD_USER(infoUser.uid, infoUser.displayName, infoUser.email, infoUser.photoURL)
    navigation.navigate('Home')
};

export const GET_ALL_USER = (setAllUsers, setSpinner, setUserName, setImageChoose) => {
    setSpinner(true)
    database()
        .ref('/users')
        .on('value', snapshot => {
            let id = auth().currentUser.uid
            let users = []
            let lastMessage, lastTime, lastDate, lastDateTime
            snapshot.forEach(e => {
                if (e.val().id === id) {
                    setUserName(e.val().name);
                    setImageChoose(e.val().image);
                } else {
                    let userTemp = {
                        id: '',
                        name: '',
                        image: '',
                        lastMessage: '',
                        lastDate: '',
                        lastTime: '',
                        lastDateTime: '',
                    }
                    new Promise((resolve) => {
                        database().ref('messages')
                            .child(id).child(e.val().id).orderByKey().limitToLast(1)
                            .on('value', snapshotLast => {
                                if (snapshotLast.val()) {
                                    snapshotLast.forEach(i => {
                                        lastMessage = i.val().msg.imageMessage !== '' ? 'Photo' : i.val().msg.message
                                        lastDate = i.val().msg.day
                                        lastTime = i.val().msg.time
                                        lastDateTime = i.val().msg.time + " " + i.val().msg.day
                                    })
                                } else {
                                    lastMessage = ''
                                    lastDate = ''
                                    lastTime = ''
                                    lastDateTime = ''
                                }
                                userTemp.id = e.val().id
                                userTemp.name = e.val().name
                                userTemp.image = e.val().image
                                userTemp.lastMessage = lastMessage
                                userTemp.lastDate = lastDate
                                userTemp.lastTime = lastTime
                                userTemp.lastDateTime = lastDateTime ? moment(lastDateTime, "HH:mm:ss YYYY-MM-DD").valueOf() : 0
                                return resolve(userTemp)
                            })
                    }).then(userTemp => {
                        users.push(userTemp)
                        setAllUsers(users.sort((a, b) => b.lastDateTime - a.lastDateTime))
                        setSpinner(false)
                    })
                }
            });
        });
}

export const SIGN_OUT = () => {
    auth()
        .signOut()
        .then(() => REMOVE_ITEM('ID'));
}

export const UPDATE_USER_IMAGE = (id, source) => {
    database()
        .ref('/users/' + id)
        .update({
            image: source,
        })
    //.then(() => console.log('Data updated.'));
}

export const SEND_MESSAGE = (sender, receiver, message, imageMessage) => {
    let today = moment()
    database().ref('/messages/' + sender).child(receiver)
        .push({
            msg: {
                sender: sender,
                receiver: receiver,
                message: message,
                imageMessage: imageMessage,
                day: today.format('YYYY-MM-DD'),
                time: today.format('HH:mm:ss')
            }
        })
}

export const RECEIVE_MESSAGE = (sender, receiver, message, imageMessage) => {
    let today = moment()
    database().ref('/messages/' + receiver).child(sender)
        .push({
            msg: {
                sender: sender,
                receiver: receiver,
                message: message,
                imageMessage: imageMessage,
                day: today.format('YYYY-MM-DD'),
                time: today.format('HH:mm:ss')
            }
        })

}

export const GET_ALL_MESSAGES_BETWEEN_SENDER_RECEIVER = (sender, receiver, setAllMessages, setSpinner) => {
    setSpinner(true)
    database()
        .ref('messages').child(sender).child(receiver)
        .on('value', snapshot => {
            let messages = []
            snapshot.forEach(e => {
                messages.push({
                    sender: e.val().msg.sender,
                    message: e.val().msg.message,
                    receiver: e.val().msg.receiver,
                    imageMessage: e.val().msg.imageMessage,
                    day: e.val().msg.day,
                    time: e.val().msg.time
                })
            })
            setAllMessages(messages.reverse())
            setSpinner(false)
        });
}

