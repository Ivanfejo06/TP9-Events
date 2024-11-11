import * as React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
const EventoCard = ({ props }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{props.name || 'Nombre no disponible'}</Text>
      <Text style={styles.descripcion}>{props.description || 'Descripción no disponible'}</Text>
      
      <Text style={styles.subtitulo}>Lugar:</Text>
      <FlatList
        data={props.ubication || []} // Evitar errores si Ubication es undefined
        renderItem={({ item }) => <Text style={styles.item}>{item.item || 'Lugar no disponible'}</Text>}
        keyExtractor={(item) => item.id.toString()} // Asegúrate de que cada item tenga un id
      />
      <Text style={styles.info}>Fecha: {props.start_date || 'Fecha no disponible'}</Text>
      <Text style={styles.info}>Duración: {props.duration_in_minutes || 'Duración no disponible'}</Text>
      <Text style={styles.info}>Precio: {props.price || 'Precio no disponible'}</Text>
      <Text style={styles.info}>Cupos disponibles: {props.enabled_for_enrollment || 'Información no disponible'}</Text>
      <Text style={styles.info}>Cantidad máxima de personas: {props.max_assistance || 'Información no disponible'}</Text>
      <Text style={styles.subtitulo}>Categorías:</Text>
      <FlatList
        data={props.category} // Evitar errores si Category es undefined
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
        keyExtractor={(item) => item.id.toString()} // Asegúrate de que cada item tenga un id
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b3b3b',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#242424',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3, // Para Android
    padding: 15, // Padding general
    marginVertical: 10, // Separación entre tarjetas
    width: '100%', // Ancho de la tarjeta
    alignItems: "center"
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white', // Color del texto
  },
  descripcion: {
    fontSize: 16,
    marginBottom: 15,
    color: 'white', // Color del texto de la descripción
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#AAA', // Color del texto del subtítulo
  },
  item: {
    fontSize: 16,
    color: 'white', // Color azul para los elementos de categoría y ubicación
    marginBottom: 5, // Espaciado entre ítems
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white', // Color del texto de la información
  },
});
export default EventoCard;