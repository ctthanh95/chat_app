import React from "react"
import { Alert } from "react-native";
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import { LoginManager, AccessToken } from 'react-native-fbsdk-next'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
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

export const SIGN_UP = (name, email, password, image, setSpinner, navigation) => {
    setSpinner(true)
    auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
            let id = auth().currentUser.uid
            ADD_USER(id, name, email, image)
            Alert.alert(
                "Alert Title",
                "My Alert Msg",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => navigation.navigate('Login') }
                ]
            );
            setSpinner(false)
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!')
            }
            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!')
            }
            setSpinner(false)
            console.error(error)
        });
}

export const SIGN_IN = (email, password, navigation, setSpinner) => {
    setSpinner(true)
    auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            SET_ITEM('ID', auth().currentUser.uid)
            setSpinner(false)
            navigation.navigate('Home')
        })
        .catch(error => {
            if (error.code === 'auth/wrong-password') {
                console.log('The password is invalid or the user does not have a password');
            }

            if (error.code === 'auth/user-not-found') {
                console.log('There is no user record corresponding to this identifier. The user may have been deleted');
            }
            if (error.code === 'auth/invalid-email') {
                console.log('The email address is badly formatted');
            }
            setSpinner(false)
            console.error(error);
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

export const GET_ALL_USER = (setAllUsers, setSpinner) => {
    setSpinner(true)
    database()
        .ref('/users')
        .on('value', snapshot => {
            let id = auth().currentUser.uid
            let users = []
            snapshot.forEach(e => {
                if (e.val().id === id) {

                } else {
                    users.push({
                        id: e.val().id,
                        name: e.val().name,
                        image: e.val().image,
                    })
                }
            })
            setAllUsers(users)
            setSpinner(false)
        });
}

export const SIGN_OUT = () => {
    auth()
        .signOut()
        .then(() => REMOVE_ITEM('ID'));
}