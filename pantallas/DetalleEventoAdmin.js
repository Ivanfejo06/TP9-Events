import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Alert } from 'react-native';
import DBDomain from '../constants/DBDomain.js';

const DetalleEventoAdminScreen = ({ navigation, route }) => {
    const { id_event } = route.params;
    const [evento, setEvento] = useState();
    const [participantes, setParticipantes] = useState([]);

    const fetchEvento = async () => {
        const urlApi = `${DBDomain}/api/event/${id_event}`;
        try {
            const response = await fetch(urlApi);
            if (!response.ok) throw new Error('Failed to fetch data');

            const data = await response.json();
            setEvento(data);
        } catch (error) {
            console.log('Error fetching evento', error);
        }
    };

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

    const eliminarEvento = async () => {
        const urlApi = `${DBDomain}/api/event/${id_event}`;
        try {
            const response = await fetch(urlApi, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete event');

            Alert.alert("Éxito", "Evento eliminado correctamente");
            navigation.goBack();
        } catch (error) {
            console.log('Error eliminando evento', error);
        }
    };

    useEffect(() => {
        fetchEvento();
        fetchParticipantes();
    }, []);

    return (
        <View style={styles.container}>
            {evento && (
                <>
                    <Text>Evento: {evento.name}</Text>
                    <Text>Descripción del evento: {evento.description}</Text>
                    <Text>Fecha: {evento.start_date}</Text>
                    <Button title="Eliminar Evento" onPress={eliminarEvento} />
                    <Text>Participantes:</Text>
                    <FlatList
                        data={participantes}
                        renderItem={({ item }) => <Text>{item.name}</Text>}
                        keyExtractor={item => item.id.toString()}
                    />
                </>
            )}
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

export default DetalleEventoAdminScreen;
