import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {UserProvider, useUserContext} from './context/userContext.js';
import HomeScreen from './pantallas/Home';
import LoginScreen from './pantallas/Login';
import RegistrarseScreen from './pantallas/Registrarse';
import FormularioScreen from './pantallas/Formulario';
import DetallesEventoScreen from './pantallas/DetallesEvento';
import EditEventScreen from './pantallas/EditEventScreen.js';
import AdminEventsScreen from './pantallas/AdminEventsScreen';
import EventDetailScreen from './pantallas/EventDetailScreen';
const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="Registrarse" component={RegistrarseScreen}/>
          <Stack.Screen name="Home" component={HomeScreen}/>
          <Stack.Screen name="Formulario" component={FormularioScreen}/>
          <Stack.Screen name="DetallesEvento" component={DetallesEventoScreen}/>
          <Stack.Screen name="AdminEvents" component={AdminEventsScreen} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} />
          <Stack.Screen name="EditEvent" component={EditEventScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default Navigation;