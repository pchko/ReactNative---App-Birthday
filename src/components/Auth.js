import React, { useState } from 'react'
import { View, Text, StyleSheet, StyleSheetList, Image } from 'react-native'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'


const Auth = () => {

    const [isLogin, setIsLogin] = useState(true);

    const changeForm = () => {
        setIsLogin(!isLogin);
    }

    return (
        <View style={styles.view}>
            <Image style={styles.logo} source={require('../assets/logo.png')} />
            {/*<Image style={styles.logo} source={{uri: "https://media.giphy.com/media/SWDNzNSPU22M6mOFk0/giphy.gif"}} />*/}
            {isLogin ? (
                <LoginForm changeForm={changeForm}/>
            ): (
                <RegisterForm changeForm={changeForm}/>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: "center"
    },
    logo: {
        width: "80%",
        height: 240,
        marginVertical: 50
    }
});

export default Auth
