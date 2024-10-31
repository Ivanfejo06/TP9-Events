import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert } from 'react-native';
import DBDomain from '../constants/DBDomain.js';
import EventoCard from '../components/eventoCard.js';

const ListadoEventosScreen = ({ navigation }) => {
    const [eventosProximos, setEventosProximos] = useState([]);
    const [eventosPasados, setEventosPasados] = useState([]);

    const fetchEventos = async () => {
        const urlApi = `${DBDomain}/api/event`;
        try {
            const response = await fetch(urlApi);
            if (!response.ok) throw new Error('Failed to fetch data');

            const data = await response.json();
            if (!data) throw new Error('No data returned');

            const now = Date.now();
            const proximos = data.filter(evento => new Date(evento.start_date) > now);
            const pasados = data.filter(evento => new Date(evento.start_date) <= now);

            setEventosProximos(proximos);
            setEventosPasados(pasados);
        } catch (error) {
            console.log('Error fetching eventos', error);
        }
    };

    const eliminarEvento = async (id_event) => {
        const urlApi = `${DBDomain}/api/event/${id_event}`;
        try {
            const response = await fetch(urlApi, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete event');

            Alert.alert("Éxito", "Evento eliminado correctamente");
            fetchEventos(); // Refresca el listado
        } catch (error) {
            console.log('Error eliminando evento', error);
        }
    };

    useEffect(() => {
        fetchEventos();
    }, []);

    return (
        <View style={styles.container}>
            <Text>Eventos Próximos</Text>
            <FlatList
                data={eventosProximos}
                renderItem={({ item }) => (
                    <View>
                        <EventoCard props={item} />
                        <Button title="Detalles" onPress={() => navigation.navigate('DetallesEvento', { id_event: item.id })} />
                        <Button title="Eliminar" onPress={() => eliminarEvento(item.id)} />
                    </View>
                )}
                keyExtractor={item => item.id.toString()}
            />

            <Text>Eventos Pasados</Text>
            <FlatList
                data={eventosPasados}
                renderItem={({ item }) => (
                    <EventoCard props={item} />
                )}
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

export default ListadoEventosScreen;
