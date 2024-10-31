import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Pressable, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Importa Axios
import DBDomain from '../constants/DBDomain.js';
import { useUserContext } from '../context/userContext.js';
import EventoCard from '../components/eventoCard.js';

function HomeScreen({ navigation }) {
  const [eventos, setEventos] = useState([]); // Inicializa como un array vacío
  const { token } = useUserContext();

  const fetchEvents = async () => {
    const now = new Date().toISOString();
    const urlApi = `${DBDomain}/api/event?start_date=${now}`;
    
    try {
      const response = await axios.get(urlApi, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = response.data; // Obtiene los datos directamente de la respuesta
      console.log('data: ', data);
      return data;
    } catch (error) {
      console.log('Hubo un error en el fetchEvents', error);
    }
  };

  useEffect(() => {
    const loadEvents = async () => {
      const events = await fetchEvents();
      if (events && events.length > 0) {
        setEventos(events);
      }
    };

    loadEvents();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcomeText}>Bienvenido</Text>
      <View style={styles.buttonContainer}>
        <Button title="Cargar nuevo evento" onPress={() => navigation.navigate('Formulario')} />
      </View>
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id.toString()} // Asegúrate de que cada elemento tenga una clave única
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('DetallesEvento', { id_event: item.id })}>
            <EventoCard props={item} />
          </Pressable>
        )}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f9f9f9', // Color de fondo más suave
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Color del texto
  },
  buttonContainer: {
    marginBottom: 20,
    width: '80%', // Ancho del botón
  },
  flatListContent: {
    paddingBottom: 20, // Padding inferior para el FlatList
  },
});

export default HomeScreen;