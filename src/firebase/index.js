import React from "react"
import { Alert } from "react-native";
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import { LoginManager, AccessToken } from 'react-native-fbsdk-next'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import moment from 'moment'
import { SET_ITEM, REMOVE_ITEM } from '../asyncstorage'

const ADD_USER = (id, name, email, image, token, type) => {
    database()
        .ref('/users/' + id)
        .set({
            id: id,
            name: name,
            email: email,
            image: image,
            token: token,
            type: type,
        })
}

const SEND_EMAIL_VERIFICATION = () => {
    auth().currentUser.sendEmailVerification()
        .then(() => {
        });
}

export const SIGN_UP = (name, email, password, image, token, setSpinner, setIsShow, setIsSuccess, setTitle, setName, setEmail, setPassword) => {
    setSpinner(true)
    auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
            let id = auth().currentUser.uid
            ADD_USER(id, name, email, image, token, 'email')
            SEND_EMAIL_VERIFICATION()
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
            if (auth().currentUser.emailVerified) {
                SET_ITEM('ID', auth().currentUser.uid)
                setSpinner(false)
                setEmail('')
                setPassword('')
                navigation.navigate('Home')
            } else {
                setTitle('Your email address is currently unverified')
                setIsShow(true)
                setSpinner(false)
            }
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

export const GET_CURRENT_USER_GOOGLE = async (navigation, token) => {
    const currentUser = await GoogleSignin.getCurrentUser();
    const infoUser = currentUser.user
    let id = auth().currentUser.uid
    SET_ITEM('ID', id)
    ADD_USER(id, infoUser.name, infoUser.email, infoUser.photo, token, 'google')
    navigation.navigate('Home')
};

export const GET_CURRENT_USER_FACEBOOK = (navigation, token) => {
    const infoUser = auth().currentUser
    SET_ITEM('ID', infoUser.uid)
    ADD_USER(infoUser.uid, infoUser.displayName, infoUser.email, infoUser.photoURL, token, 'facebook')
    navigation.navigate('Home')
};

export const GET_ALL_USER = (setAllUsers, setSpinner, setUserName, setImageChoose, setTypeLogin) => {
    setSpinner(true)
    database()
        .ref('/users')
        .on('value', snapshot => {
            let id = auth().currentUser.uid
            let users = []
            let lastMessage, lastTime, lastDate, lastDateTime
            snapshot.forEach(e => {
                if (e.val().id === id) {
                    setUserName(e.val().name)
                    setImageChoose(e.val().image)
                    setTypeLogin(e.val().type)
                    if (Object.keys(snapshot.val()).length == 1) {
                        setSpinner(false)
                    }
                } else {
                    let userTemp = {
                        id: '',
                        name: '',
                        image: '',
                        token: '',
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
                                    setSpinner(false)
                                }
                                userTemp.id = e.val().id
                                userTemp.name = e.val().name
                                userTemp.image = e.val().image
                                userTemp.token = e.val().token
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

export const SEND_PASSWORD_RESET_EMAIL = (email, setIsShow, setIsSuccess, setTitle) => {
    auth().sendPasswordResetEmail(email)
        .then(() => {
            setIsShow(true)
            setIsSuccess(true)
        })
        .catch((error) => {
            setIsShow(true)
            setIsSuccess(false)
            switch (error.code) {
                case 'auth/invalid-email':
                    setTitle('The email address is badly formatted')
                    break;
                case 'auth/user-not-found':
                    setTitle('There is no user record corresponding to this identifier. The user may have been deleted')
                    break;
                default:
                    console.log(error)
            }
        });
}

export const UPDATE_PASSWORD = (newpassword, setIsShow, setIsSuccess,) => {
    const user = auth().currentUser
    user.updatePassword(newpassword).then(() => {
        setIsShow(true)
        setIsSuccess(true)
    }).catch((error) => {
        console.log(error)
    });
}

export const DELETE_USER = (navigation, setIsShow, setIsSuccess, setTitle) => {
    const user = auth().currentUser
    user.delete().then(async () => {
        REMOVE_ITEM('ID')
        navigation.navigate('Login')
        await database().ref('/users/' + user.uid).remove()
        await database().ref('/messages/' + user.uid).remove()
    }).catch((error) => {
        setIsShow(true)
        setIsSuccess(false)
        setTitle('Please login again to delete account')
    });
}