import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ScrollView, TextInput, Button, Modal, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import axios from 'axios';
import DBDomain from '../constants/DBDomain.js';
import { useUserContext } from '../context/userContext.js';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'; 

function EditEventScreen({ route, navigation }) {
  const { id_event } = route.params;
  const [evento, setEvento] = useState({});
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [id_event_category, setIdEventCategory] = useState('');
  const [locations, setLocations] = useState([]);
  const [id_event_location, setIdEventLocation] = useState('');
  const [start_date, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [duration_in_minutes, setDurationInMinutes] = useState(15);
  const [durationPickerOpen, setDurationPickerOpen] = useState(false);
  const [price, setPrice] = useState('');
  const [max_assistance, setMaxAssistance] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [eventCreated, setEventCreated] = useState(false);
  const { usuario, token } = useUserContext();

  useEffect(() => {
    fetchEventData();
    fetchAndSetCategories();
    fetchAndSetLocations();
  }, []);

  const fetchEventData = async () => {
    try {
      const response = await axios.get(`${DBDomain}/api/event/${id_event}`);
      const eventData = response.data;
      setEvento(eventData);
      setName(eventData.name || '');
      setDescription(eventData.description || '');
      setIdEventCategory(eventData.id_event_category || '');
      setIdEventLocation(eventData.id_event_location || '');
      // Ensure start_date is a valid Date object
      const fetchedStartDate = new Date(eventData.start_date);
      setStartDate(fetchedStartDate instanceof Date && !isNaN(fetchedStartDate) ? fetchedStartDate : new Date());
      setDurationInMinutes(eventData.duration_in_minutes || 15);
      setPrice(eventData.price?.toString() || '');
      setMaxAssistance(eventData.max_assistance?.toString() || '');
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  };

  const fetchAndSetCategories = async () => {
    try {
      const response = await axios.get(`${DBDomain}/api/event_categories`);
      setCategories(response.data);
    } catch (error) {
      console.log('Error fetching categories:', error);
    }
  };

  const fetchAndSetLocations = async () => {
    try {
      const response = await axios.get(`${DBDomain}/api/event_locations`);
      setLocations(response.data);
    } catch (error) {
      console.log('Error fetching locations:', error);
    }
  };

  const validateData = () => {
    if (!name || !description || !id_event_category || !id_event_location || !price || !max_assistance) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return false;
    }
    if (isNaN(price) || price <= 0) {
      Alert.alert("Error", "El precio debe ser un número mayor a cero");
      return false;
    }
    if (isNaN(max_assistance) || max_assistance <= 0) {
      Alert.alert("Error", "La cantidad máxima de personas debe ser un número mayor a cero");
      return false;
    }
    return true;
  };

  const confirmEventCreation = async () => {
    const newEvent = {
      id: id_event,
      name,
      description,
      id_event_category,
      id_event_location,
      start_date,
      duration_in_minutes,
      price,
      max_assistance,
      id_creator_user: usuario ? usuario.id : null,
    };

    try {
      const response = await axios.put(`${DBDomain}/api/event`, newEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEventCreated(true);
      setModalVisible(false);
      Alert.alert("Éxito", "Evento editado exitosamente");
      navigation.goBack()
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert("Error", "No se pudo editar el evento");
    }
  };

  const handleDurationChange = (itemValue) => {
    setDurationInMinutes(itemValue);
    setDurationPickerOpen(false);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || start_date;
    console.log(currentDate)
    setShowDatePicker(false);
    setStartDate(currentDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Editar evento</Text>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor={"#aaa"}
              />
              <TextInput
                placeholder="Descripción"
                value={description}
                onChangeText={setDescription}
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor={"#aaa"}
              />
              <Picker
                selectedValue={id_event_category}
                onValueChange={(itemValue) => setIdEventCategory(itemValue)}
                style={styles.picker}
              >
                {categories.map((category) => (
                  <Picker.Item key={category.id} label={category.name} value={category.id} />
                ))}
              </Picker>
              <Picker
                selectedValue={id_event_location}
                onValueChange={(itemValue) => setIdEventLocation(itemValue)}
                style={styles.picker}
              >
                {locations.map((location) => (
                  <Picker.Item key={location.id} label={location.name} value={location.id} />
                ))}
              </Picker>

              <Button title="Seleccionar Fecha" onPress={() => setShowDatePicker(true)} />
              {showDatePicker && (
                <DateTimePicker
                  value={start_date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
              <Button title={`Duración: ${duration_in_minutes} minutos`} onPress={() => setDurationPickerOpen(!durationPickerOpen)} />
              {durationPickerOpen && (
                <Picker
                  selectedValue={duration_in_minutes}
                  onValueChange={handleDurationChange}
                  style={styles.picker}
                >
                  {Array.from({ length: 25 }, (_, i) => (i + 1) * 15).map(value => (
                    <Picker.Item key={value} label={`${value} minutos`} value={value} />
                  ))}
                  {Array.from({ length: 13 }, (_, i) => (i + 1) * 30 + 180).map(value => (
                    <Picker.Item key={value} label={`${value} minutos`} value={value} />
                  ))}
                  {Array.from({ length: 6 }, (_, i) => (i + 1) * 60 + 360).map(value => (
                    <Picker.Item key={value} label={`${value} minutos`} value={value} />
                  ))}
                </Picker>
              )}
              <TextInput
                placeholder="Precio"
                value={price}
                onChangeText={setPrice}
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor={"#aaa"}
              />
              <TextInput
                placeholder="Cantidad máxima de personas"
                value={max_assistance}
                onChangeText={setMaxAssistance}
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor={"#aaa"}
              />
            </View>
            <Button title="Confirmar" onPress={() => validateData() && setModalVisible(true)} color="#841584" />
            <Button title="Cancelar" onPress={() => navigation.navigate('Home')} color="#ccc" />

            {/* Modal de confirmación */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Resumen del Evento</Text>
                <Text style={styles.modalText}>Nombre: {name}</Text>
                <Text style={styles.modalText}>Descripción: {description}</Text>
                <Text style={styles.modalText}>Categoría: {id_event_category}</Text>
                <Text style={styles.modalText}>Ubicación: {id_event_location}</Text>
                <Text style={styles.modalText}>Fecha: {start_date.toLocaleDateString()}</Text>
                <Text style={styles.modalText}>Duración: {duration_in_minutes} minutos</Text>
                <Text style={styles.modalText}>Precio: {price}</Text>
                <Text style={styles.modalText}>Cantidad máxima: {max_assistance}</Text>
                <View style={styles.buttonContainer}>
                  <Button title="Confirmar" onPress={confirmEventCreation} />
                  <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#ccc" />
                </View>
              </View>
            </Modal>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
    width: "100%"
  },
  title: {
    fontSize: 40, 
    fontWeight: "bold",
    marginBottom: 30,
    color: "white",
    marginTop: 20,
    textAlign: "center"
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    color: '#fff',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 20,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  modalView: {
    marginTop: 200,
    margin: 20,
    backgroundColor: '#3b3b3b',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    color: "white"
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    color: "white"
  },
  modalText: {
    fontSize: 16,
    color: '#CCC',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    width: '100%',
  }
});

export default EditEventScreen;