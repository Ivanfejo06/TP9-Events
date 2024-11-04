import { createStackNavigator } from '@react-navigation/stack';
import ParticipantsListScreen from './ParticipantListScreen';
import AdminEventsScreen from './AdminEventsScreen';
import EventDetailScreen from './EventDetailScreen';

const Stack = createStackNavigator();

function AdminNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="AdminEvents" component={AdminEventsScreen} />
            <Stack.Screen name="EventDetail" component={EventDetailScreen} />
            <Stack.Screen name="ParticipantsList" component={ParticipantsListScreen} />
        </Stack.Navigator>
    );
}