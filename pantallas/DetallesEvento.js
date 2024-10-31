import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import DBDomain from '../constants/DBDomain.js';

function DetallesEventoScreen({ navigation, route }) {
    const { id_event } = route.params;
    const [evento, setEvento] = useState();
    const [error, setError] = useState(null);
    const [inscripciones, setInscripciones] = useState(0); // Suponiendo que lo inicializas
    const [capacidadMaxima, setCapacidadMaxima] = useState(evento?.Location?.max_capacity || 0); // Asignar capacidad máxima

    const fetchEvents = async () => {
        const urlApi = `${DBDomain}/api/event/${id_event}`;
        try {
            const response = await axios.get(urlApi);
            if (!response.data) throw new Error('No data returned');

            console.log('data: ', response.data);
            return response.data;
        } catch (error) {
            console.log('Hubo un error en el fetchEvents', error);
            setError(error.message);
        }
    };

    const inscribirse = async () => {
        if (inscripciones >= capacidadMaxima) {
            Alert.alert("No hay plazas disponibles");
            return;
        }
        const urlApi = `${DBDomain}/api/event/${id_event}/enrollment`;
        try {
            const response = await axios.post(urlApi, {
                id_event: id_event,
                id_user: 'user_id_here', // Asegúrate de definir 'id_user' correctamente
                description: '',
                attended: false,
                observations: '',
                rating: '',
            });

            if (!response.data) {
                throw new Error('No data returned');
            }

            setInscripciones(prev => prev + 1); // Incrementa las inscripciones si la inscripción es exitosa
            Alert.alert("Inscripción exitosa!");
            return response.data;
        } catch (error) {
            console.log('Hubo un error en el inscribirse', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const event = await fetchEvents();
            if (event) {
                setEvento(event);
                setCapacidadMaxima(event.Location?.max_capacity || 0); // Establecer capacidad máxima después de obtener el evento
            }
        };

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {error ? (
                    <Text style={styles.errorText}>Error: {error}</Text>
                ) : evento ? (
                    <>
                        <Text style={styles.titulo}>{evento.name}</Text>
                        <Text style={styles.descripcion}>{evento.description}</Text>
                        <Text style={styles.info}>Empieza: {evento.start_date}</Text>
                        <Text style={styles.info}>Duración: {evento.duration_in_minutes} minutos</Text>
                        <Text style={styles.info}>Precio: ${evento.price}</Text>
                        <Text style={styles.info}>Ubicación: {evento.Location?.name || 'Sin ubicación'}</Text>
                        <Text style={styles.info}>Dirección: {evento.Location?.full_address || 'Sin dirección'}</Text>
                        <Text style={styles.info}>Capacidad máxima: {capacidadMaxima}</Text>
                        <Text style={styles.info}>
                            Tags: {Array.isArray(evento.Tags) ? evento.Tags.join(', ') : 'No hay etiquetas disponibles'}
                        </Text>
                        <Button title="Inscribirse" onPress={() => inscribirse()} color="#841584" />
                    </>
                ) : (
                    <Text style={styles.loadingText}>Cargando...</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 15,
    },
    scrollContainer: {
        paddingBottom: 20, // Espacio en la parte inferior para evitar el recorte del contenido
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    descripcion: {
        fontSize: 18,
        marginBottom: 15,
        color: '#555',
    },
    info: {
        fontSize: 16,
        marginBottom: 5,
        color: '#444',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
    },
});

export default DetallesEventoScreen;