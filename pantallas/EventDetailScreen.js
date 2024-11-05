import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, FlatList, SafeAreaView, ScrollView } from 'react-native';
import axios from 'axios';
import DBDomain from '../constants/DBDomain.js';

function EventDetailScreen({ route, navigation }) {
  const { id_event } = route.params;
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`${DBDomain}/api/event/${id_event}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`${DBDomain}/api/event/${id_event}/enrollment`);
      console.log(response.data)
      setParticipants(response.data);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`${DBDomain}/api/event/${id_event}`);
      Alert.alert("Éxito", "Evento eliminado correctamente", [{ text: "OK", onPress: () => navigation.navigate('AdminEvents') }]);
    } catch (error) {
      console.error('Error deleting event:', error);
      Alert.alert("Error", "No se pudo eliminar el evento");
    }
  };

  useEffect(() => {
    fetchEventDetails();
    fetchParticipants();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {event ? (
          <>
            <Text style={styles.title}>{event.name}</Text>
            <Text style={styles.description}>{event.description}</Text>
            <Text style={styles.info}>Fecha: {event.start_date}</Text>
            <Button title="Eliminar Evento" onPress={handleDeleteEvent} color="#841584" />
            <Text style={styles.title}>Participantes</Text>
            <FlatList
              data={participants}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <Text style={styles.participantName}>
                  {item.first_name} {item.last_name} {/* Combina el nombre y apellido */}
                </Text>
              )}
              scrollEnabled={false}
            />
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
    padding: 20,
    backgroundColor: '#000',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 30,
    color: "white"
  },
  description: {
    fontSize: 18,
    marginBottom: 15,
    color: '#ccc',
  },
  info: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 15,
  },
  participantName: {
    color: '#fff',
    marginVertical: 5,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default EventDetailScreen;