import { createStackNavigator } from '@react-navigation/stack';
import AdminEventosScreen from './screens/AdminEventosScreen';
import DetallesEventoAdminScreen from './screens/DetallesEventoAdminScreen';
import ListadoParticipantesScreen from './screens/ListadoParticipantesScreen';

const Stack = createStackNavigator();

function AdminNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="AdminEventos" component={AdminEventosScreen} />
            <Stack.Screen name="DetallesEvento" component={DetallesEventoAdminScreen} />
            <Stack.Screen name="ListadoParticipantes" component={ListadoParticipantesScreen} />
        </Stack.Navigator>
    );
}