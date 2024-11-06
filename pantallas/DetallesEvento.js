import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView, SafeAreaView } from 'react-native';
import axios from 'axios';
import DBDomain from '../constants/DBDomain.js';
import { useUserContext } from '../context/userContext.js';
import { useFocusEffect } from '@react-navigation/native';  // Importamos useFocusEffect

function DetallesEventoScreen({ navigation, route }) {
    const { id_event } = route.params;
    const { usuario, token } = useUserContext();
    const [evento, setEvento] = useState();
    const [error, setError] = useState(null);
    const [capacidadMaxima, setCapacidadMaxima] = useState(0);
    const [inscripciones, setInscripciones] = useState(0);
    const [usuarioInscripto, setUsuarioInscripto] = useState(false);  // Estado para verificar si el usuario está inscrito.

    // Función para obtener los datos del evento.
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

    // Función para verificar si el usuario está inscrito en el evento.
    const verificarInscripcion = async () => {
        const urlApi = `${DBDomain}/api/event/${id_event}/enrollment`;
        try {
            const response = await axios.get(urlApi, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const isInscribed = response.data.some(item => item.id_user === usuario.id);
            setUsuarioInscripto(isInscribed);
        } catch (error) {
            console.error('Error verifying enrollment:', error);
        }
    };

    // Función para inscribirse al evento.
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
            setUsuarioInscripto(true);  // El usuario ahora está inscrito.
            Alert.alert("Inscripción exitosa!");
        } catch (error) {
            Alert.alert("Error", `Hubo un error en la inscripción: ${error.message}`);
        }
    };

    // Función para cancelar la inscripción.
    const cancelarInscripcion = async () => {
        const urlApi = `${DBDomain}/api/event/${id_event}/enrollment`;
        try {
            const response = await axios.delete(urlApi, {
                data: { id_user: usuario.id },
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.data) {
                throw new Error('No data returned');
            }

            setInscripciones(prev => prev - 1);
            setUsuarioInscripto(false);  // El usuario ha cancelado su inscripción.
            Alert.alert("Inscripción cancelada!");
        } catch (error) {
            Alert.alert("Error", `Hubo un error al cancelar la inscripción: ${error.message}`);
        }
    };

    // Usamos useFocusEffect para ejecutar las funciones cada vez que la pantalla recibe foco.
    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                const event = await fetchEvents();
                if (event) {
                    setEvento(event);
                    setCapacidadMaxima(event.Location?.max_capacity || 0);
                }
            };

            const fetchInscripciones = async () => {
                // Verificar si el usuario ya está inscrito.
                await verificarInscripcion();
            };

            fetchData();
            fetchInscripciones();

        }, [id_event, usuario.id]) // El useFocusEffect se ejecuta cuando cambia el id_event o usuario.id
    );

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

                        {!usuarioInscripto ? (
                            <Button title="Inscribirse" onPress={inscribirse} color="#841584" />
                        ) : (
                            <>
                                <Text style={styles.inscritoText}>Ya estás inscrito en este evento</Text>
                                <Button title="Cancelar inscripción" onPress={cancelarInscripcion} color="red" />
                            </>
                        )}
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
    inscritoText: {
        color: 'green',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },
});

export default DetallesEventoScreen;