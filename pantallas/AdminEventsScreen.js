import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';
import DBDomain from '../constants/DBDomain.js';
import { useUserContext } from '../context/userContext.js';

function AdminEventsScreen({ navigation }) {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const { token } = useUserContext();

  const fetchEvents = async () => {
    const now = new Date().toISOString();
    try {
      const response = await axios.get(`${DBDomain}/api/event?start_date=${now}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Eventos Próximos</Text>
      <FlatList
        data={upcomingEvents}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventContainer}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Button title="Ver Detalles" onPress={() => navigation.navigate('EventDetail', { id_event: item.id })} color="#841584" />
            <Button title="Editar" onPress={() => handleEditEvent(item.id)} color="#841584" />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#000',
    paddingHorizontal: 15
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 30,
    color: "white"
  },
  eventContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#222',
    borderRadius: 8,
  },
  eventName: {
    fontSize: 18,
    color: '#fff',
  },
});

export default AdminEventsScreen;