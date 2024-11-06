import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import DBDomain from '../constants/DBDomain.js';

function EditEventScreen({ route }) {
  const { id_event } = route.params;
  const [participants, setParticipants] = useState([]);

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`${DBDomain}/api/event/${id_event}/enrollment`);
      setParticipants(response.data);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Participantes</Text>
      <FlatList
        data={participants}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <Text>{item.first_name} {item.last_name}</Text>}
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
});

export default EditEventScreen;