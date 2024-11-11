import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, FlatList, SafeAreaView, ScrollView, Modal } from 'react-native';
import axios from 'axios';
import DBDomain from '../constants/DBDomain.js';
import { useUserContext } from '../context/userContext.js';

function EventDetailScreen({ route, navigation }) {
  const { id_event } = route.params;
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const { usuario, token } = useUserContext();

  // Estado para el modal de confirmación
  const [showModal, setShowModal] = useState(false);

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
      console.log(response.data);
      setParticipants(response.data);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await axios.delete(`${DBDomain}/api/event/${id_event}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Si la eliminación es exitosa
      Alert.alert("Éxito", "Evento eliminado correctamente", [{ text: "OK", onPress: () => navigation.navigate('AdminEvents') }]);
    } catch (error) {
      // Verificar si el error tiene un código 400, y mostrar un mensaje específico
      if (error.response && error.response.status === 400) {
        Alert.alert(
          "Error",
          "El evento no está vacío. Debe eliminar todos los participantes antes de poder eliminar el evento."
        );
      } else {
        console.error('Error deleting event:', error);
        Alert.alert("Error", "No se pudo eliminar el evento");
      }
    }
  };  

  const confirmDeleteEvent = () => {
    setShowModal(false); // Cerrar el modal
    handleDeleteEvent();  // Ejecutar la eliminación
  };

  const cancelDeleteEvent = () => {
    setShowModal(false); // Solo cerrar el modal si se cancela
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
            <Button title="Eliminar Evento" onPress={() => setShowModal(true)} color="#841584" />
            <Text style={styles.subtitle}>Participantes</Text>
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

      {/* Modal de confirmación */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={cancelDeleteEvent} // Permite cerrar el modal si el usuario presiona la parte externa
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>¿Estás seguro de que deseas eliminar este evento?</Text>
            <View style={styles.modalButtons}>
              <Button title="Sí" onPress={confirmDeleteEvent} color="red" />
              <Button title="No" onPress={cancelDeleteEvent} />
            </View>
          </View>
        </View>
      </Modal>
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
  subtitle:{
    fontSize: 16,
    marginBottom: 20,
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
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#3b3b3b',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: "white"
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default EventDetailScreen;