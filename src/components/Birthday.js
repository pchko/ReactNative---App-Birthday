import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

const Birthday = ({birthday, dateBirthday}) => {

    
    console.log(birthday.days);
    console.log(birthday.dateBirth);
    const past = birthday.days > 0 ? true : false;

    const infoDay = () => {
        return (
            birthday.days === 0 ?
                <Text style={{color: "white"}}>
                    Es su cumpleaños
                </Text>
            :
                <Text style={{color: "black"}}>{-(birthday.days)} {birthday.days === -1 ? 'Día' : 'Días'}</Text>

        )
    }

    return (
        <TouchableOpacity 
            style={[styles.card, past ? styles.past : ( birthday.days === 0 ? styles.actual : styles.current)]} 
            onPress={ () => {
                dateBirthday(birthday)
            }}
        >
            <Text style={styles.username}>{birthday.name} {birthday.lastName}</Text>
            { past ? <Text style={styles.days}>Pasado</Text> : infoDay() }
        </TouchableOpacity>
    )
}

export default Birthday

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 60,
        alignItems: "center",
        paddingHorizontal: 10,
        margin: 10,
        borderRadius: 15
    },
    past:{
        backgroundColor: "#820000",
    },
    current: {
        backgroundColor: "#1ae1f2"
    },
    actual: {
        backgroundColor: "#559204"
    },
    username:{
        color: "white",
        fontSize: 16
    },
    days:{
        color: "white"
    }
})
