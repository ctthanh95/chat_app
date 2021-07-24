import React from "react";
import { Alert } from "react-native";
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'

export const SIGNUP = (name, email, password, image, navigation) => {
    auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
            let id = auth().currentUser.uid
            database()
                .ref('/users/' + id)
                .set({
                    id: id,
                    name: name,
                    email: email,
                    image: image,
                })
                .then(() => {
                    auth().signOut()
                    Alert.alert(
                        "Alert Title",
                        "Sign Up Success",
                        [
                            { text: "OK", onPress: () => navigation.navigate('Login') }
                        ]
                    );

                })
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

export const SIGNIN = (email, password, navigation) => {
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
