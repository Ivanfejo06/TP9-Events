import React, { useState, useEffect } from 'react';
import { Button, View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios'; // Importa Axios
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

      return response.data; // Devuelve los datos directamente
    } catch (error) {
      console.log('Hubo un error en el login:', error);
      Alert.alert('Error', 'Hubo un error en el login. Intenta de nuevo.'); // Alerta de error
    }
  };

  const generateToken = async () => {
    if (!email) {
      Alert.alert('Error', 'El correo electrónico es requerido.'); // Alerta de correo requerido
      return;
    }

    const data = await fetchToken();
    console.log('login:', data);

    // Verifica que los datos contengan el token y el usuario
    if (data && data.token) {
      setToken(data.token);
      // Asegúrate de que data.usuario sea el campo correcto
      setUsuario(data.usuario || data.user); // Establece el usuario si el servidor lo devuelve
      console.log('Usuario guardado en contexto:', data.usuario || data.user);
    } else {
      Alert.alert('Error', 'Usuario o contraseña inválidos.'); // Alerta de credenciales inválidas
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
    <View style={styles.container}>
      <Text>Inicio Sesión</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          value={contraseña}
          onChangeText={setContraseña}
          autoCapitalize="none"
          secureTextEntry
          style={styles.input}
        />
      </View>
      <Button title="Iniciar Sesión" onPress={generateToken} />
      <Button title="¿No tienes cuenta?" onPress={() => navigation.navigate('Registrarse')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
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
  },
});

export default LoginScreen;