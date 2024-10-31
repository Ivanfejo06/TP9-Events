import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import DBDomain from '../constants/DBDomain.js';

const ListadoParticipantesScreen = ({ route }) => {
    const { id_event } = route.params;
    const [participantes, setParticipantes] = useState([]);

    const fetchParticipantes = async () => {
        const urlApi = `${DBDomain}/api/event/${id_event}/participants`;
        try {
            const response = await fetch(urlApi);
            if (!response.ok) throw new Error('Failed to fetch data');

            const data = await response.json();
            setParticipantes(data);
        } catch (error) {
            console.log('Error fetching participantes', error);
        }
    };

    useEffect(() => {
        fetchParticipantes();
    }, []);

    return (
        <View style={styles.container}>
            <Text>Participantes:</Text>
            <FlatList
                data={participantes}
                renderItem={({ item }) => <Text>{item.name}</Text>}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
});

export default ListadoParticipantesScreen;
