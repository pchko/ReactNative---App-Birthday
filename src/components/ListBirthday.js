import React, {useState, useEffect} from 'react'
import { StyleSheet, View, ScrollView, Alert } from 'react-native'
import ActionBar from './ActionBar'
import AddBirthday from './AddBirthday'
import firebase from '../utils/firebase'
import 'firebase/firestore';
import moment from 'moment';
import 'moment-timezone';
import Birthday from './Birthday';

firebase.firestore().settings({experimentalForceLongPolling: true});
const db = firebase.firestore(firebase);

const ListBirthday = ({user}) => {

    const [showList, setShowList] = useState(true);
    const [birthday, setBirthday] = useState([]);
    const [pastBirthday, setPastBirthday] = useState([]);
    const [reloadData, setReloadData] = useState(false);

    useEffect(() => {
        setBirthday([]);
        setPastBirthday([]);
        db.collection(user.uid).orderBy('dateBirth', 'asc').get().then( (resp) => {
            const items = [];
            resp.forEach( (item) => {
                
                const data = item.data();
                data.id = item.id;
                items.push(data);

            });

            formatData(items);
        });

        setReloadData(false);
    }, [reloadData]);

    const formatData = (items) => {
        const currentDate = moment().tz("America/Mexico_City").set({hour: 0, minute: 0, second: 0, millisecond: 0});
        
        const birthdayTempArray = [];
        const pasarBirthdayTempArray = [];

        items.forEach(item => {
            const dateBirth = new Date(item.dateBirth.seconds*1000);
            const dateBirthday = moment(dateBirth).tz("America/Mexico_City");

            const currentYear = moment().tz("America/Mexico_City").get('year');
            dateBirthday.set({year: currentYear});

            const diffDate = currentDate.diff(dateBirthday, 'days');
            const itemTemp = item;
            itemTemp.dateBirth = dateBirthday;
            itemTemp.days = diffDate;

            diffDate <= 0 && birthdayTempArray.push(itemTemp);
            diffDate > 0 && pasarBirthdayTempArray.push(itemTemp);

        });

        setBirthday(birthdayTempArray);
        setPastBirthday(pasarBirthdayTempArray);
    }

    const alertDelete = (userBirthday) => {
        Alert.alert(
            `Eliminar cumpleaños`,
            `Estás segudor de eliminar el cumpleaños de ${user.name} ${user.lastName}`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    onPress: () => {
                        db.collection(user.uid).doc(userBirthday.id).delete().then( (resp) => { 
                            console.log(resp);
                            setReloadData(true);
                        });
                    }
                }
            ],
            {
                cancelable: false
            }
        )
    }

    return (
        <View style={styles.container}>
            {showList ?
                <ScrollView style={styles.scrollview}>
                    {   
                        birthday.map( (item, index) => {
                            return <Birthday key={index} birthday={item} dateBirthday={alertDelete}  />
                        })
                    }

                    {   
                        pastBirthday.map( (item, index) => <Birthday key={index} birthday={item} dateBirthday={alertDelete} />)
                    }
                </ScrollView>
                :
                <AddBirthday user={user} setShowList={setShowList} setReloadData={setReloadData}/>
            }

            <ActionBar showList={showList} setShowList={setShowList}/>
        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        alignItems: "center",
        height: "100%"
    },
    scrollview:{
        marginBottom: 80,
        width: "100%"
    }
})

export default ListBirthday;