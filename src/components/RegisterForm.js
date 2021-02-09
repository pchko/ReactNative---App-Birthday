import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput } from 'react-native';
import {validateEmail} from '../utils/validations';
import firebase from '../utils/firebase';

const RegisterForm = (props) => {

    const {changeForm} = props;

    const [formData, setFormData] = useState(defaultValues());

    const [formError, setFormError] = useState({})

    const register = () => {
        let errors = {};
        if(!formData.email || !formData.password || !formData.repeatPassword){
            if(!formData.email) errors.email = true;
            if(!formData.password) errors.password = true;
            if(!formData.repeatPassword) errors.repeatPassword = true;
        }else if(!validateEmail(formData.email)){
            errors.email = true;
        }else if(formData.password !== formData.repeatPassword){
            errors.password = true;
            errors.repeatPassword = true;
        }else if(formData.password.length < 6){
            errors.password = true;
            errors.repeatPassword = true;
        }else{
            console.log("Formulario correcto");
            firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).then((response) => {
                console.log("Cuenta creada", response);
            }, (err) => {
                setFormError({
                    email: true,
                    password: true,
                    repeatPassword: true
                });
                console.log("Error al crear la cuenta", err);
            });
        }

        setFormError(errors);

    }

    return (
        <>
            <TextInput 
                keyboardType="email-address"
                placeholder="Correo electrónico" 
                placeholderTextColor="#969696"
                style={[styles.input, formError.email && styles.errorInput]}
                onChange={e => {
                    setFormData({...formData, email: e.nativeEvent.text})
                }}
            />
            <TextInput 
                placeholder="Contraseña"
                placeholderTextColor="#969696"
                style={[styles.input, formError.password && styles.errorInput]}
                secureTextEntry={true}
                onChange={e => {
                    setFormData({...formData, password: e.nativeEvent.text})
                }}
            />
            <TextInput 
                placeholder="Repetir Contraseña"
                placeholderTextColor="#969696"
                style={[styles.input, formError.repeatPassword && styles.errorInput]}
                secureTextEntry={true}
                onChange={e => {
                    setFormData({...formData, repeatPassword: e.nativeEvent.text})
                }}
            />
            <TouchableOpacity onPress={register}>
                <Text style={styles.btnText} >Registrarse</Text>
            </TouchableOpacity>
            
            <View style={styles.login}>
                <TouchableOpacity onPress={changeForm}>
                    <Text style={styles.btnText}>Iniciar sesión</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default RegisterForm;

const defaultValues = () => 
{
    return {
        email : "",
        password: "",
        repeatPassword: ""
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
    login: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 20
    },
    errorInput:{
        borderColor: "#940c0c"
    }
});
