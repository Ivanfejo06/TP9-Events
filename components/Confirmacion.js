import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

const ConfirmacionModal = ({ visible, setVisible, newEvent }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <View style={styles.modalView}>
        <Text>¿Confirmar el evento?</Text>
        <Button title="Aceptar" onPress={() => {
          // Aquí puedes manejar la acción de confirmar
          setVisible(false);
        }} />
        <Button title="Cancelar" onPress={() => setVisible(false)} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
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
});

export default ConfirmacionModal;