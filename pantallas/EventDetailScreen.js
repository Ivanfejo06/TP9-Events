import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, FlatList } from 'react-native';
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
      const response = await axios.get(`${DBDomain}/api/event/${id_event}/participants`);
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
    <View style={styles.container}>
      {event ? (
        <>
          <Text style={styles.title}>{event.name}</Text>
          <Text>{event.description}</Text>
          <Text>Fecha: {event.start_date}</Text>
          <Button title="Eliminar Evento" onPress={handleDeleteEvent} />
          <Text style={styles.title}>Participantes</Text>
          <FlatList
            data={participants}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <Text>{item.name}</Text>}
          />
        </>
      ) : (
        <Text>Cargando...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
});

export default EventDetailScreen;