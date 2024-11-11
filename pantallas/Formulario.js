import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard, SafeAreaView, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import DBDomain from '../constants/DBDomain.js';
import { useUserContext } from '../context/userContext.js';

function FormularioScreen({ navigation }) {
  const { usuario, token } = useUserContext();
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

  const newEvent = {
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

  const fetchCategories = async () => {
    const urlApi = `${DBDomain}/api/event_categories`;
    try {
      const response = await fetch(urlApi);
      if (!response.ok) throw new Error('Failed to fetch data');
      return await response.json();
    } catch (error) {
      console.log('Hubo un error en el fetchCategories', error);
    }
  };

  const fetchLocations = async () => {
    const urlApi = `${DBDomain}/api/event_locations`;
    try {
      const response = await fetch(urlApi);
      if (!response.ok) throw new Error('Failed to fetch data');
      return await response.json();
    } catch (error) {
      console.log('Hubo un error en el fetchLocations', error);
    }
  };

  useEffect(() => {
    const fetchAndSetCategories = async () => {
      const data = await fetchCategories();
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
      }
    };
    
    const fetchAndSetLocations = async () => {
      const data = await fetchLocations();
      if (Array.isArray(data) && data.length > 0) {
        setLocations(data);
      }
    };

    fetchAndSetCategories();
    fetchAndSetLocations();
  }, []);

  const openDatePicker = () => setShowDatePicker(true);
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || start_date;
    console.log(currentDate)
    setShowDatePicker(false);
    setStartDate(currentDate);
  };

  const openDurationPicker = () => setDurationPickerOpen(!durationPickerOpen);
  
  const handleDurationChange = (itemValue) => {
    setDurationInMinutes(itemValue);
    setDurationPickerOpen(false);
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

  const openSummaryModal = () => {
    if (validateData()) {
      setModalVisible(true);
    }
  };

  const confirmEventCreation = async () => {
    const urlApi = `${DBDomain}/api/event`;
    try {
        const response = await fetch(urlApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(newEvent),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create event: ${errorText}`);
        }

        const result = await response.json();
        setEventCreated(true);
        setModalVisible(false);
        Alert.alert("Exito!", "Se creó el evento exitosamente");
        navigation.navigate('Home');
    } catch (error) {
        console.log('Hubo un error al crear el evento', error);
        Alert.alert("Error", "No se pudo crear el evento", [{ text: "OK" }]);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Registro de Evento</Text>
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
            <Button title="Seleccionar Fecha" onPress={openDatePicker} />
            {showDatePicker && (
              <DateTimePicker
                value={start_date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
            <Button title={`Duración: ${duration_in_minutes} minutos`} onPress={openDurationPicker} />
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
          <Button title="Confirmar" onPress={openSummaryModal} color="#841584" />
          <Button title="Cancelar" onPress={() => navigation.navigate('Home')} color="#ccc" />

          {/* Modal de resumen */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Resumen del Evento</Text>
              <Text>Nombre: {name}</Text>
              <Text>Descripción: {description}</Text>
              <Text>Categoría: {id_event_category}</Text>
              <Text>Ubicación: {id_event_location}</Text>
              <Text>Fecha: {start_date.toLocaleDateString()}</Text>
              <Text>Duración: {duration_in_minutes} minutos</Text>
              <Text>Precio: {price}</Text>
              <Text>Cantidad máxima: {max_assistance}</Text>
              <View style={styles.buttonContainer}>
                <Button title="Confirmar" onPress={confirmEventCreation} />
                <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#ccc" />
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  },
  title: {
    fontSize: 40, 
    fontWeight: "bold",
    marginBottom: 30,
    color: "white",
    marginTop: 20
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
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  modalView: {
    marginTop: 200,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    width: '100%',
  },
  modalView: {
    marginTop: 200,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // Fondo semitransparente negro para el modal
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo negro semitransparente
    zIndex: 1, // Asegura que el fondo se dibuje detrás del contenido del modal
  },
});

export default FormularioScreen;