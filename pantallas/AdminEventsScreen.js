import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Button, SafeAreaView, ScrollView } from 'react-native';
import axios from 'axios';
import DBDomain from '../constants/DBDomain.js';
import { useUserContext } from '../context/userContext.js';
import { useFocusEffect } from '@react-navigation/native';

function AdminEventsScreen({ navigation }) {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const { token } = useUserContext();

  const fetchEvents = async () => {
    const now = new Date().toISOString();
    try {
      const response = await axios.get(`${DBDomain}/api/event/all/all`, {
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

  // Reemplazamos useEffect por useFocusEffect
  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])  // Dependencia vacía, se ejecutará cada vez que se enfoque la pantalla
  );

  const handleEditEvent = (eventId) => {
    navigation.navigate('EditEvent', { id_event: eventId });
  };

  const renderNoEventsMessage = (type) => {
    return (
      <View style={styles.noEventsContainer}>
        <Text style={styles.noEventsText}>No hay {type} eventos</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Panel de administrador</Text>
      <ScrollView>
        <Text style={styles.subtitle}>Eventos Proximos</Text>
        {upcomingEvents.length === 0 ? (
          renderNoEventsMessage('próximos')
        ) : (
          <FlatList
            data={upcomingEvents}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.flat} 
            renderItem={({ item }) => (
              <View style={styles.eventContainer}>
                <Text style={styles.eventName}>{item.name}</Text>
                <Button title="Ver Detalles" onPress={() => navigation.navigate('EventDetail', { id_event: item.id })} color="#841584" />
                <Button title="Editar" onPress={() => handleEditEvent(item.id)} color="#841584" />
              </View>
            )}
            scrollEnabled={false}
          />
        )}

        <Text style={styles.subtitle}>Eventos Pasados</Text>
        {pastEvents.length === 0 ? (
          renderNoEventsMessage('pasados')
        ) : (
          <FlatList
            data={pastEvents}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.flat} 
            renderItem={({ item }) => (
              <View style={styles.eventContainer}>
                <Text style={styles.eventName}>{item.name}</Text>
              </View>
            )}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 15,
    flex: 1
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 30,
    color: "white",
    textAlign: "center"
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 0,
    color: "white",
    textAlign: "center"
  },
  eventContainer: {
    padding: 15,
    backgroundColor: '#222',
    borderRadius: 8,  
  },
  eventName: {
    fontSize: 18,
    color: '#fff',
    textAlign: "center"
  },
  noEventsContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: '#444',
    borderRadius: 8,
  },
  noEventsText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  flat:{
    width: "auto",
    height: "auto",
    padding: 20
  }
});

export default AdminEventsScreen;