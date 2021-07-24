import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

const Home = () => {
    return (
        <View style={styles.container}>
            <Text>Home</Text>
            <Button title="Logout" ></Button>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    }
})
