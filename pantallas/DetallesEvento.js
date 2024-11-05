import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView, SafeAreaView } from 'react-native';
import axios from 'axios';
import DBDomain from '../constants/DBDomain.js';
import { useUserContext } from '../context/userContext.js';

function DetallesEventoScreen({ navigation, route }) {
    const { id_event } = route.params;
    const { usuario, token } = useUserContext();
    const [evento, setEvento] = useState();
    const [error, setError] = useState(null);
    const [capacidadMaxima, setCapacidadMaxima] = useState(0);
    const [inscripciones, setInscripciones] = useState(0);

    const fetchEvents = async () => {
        const urlApi = `${DBDomain}/api/event/${id_event}`;
        try {
            const response = await axios.get(urlApi);
            if (!response.data) throw new Error('No data returned');
            return response.data;
        } catch (error) {
            setError(error.message);
        }
    };

    const inscribirse = async () => {
        const urlApi = `${DBDomain}/api/event/${id_event}/enrollment`;
        try {
            const response = await axios.post(urlApi, {
                id_event: id_event,
                id_user: usuario.id,
                description: '',
                attended: 0,
                observations: '',
                rating: '',
            }, {
                headers: { Authorization: `Bearer ${token}` },
              });

            if (!response.data) {
                throw new Error('No data returned');
            }

            setInscripciones(prev => prev + 1);
            Alert.alert("Inscripción exitosa!");
        } catch (error) {
            Alert.alert("Error", `Hubo un error en la inscripción: ${error}`);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const event = await fetchEvents();
            if (event) {
                setEvento(event);
                setCapacidadMaxima(event.Location?.max_capacity || 0);
            }
        };

        fetchData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {error ? (
                    <Text style={styles.errorText}>Error: {error}</Text>
                ) : evento ? (
                    <>
                        <Text style={styles.titulo}>{evento.name}</Text>
                        <Text style={styles.descripcion}>{evento.description}</Text>
                        <View style={styles.infoContainer}>
                            <Text style={styles.info}>Empieza: {evento.start_date}</Text>
                            <Text style={styles.info}>Duración: {evento.duration_in_minutes} minutos</Text>
                            <Text style={styles.info}>Precio: ${evento.price}</Text>
                            <Text style={styles.info}>Ubicación: {evento.Location?.name || 'Sin ubicación'}</Text>
                            <Text style={styles.info}>Dirección: {evento.Location?.full_address || 'Sin dirección'}</Text>
                            <Text style={styles.info}>Capacidad máxima: {capacidadMaxima}</Text>
                            <Text style={styles.info}>
                                Tags: {Array.isArray(evento.Tags) ? evento.Tags.join(', ') : 'No hay etiquetas disponibles'}
                            </Text>
                            <Text style={styles.info}>Inscripciones: {inscripciones}</Text>
                        </View>
                        <Button title="Inscribirse" onPress={inscribirse} color="#841584" />
                    </>
                ) : (
                    <Text style={styles.loadingText}>Cargando...</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 15,
    },
    scrollContainer: {
        padding: 20,
    },
    titulo: {
        fontSize: 40,
        fontWeight: "bold",
        marginBottom: 30,
        color: "white"
    },
    descripcion: {
        fontSize: 18,
        marginBottom: 15,
        color: '#ccc',
    },
    infoContainer: {
        marginVertical: 10,
        padding: 15,
        backgroundColor: '#222',
        borderRadius: 8,
    },
    info: {
        fontSize: 16,
        marginBottom: 10,
        color: '#ddd',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#fff',
    },
});

export default DetallesEventoScreen;