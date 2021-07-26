import React from "react"
import { Alert } from "react-native";
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import { LoginManager, AccessToken } from 'react-native-fbsdk-next'
import { GoogleSignin } from '@react-native-google-signin/google-signin'



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

export const SIGN_UP = (name, email, password, image) => {
    auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
            let id = auth().currentUser.uid
            ADD_USER(id, name, email, image)
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!')
            }
            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!')
            }
            console.error(error)
        });
}

export const SIGN_IN = (email, password, navigation) => {
    auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
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

export const GET_CURRENT_USER_GOOGLE = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    const infoUser = currentUser.user
    let id = auth().currentUser.uid
    ADD_USER(id, infoUser.name, infoUser.email, infoUser.photo)
};

export const GET_CURRENT_USER_FACEBOOK = async () => {
    const infoUser = auth().currentUser
    ADD_USER(infoUser.uid, infoUser.displayName, infoUser.email, infoUser.photoURL)
};