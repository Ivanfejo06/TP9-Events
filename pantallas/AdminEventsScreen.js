import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert } from 'react-native';
import axios from 'axios';
import DBDomain from '../constants/DBDomain.js';

function AdminEventsScreen({ navigation }) {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  const fetchEvents = async () => {
    const now = new Date().toISOString();
    try {
      const response = await axios.get(`${DBDomain}/api/events?start_date=${now}`);
      const events = response.data;

      const upcoming = events.filter(event => new Date(event.start_date) >= new Date());
      const past = events.filter(event => new Date(event.start_date) < new Date());

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEditEvent = (eventId) => {
    navigation.navigate('EditEvent', { id_event: eventId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos Próximos</Text>
      <FlatList
        data={upcomingEvents}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventContainer}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Button title="Ver Detalles" onPress={() => navigation.navigate('EventDetail', { id_event: item.id })} />
            <Button title="Editar" onPress={() => handleEditEvent(item.id)} />
          </View>
        )}
      />
      <Text style={styles.title}>Eventos Pasados</Text>
      <FlatList
        data={pastEvents}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventContainer}>
            <Text style={styles.eventName}>{item.name}</Text>
          </View>
        )}
      />
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
  eventContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  eventName: {
    fontSize: 18,
  },
});

export default AdminEventsScreen;