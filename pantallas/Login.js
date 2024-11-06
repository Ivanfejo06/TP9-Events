import React, { useState, useEffect } from 'react';
import { Button, View, Text, TextInput, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import axios from 'axios';
import DBDomain from '../constants/DBDomain.js';
import { useUserContext } from '../context/userContext.js';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const { token, setToken, usuario, setUsuario } = useUserContext();
  const urlApi = `${DBDomain}/api/user/login`;

  const fetchToken = async () => {
    try {
      const response = await axios.post(urlApi, {
        username: email,
        password: contraseña,
      });

      return response.data;
    } catch (error) {
      console.log('Hubo un error en el login:', error);
      Alert.alert('Error', 'Hubo un error en el login. Intenta de nuevo.');
    }
  };

  const generateToken = async () => {
    if (!email) {
        Alert.alert('Error', 'El correo electrónico es requerido.');
        return;
    }

    const data = await fetchToken();
    console.log('Respuesta del login:', data); // Verificar la estructura de la respuesta

    if (data && data.token) {
        setToken(data.token);

        // Intentar guardar el usuario en el contexto verificando si `usuario` o `user` están presentes
        const userData = data.user;
        if (userData) {
            setUsuario(userData);
            console.log('Usuario guardado en contexto:', userData);
        } else {
            console.warn('No se encontró información de usuario en la respuesta');
        }
    } else {
        Alert.alert('Error', 'Usuario o contraseña inválidos.');
    }
  };

  useEffect(() => {
    setToken(null);
  }, []);

  useEffect(() => {
    if (token !== null) {
      navigation.navigate('Home');
    }
  }, [token]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>App Eventos</Text>
        <Text style={styles.subtitle}>Inicio Sesión</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor={"#ccc"}
          />
          <TextInput
            placeholder="Contraseña"
            value={contraseña}
            onChangeText={setContraseña}
            autoCapitalize="none"
            secureTextEntry
            style={styles.input}
            placeholderTextColor={"#ccc"}
          />
        </View>
        <Button title="Iniciar Sesión" onPress={generateToken} />
        <Button title="¿No tienes cuenta?" onPress={() => navigation.navigate('Registrarse')} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    color:"white"
  },
  title:{
    fontSize: 40, 
    fontWeight: "bold",
    marginBottom: 30,
    color: "white"
  },
  subtitle:{
    fontSize: 16,
    marginBottom: 20,
    color: "white"
  }
});

export default LoginScreen;