import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Button, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import axios from 'axios';
import DBDomain from '../constants/DBDomain.js';
import { useNavigation } from '@react-navigation/native';

const RegistrarseScreen = () => {
    const navigation = useNavigation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');

    const registrarsePost = async () => {
        const urlApi = `${DBDomain}/api/user/register`;
        try {
            const response = await axios.post(urlApi, {
                first_name: firstName,
                last_name: lastName,
                username: email,
                password: contraseña,       
            });

            if (response.status !== 201) {
                throw new Error('Failed to register user');
            }

            console.log('data: ', response.data);
            return response.data;
        } catch (error) {
            console.log('Hubo un error en el register', error);
            Alert.alert('Error', error.message);
        }
    };

    const registrarse = async () => {
        const data = await registrarsePost();
        if (data) {
            console.log('RegistrarsePost: ', data);
            Alert.alert('Éxito', 'Registro exitoso');
            navigation.navigate('Login');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <Text style={styles.title}>App Eventos</Text>
                <Text style={styles.subtitle}>Registrarse</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Primer nombre"
                        value={firstName}
                        onChangeText={setFirstName}
                        autoCapitalize="none"
                        style={styles.input}
                        placeholderTextColor={"#ccc"}
                    />
                    <TextInput
                        placeholder="Apellido"
                        value={lastName}
                        onChangeText={setLastName}
                        autoCapitalize="none"
                        style={styles.input}
                        placeholderTextColor={"#ccc"}
                    />
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
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
                <Button title="Registrarse" onPress={registrarse} />
                <Button title="¿Ya tienes cuenta?" onPress={() => navigation.navigate('Login')} />
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
        padding: 20,
    },
    title: {
        fontSize: 40, 
        fontWeight: "bold",
        marginBottom: 30,
        color: "white",
    },
    subtitle:{
        fontSize: 16,
        marginBottom: 20,
        color: "white"
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
        color:"white"
    },
});

export default RegistrarseScreen;