import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard, SafeAreaView, Alert } from 'react-native';
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
  const [duration_in_minutes, setDurationInMinutes] = useState(15); // Default to 15 minutes
  const [durationPickerOpen, setDurationPickerOpen] = useState(false);
  const [price, setPrice] = useState('');
  const [max_assistance, setMaxAssistance] = useState('');

  // NewEvent object
  let newEvent = {
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

      const data = await response.json();
      console.log('Data fetched from categories API:', data); 
      if (!data) throw new Error('No data returned');

      return data;
    } catch (error) {
      console.log('Hubo un error en el fetchCategories', error);
    }
  };

  const fetchLocations = async () => {
    const urlApi = `${DBDomain}/api/event_locations`;
    try {
      const response = await fetch(urlApi);
      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();
      if (!data) throw new Error('No data returned');

      console.log('data: ', data);
      return data;
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
    setShowDatePicker(false);
    setStartDate(currentDate);
  };

  const openDurationPicker = () => setDurationPickerOpen(!durationPickerOpen);
  
  const handleDurationChange = (itemValue) => {
    setDurationInMinutes(itemValue);
    setDurationPickerOpen(false);
  };

  const crearEvento = async () => {
    const urlApi = `${DBDomain}/api/event`;
    try {
        console.log('Token utilizado para la autorización:', token);
        console.log('Datos del nuevo evento:', newEvent);
        console.log('Datos del nuevo evento:', usuario);

        const response = await fetch(urlApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(newEvent),
        });

        if (!response.ok) {
            const errorText = await response.text(); // Obtener el texto de error de la respuesta
            throw new Error(`Failed to create event: ${errorText}`);
        }

        const result = await response.json();
        console.log('Evento creado:', result);
        Alert.alert("Éxito", "Evento creado correctamente", [{ text: "OK", onPress: () => navigation.navigate('Home') }]);
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
            />
            <TextInput
              placeholder="Descripción"
              value={description}
              onChangeText={setDescription}
              autoCapitalize="none"
              style={styles.input}
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

            {/* Date Picker */}
            <Button title="Seleccionar Fecha" onPress={openDatePicker} />
            {showDatePicker && (
              <DateTimePicker
                value={start_date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            {/* Duration Picker */}
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
            />
            <TextInput
              placeholder="Cantidad máxima de personas"
              value={max_assistance}
              onChangeText={setMaxAssistance}
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
          <Button title="Confirmar" onPress={crearEvento} />
          <Button title="Cancelar" onPress={() => navigation.navigate('Home')} />
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
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
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
    borderRadius: 5,
  },
  datePicker: {
    width: '100%',
    marginVertical: 10,
  },
});

export default FormularioScreen;