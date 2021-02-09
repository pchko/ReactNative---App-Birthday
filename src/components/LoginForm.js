import React, {useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import {validateEmail} from '../utils/validations'
import firebase from '../utils/firebase'

const LoginForm = (props) => {

    const {changeForm} = props;

    const [formError, setformError] = useState({})

    const login = () => {
        console.log("iniciando sesion");
        console.log(formData);
        let errors = {};
        if(!formData.email || !formData.password){
            if(!formData.email) errors.email = true;
            if(!formData.password) errors.password = true;
        }else if(!validateEmail(formData.email)){
            errors.email = true;
        }else{
            firebase.auth().signInWithEmailAndPassword(formData.email, formData.password).then((resp) => {
                console.log(resp);
            }, (err) => {
                console.log(err);
            }).catch(() => {
                setformError({
                    email: true,
                    password: true
                })
            })
        }

        setformError(errors);
    }

    const onChange = (e, type) => {

        setFormData({...formData, [type] : e.nativeEvent.text});
    }

    const [formData, setFormData] = useState(defaultValue());

    return (
        <>
            <TextInput 
                style={[styles.input, formError.email && styles.errorInput]}
                placeholder="Correo electrónico"
                placeholderTextColor="#969696"
                onChange={ 
                    (e) => {
                        onChange(e, "email")
                    }
                }
                keyboardType="email-address"
            />
            <TextInput 
                style={[styles.input, formError.password && styles.errorInput]}
                placeholder="Contraseña"
                placeholderTextColor="#969696"
                secureTextEntry={true}
                onChange={ 
                    (e) => {
                        onChange(e, "password")
                    }
                }
            />
            <TouchableOpacity onPress={login}>
                <Text style={styles.btnText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <View style={styles.register}>
                <TouchableOpacity onPress={changeForm}>
                    <Text style={styles.btnText} >Registrate</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default LoginForm;

const defaultValue = () => {
    return {
        email: "",
        password: ""
    }
}

const styles = StyleSheet.create({
    btnText: {
        color: "white",
        fontSize: 18
    },
    input:{
        height: 50,
        color: "#fff",
        width: "80%",
        marginBottom: 25,
        backgroundColor: "#1e3040",
        paddingHorizontal: 20,
        borderRadius: 50,
        fontSize: 18,
        borderWidth: 1,
        borderColor: "#1e3040"
    },
    errorInput:{
        borderColor: "#940c0c"
    },
    register:{
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 20
    }
});
