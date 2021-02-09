import React, {useState} from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import firebase from '../utils/firebase';
import "firebase/firestore";


firebase.firestore().settings({experimentalForceLongPolling: true});

const db = firebase.firestore(firebase);


const AddBirthday = ({user, setShowList, setReloadData}) => {

    const [visibleDatePicker, setVisibleDatePicker] = useState(false);
    const [formData, setFormData] = useState({});
    const [formError, setFormError] = useState({})

    const hideDatePicker = () => {
        setVisibleDatePicker(false);
    };

    const handlerConfirm = (date) => {
        const dateBirth = date;
        dateBirth.setHours(0);
        dateBirth.setMinutes(0);
        dateBirth.setSeconds(0);

        setFormData({...formData, dateBirth});
        hideDatePicker();
    };

    const showDatePicker = () => {
        setVisibleDatePicker(true);
    }

    const onChange = (e, type) =>{
        setFormData({...formData, [type] : e.nativeEvent.text})
    }

    const onSubmit = () =>{
        let errors = {};
        if(!formData.name || !formData.lastName || !formData.dateBirth){
            if(!formData.name) errors.name = true;
            if(!formData.lastName) errors.lastName = true;
            if(!formData.dateBirth) errors.dateBirth = true;
        }else{
            const data = formData;
            data.dateBirth.setYear(0);
            
            db.collection(user.uid).add(data).then( 
                (resp) => {
                    setReloadData(true);
                    setShowList(true);
                }, 
                (err) => {
                    
                }
            ).catch(
                (err) => {
                    setFormError({
                        name: true,
                        lastName:true,
                        dateBirth: true
                    });
                    
                }
            );
        }

        setFormError(errors);
    }

    return (
        <>
            <View style={styles.container}>
                <TextInput 
                    style={[styles.input, formError.name && styles.errorInput]}
                    placeholderTextColor="#969696"
                    placeholder="Nombre"
                    onChange={ (e) => {onChange(e,"name")}}
                />
                <TextInput 
                    style={[styles.input, formError.lastName && styles.errorInput]}
                    placeholderTextColor="#969696"
                    placeholder="Apellidos"
                    onChange={ (e) => {onChange(e,"lastName")}}
                />
                <View style={[styles.input, styles.datepicker, formError.dateBirth && styles.errorInput]}>
                    <Text 
                        style={{
                            color: formData.dateBirth ? "white" : "#969696",
                            fontSize: 18
                        }} 
                        onPress={showDatePicker}
                    >
                            {formData.dateBirth ? moment(formData.dateBirth).format('LL') : 'Fecha Nacimiento:'}
                    </Text>
                </View>
                <TouchableOpacity onPress={onSubmit}>
                    <Text style={styles.txtBtn}>Crear cumpleaños</Text>
                </TouchableOpacity>
                <DateTimePicker
                    isVisible={visibleDatePicker}
                    mode="date"
                    onConfirm={(e) => handlerConfirm(e)}
                    onCancel={hideDatePicker}
                    locale="es_MX"
                />

            </View>
        </>
    )
}

export default AddBirthday;

const styles = StyleSheet.create({
    container:{
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    input:{
        height: 50,
        color: "white",
        width: "80%",
        marginBottom: 25,
        backgroundColor: "#1e3040",
        paddingHorizontal: 20,
        fontSize: 18,
        borderWidth: 1,
        borderColor: "#1e3040",
        borderRadius: 50
    },
    datepicker:{
        justifyContent: "center"
    },
    txtBtn:{
        fontSize: 18,
        color: "#FFF"
    },
    errorInput:{
        borderColor: "#940c0c"
    },
})
