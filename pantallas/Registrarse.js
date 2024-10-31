import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Button, Alert } from 'react-native';
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

            if (response.status !== 200) {
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
        <View style={styles.container}>
            <Text style={styles.title}>Registro de Usuario</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Primer nombre"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="none"
                    style={styles.input}
                />
                <TextInput
                    placeholder="Apellido"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="none"
                    style={styles.input}
                />
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
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
            <Button title="Registrarse" onPress={registrarse} />
            <Button title="¿Ya tienes cuenta?" onPress={() => navigation.navigate('Login')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
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
});

export default RegistrarseScreen;